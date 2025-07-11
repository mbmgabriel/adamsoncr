const { Op } = require("sequelize");

const { ResearchDocuments, sequelize } = require("../../models");
const { researchDocumentsValidator } = require("../research_documents/research_documents_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');
const fs = require('fs');


const ResearchDocumentsController = {
  create: async (req, res) => {
    const matched = researchDocumentsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'ResearchDocuments required'});
    }

    let file = req.file;
    if (!file || file.length === 0) {
      return res.status(NOT_FOUND).json({ message: 'No file uploaded' });
    }

    if (!file.path) {
      return res.status(PRECONDITION_FAILED).json({ message: 'Error uploading file' });
    }

    let filePath = file.path.split("storage")[1];

    try {
      await sequelize.transaction(async (t) => {

        const researchDoc = await ResearchDocuments.create({
          research_id: req.params.research_id,
          document_title_id: req.params.document_title_id,
          document_filepath: filePath,
          created_at: req.user.id,
          },
          { transaction: t }
        );

        res.status(OK).json({ResearchDocuments: researchDoc})
        return;
      });
    } catch (error) {
      if (filePath) {
        try {
          await fs.promises.unlink(file.path);
        } catch (error) {
          if (error.code === "ENOENT") {
            console.log(`File ${filePath} does not exist.`);
          } else {
            console.log(`Error deleting file ${filePath}: ${error.message}`);
          }
        }
      }
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      return;
    }
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchDocumentss = await ResearchDocuments.findAll({
          attributes: ['research_id','document_title_id','document_filepath'],
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
          attributes: ['research_id','document_title_id','document_filepath'],
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

documentUpdate: async (req, res) => {
    let file = req.file;
    if (!file || file.length === 0) {
      return res.status(NOT_FOUND).json({ message: 'No file uploaded' });
    }

    if (!file.path) {
      return res.status(PRECONDITION_FAILED).json({ message: 'Error uploading file' });
    }

    let filePath = file.path.split("storage")[1];

    try {
      const doc = await ResearchDocuments.findOne({
        where: {
          research_id: req.params.research_id,
          document_title_id: req.params.document_title_id,
        },
      });

      if (!doc) {
        await fs.promises.unlink(file.path);
        return res.status(NOT_FOUND).json({ message: `No matching record: ${req.params.research_id} file ${req.params.document_title_id}` });
      }
      await sequelize.transaction(async (t) => {
        // Remove old file if it exists and is different from new file
        if (doc.document_filepath && doc.document_filepath !== filePath) {
          try {
            await fs.promises.unlink(`./storage${doc.document_filepath}`);
          } catch (error) {
            if (error.code === "ENOENT") {
              console.log(`File ${doc.document_filepath} does not exist.`);
            } else {
              console.log(`Error deleting file ${doc.document_filepath}: ${error.message}`);
            }
          }
        }
        await doc.update({
          document_filepath: filePath,
          updated_by: req.user.id
        }, { transaction: t });

        res.status(OK).json(doc)
        return;
      });
    } catch (error) {
      if (filePath) {
        try {
          await fs.promises.unlink(file.path);
        } catch (error) {
          if (error.code === "ENOENT") {
            console.log(`File ${filePath} does not exist.`);
          } else {
            console.log(`Error deleting file ${filePath}: ${error.message}`);
          }
        }
      }
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
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
