const express = require('express');
const auth = require('../../middlewares/auth/verify_user_account');
const db = require('../../models');
const applications = require('../../services/notifications/applications');
const { specs } = require('../../services/notifications/service');

// Keep the existing URLs while routing creation, reads, and decisions through account-scoped handlers.
module.exports = function formRoutes(type, legacy) {
  const router = express.Router();
  const spec = specs[type];
  router.use(auth);
  router.post('/create', applications.createForm(type));
  router.get('/all', applications.listForms(type));
  router.get('/user', applications.listForms(type, true));
  router.get('/:id', applications.getForm(type));
  const owned = handler => async (req, res) => {
    try {
      const form = await db[spec.model].findOne({ where: { id: req.params.id, created_by: req.user.id } });
      if (!form) return res.status(404).json({ message: 'Application is unavailable.' });
      return handler(req, res);
    } catch { return res.status(500).json({ message: 'Application is unavailable. Please try again.' }); }
  };
  router.put('/:id', (req, res, next) => {
    if (req.body.status_id === undefined) return next();
    req.params.research_id = req.params.id;
    req.params.form_type_id = spec.formType;
    return applications.reviewForm(req, res);
  }, owned(legacy.update));
  router.delete('/:id', owned(legacy.delete));
  return router;
};
