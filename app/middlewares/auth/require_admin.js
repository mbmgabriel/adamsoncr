const {
  UserRole
} = require('../../models');
module.exports = async (req, res, next) => {
  try {
    const role = await UserRole.findByPk(req.user.role_id);
    if (!role || role.role_name !== 'Administrator') return res.status(403).json({
      message: 'Administrator access is required.'
    });
    next();
  } catch (error) {
    next(error);
  }
};
