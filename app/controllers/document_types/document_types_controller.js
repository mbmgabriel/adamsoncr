const { Op } = require("sequelize");

const { DocumentTypes, sequelize } = require("../../models");
const { documentTypesValidator } = require("../document_types/document_types_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const DocumentTypesController = {
  create: async (req, res) => {
    const matched = documentTypesValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'DocumentTypes required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const documentTypess = await DocumentTypes.create({
          document_name: req.body.document_name,

          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({DocumentTypes: documentTypess, Message: 'DocumentTypes entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const documentTypess = await DocumentTypes.findAll({
          attributes: ['document_name'],
        });
        res.status(OK).json({DocumentTypes: documentTypess});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const documentTypess = await DocumentTypes.findAll({
          attributes: ['document_name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({DocumentTypes: documentTypess});
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

        const documentTypess = await DocumentTypes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!documentTypess) {
          res.status(NOT_FOUND).json({
            Message: `No matching DocumentTypes entry with id ${req.params.id}`,
          });
          return;
        }

        await documentTypess.update({
          document_name: req.body.document_name,

          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          DocumentTypes: documentTypess,
          Message: "DocumentTypes entry updated.",
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
        const documentTypess = await DocumentTypes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!documentTypess) {
          res.status(NOT_FOUND).json({
            Message: `No matching DocumentTypes entry with id : ${req.params.id}`,
          });

          return;
        }
        await documentTypess.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `DocumentTypes entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.DocumentTypesController = DocumentTypesController;
