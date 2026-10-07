const { Op } = require("sequelize");

const { CAttachmentInfos, sequelize } = require("../../models");
const { cAttachmentInfosValidator } = require("../c_attachment_infos/c_attachment_infos_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const CAttachmentInfosController = {
  create: async (req, res) => {
    const matched = cAttachmentInfosValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'CAttachmentInfos required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const cAttachmentInfoss = await CAttachmentInfos.create({
          incentive_form_id: req.body.incentive_form_id,
          info_id: req.body.info_id,
          is_active: req.body.is_active,
          attachment_file: req.body.attachment_file,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({CAttachmentInfos: cAttachmentInfoss, Message: 'CAttachmentInfos entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const cAttachmentInfoss = await CAttachmentInfos.findAll({
          attributes: ['incentive_form_id','info_id','is_active','attachment_file'],
        });
        res.status(OK).json({CAttachmentInfos: cAttachmentInfoss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const cAttachmentInfoss = await CAttachmentInfos.findAll({
          attributes: ['incentive_form_id','info_id','is_active','attachment_file'],
          where: {id: req.params.id},
        });

        res.status(OK).json({CAttachmentInfos: cAttachmentInfoss});
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  update: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {

        const cAttachmentInfoss = await CAttachmentInfos.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!cAttachmentInfoss) {
          res.status(NOT_FOUND).json({
            Message: `No matching CAttachmentInfos entry with id ${req.params.id}`,
          });
          return;
        }

        await cAttachmentInfoss.update({
          incentive_form_id: req.body.incentive_form_id ? req.body.incentive_form_id : cAttachmentInfoss.incentive_form_id,
          info_id: req.body.info_id ? req.body.info_id : cAttachmentInfoss.info_id,
          is_active: req.body.is_active ? req.body.is_active : cAttachmentInfoss.is_active,
          attachment_file: req.body.attachment_file ? req.body.attachment_file : cAttachmentInfoss.attachment_file,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          CAttachmentInfos: cAttachmentInfoss,
          Message: "CAttachmentInfos entry updated.",
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  delete: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const cAttachmentInfoss = await CAttachmentInfos.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!cAttachmentInfoss) {
          res.status(NOT_FOUND).json({
            Message: `No matching CAttachmentInfos entry with id : ${req.params.id}`,
          });

          return;
        }
        await cAttachmentInfoss.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `CAttachmentInfos entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.CAttachmentInfosController = CAttachmentInfosController;
