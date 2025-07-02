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
        const researchDocuments = await ResearchDocuments.create({
          document_title_id: req.body.document_title_id,
          document_filepath: req.body.document_filepath,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({ResearchDocuments: researchDocuments, Message: 'ResearchDocuments entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  uploadProfilePic: async (req, res) => {
    let file = req.file;
    if (!file || file.length === 0) {
      return res.status(NOT_FOUND).json({ message: 'No file uploaded' });
    }

    if (!file.path) {
      return res.status(PRECONDITION_FAILED).json({ message: 'Error uploading file' });
    }

    let filePath = file.path.split("storage")[1];

    try {
      if (!profilePic) {
        await fs.promises.unlink(file.path);
        return res.status(NOT_FOUND).json({ message: `No matching record for user_account_id: ${req.params.id}` });
      }
      await sequelize.transaction(async (t) => {
        // Remove old profile image file if it exists and is different from new file
        if (profilePic.profile_image && profilePic.profile_image !== filePath) {
          try {
            await fs.promises.unlink(`./storage${profilePic.profile_image}`);
          } catch (error) {
            if (error.code === "ENOENT") {
              console.log(`File ${profilePic.profile_image} does not exist.`);
            } else {
              console.log(`Error deleting file ${profilePic.profile_image}: ${error.message}`);
            }
          }
        }
        await profilePic.update({
          profile_image: filePath,
          updated_by: req.user.id
        }, { transaction: t });

        res.status(OK).json(profilePic)
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
