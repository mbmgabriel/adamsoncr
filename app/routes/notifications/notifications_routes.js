const router = require('express').Router();
const { Op } = require('sequelize');
const db = require('../../models');
const auth = require('../../middlewares/auth/verify_user_account');
const unread = { [Op.or]: [{ read_status: { [Op.ne]: 1 } }, { read_status: null }] };
const scope = req => ({ user_account_id: req.user.id });
const wrap = fn => async (req, res) => {
  try { await fn(req, res); } catch (error) {
    console.error('Notification request failed:', error.name);
    res.status(500).json({ message: 'Notifications are unavailable. Please try again.' });
  }
};
router.use(auth);
router.get('/', wrap(async (req, res) => {
  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50 || (req.query.unread !== undefined && !['true', 'false'].includes(req.query.unread))) {
    return res.status(400).json({ message: 'Invalid notification query.' });
  }
  const filters = [scope(req)];
  if (req.query.unread === 'true') filters.push(unread);
  if (req.query.cursor) {
    try {
      const cursor = JSON.parse(Buffer.from(req.query.cursor, 'base64url').toString());
      if (!Number.isSafeInteger(cursor.id) || cursor.id < 1 || typeof cursor.date !== 'string' || !Number.isFinite(Date.parse(cursor.date))) throw new Error();
      filters.push({ [Op.or]: [{ created_at: { [Op.lt]: new Date(cursor.date) } },
        { created_at: new Date(cursor.date), id: { [Op.lt]: cursor.id } }] });
    } catch { return res.status(400).json({ message: 'Invalid notification cursor.' }); }
  }
  const [rows, unread_count] = await Promise.all([
    db.notifications.findAll({ where: { [Op.and]: filters }, order: [['created_at', 'DESC'], ['id', 'DESC']], limit: limit + 1 }),
    db.notifications.count({ where: { ...scope(req), ...unread } }),
  ]);
  const hasMore = rows.length > limit;
  const notifications = rows.slice(0, limit).map(row => ({ id: row.id, notification: row.notification,
    event_type: row.event_type, application_type: row.application_type, application_id: row.application_id,
    target_path: row.target_path, read_status: Number(row.read_status) === 1 ? 1 : 0, created_at: row.created_at }));
  const last = notifications[notifications.length - 1];
  res.json({ notifications, unread_count, next_cursor: hasMore ? Buffer.from(JSON.stringify({ id: last.id, date: last.created_at })).toString('base64url') : null });
}));
router.patch('/read-all', wrap(async (req, res) => {
  await db.notifications.update({ read_status: 1, updated_by: req.user.id }, { where: { ...scope(req), ...unread } });
  res.json({ message: 'Notifications marked as read.' });
}));
router.patch('/:id/read', wrap(async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ message: 'Invalid notification ID.' });
  const row = await db.notifications.findOne({ where: { ...scope(req), id: req.params.id } });
  if (!row) return res.status(404).json({ message: 'Notification not found.' });
  if (Number(row.read_status) !== 1) await row.update({ read_status: 1, updated_by: req.user.id });
  res.json({ message: 'Notification marked as read.' });
}));
module.exports = router;
