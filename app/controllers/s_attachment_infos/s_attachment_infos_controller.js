const { Op } = require("sequelize");

const { SAttachmentInfos, sequelize } = require("../../models");
const { sAttachmentInfosValidator } = require("../s_attachment_infos/s_attachment_infos_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const SAttachmentInfosController = {
  create: async (req, res) => {
    const matched = sAttachmentInfosValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'SAttachmentInfos required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const sAttachmentInfoss = await SAttachmentInfos.create({
          name: req.body.name,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({SAttachmentInfos: sAttachmentInfoss, Message: 'SAttachmentInfos entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sAttachmentInfoss = await SAttachmentInfos.findAll({
          attributes: ['name'],
        });
        res.status(OK).json({SAttachmentInfos: sAttachmentInfoss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sAttachmentInfoss = await SAttachmentInfos.findAll({
          attributes: ['name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({SAttachmentInfos: sAttachmentInfoss});
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

        const sAttachmentInfoss = await SAttachmentInfos.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sAttachmentInfoss) {
          res.status(NOT_FOUND).json({
            Message: `No matching SAttachmentInfos entry with id ${req.params.id}`,
          });
          return;
        }

        await sAttachmentInfoss.update({
          name: req.body.name ? req.body.name : sAttachmentInfoss.name,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          SAttachmentInfos: sAttachmentInfoss,
          Message: "SAttachmentInfos entry updated.",
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
        const sAttachmentInfoss = await SAttachmentInfos.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sAttachmentInfoss) {
          res.status(NOT_FOUND).json({
            Message: `No matching SAttachmentInfos entry with id : ${req.params.id}`,
          });

          return;
        }
        await sAttachmentInfoss.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `SAttachmentInfos entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.SAttachmentInfosController = SAttachmentInfosController;
