const { Op } = require("sequelize");

const { ResearchDocuments, sequelize } = require("../../models");
const { researchDocumentsValidator } = require("../research_documents/research_documents_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const ResearchDocumentsController = {
  create: async (req, res) => {
    const matched = researchDocumentsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'ResearchDocuments required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const researchDocumentss = await ResearchDocuments.create({
          document_title_id: req.body.document_title_id,
          document_filepath: req.body.document_filepath,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({ResearchDocuments: researchDocumentss, Message: 'ResearchDocuments entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchDocumentss = await ResearchDocuments.findAll({
          attributes: ['document_title_id','document_filepath'],
        });
        res.status(OK).json({ResearchDocuments: researchDocumentss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchDocumentss = await ResearchDocuments.findAll({
          attributes: ['document_title_id','document_filepath'],
          where: {id: req.params.id},
        });

        res.status(OK).json({ResearchDocuments: researchDocumentss});
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

        const researchDocumentss = await ResearchDocuments.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchDocumentss) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchDocuments entry with id ${req.params.id}`,
          });
          return;
        }

        await researchDocumentss.update({
          document_title_id: req.body.document_title_id,
          document_filepath: req.body.document_filepath,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          ResearchDocuments: researchDocumentss,
          Message: "ResearchDocuments entry updated.",
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
        const researchDocumentss = await ResearchDocuments.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchDocumentss) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchDocuments entry with id : ${req.params.id}`,
          });

          return;
        }
        await researchDocumentss.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `ResearchDocuments entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.ResearchDocumentsController = ResearchDocumentsController;
