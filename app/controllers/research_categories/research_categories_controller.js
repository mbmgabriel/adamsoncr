const { Op } = require("sequelize");

const { ResearchCategory, sequelize } = require("../../models");
const { researchCategoryValidator } = require("../research_categories/research_categories_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const ResearchCategoryController = {
  create: async (req, res) => {
    const matched = researchCategoryValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'ResearchCategory required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const researchCategorys = await ResearchCategory.create({
          research_name: req.body.research_name,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({ResearchCategory: researchCategorys, Message: 'ResearchCategory entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchCategorys = await ResearchCategory.findAll({
          attributes: ['id','research_name'],
        });
        res.status(OK).json({ResearchCategory: researchCategorys});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchCategorys = await ResearchCategory.findAll({
          attributes: ['id','research_name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({ResearchCategory: researchCategorys});
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

        const researchCategorys = await ResearchCategory.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchCategorys) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchCategory entry with id ${req.params.id}`,
          });
          return;
        }

        await researchCategorys.update({
          research_name: req.body.research_name,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          ResearchCategory: researchCategorys,
          Message: "ResearchCategory entry updated.",
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
        const researchCategorys = await ResearchCategory.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchCategorys) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchCategory entry with id : ${req.params.id}`,
          });

          return;
        }
        await researchCategorys.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `ResearchCategory entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.ResearchCategoryController = ResearchCategoryController;
