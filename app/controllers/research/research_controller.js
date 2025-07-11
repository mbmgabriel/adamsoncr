const { Op } = require("sequelize");


const { Research, ResearchDocuments, ResearchCategory, Endorsements, EndorsementRepresentative, ResearchInvestigators, DocumentTypes,  sequelize } = require("../../models");
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');
const { researchValidator } = require("../research/research_validator")


const ResearchController = {
  create: async (req, res) => {
    const matched = researchValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'Role Name required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const researchs = await Research.create({
          title: req.body.title,
          category: req.body.category,
          purpose_id: req.body.purpose_id,
          version_number: req.body.version_number,
          research_duration: req.body.research_duration,
          ethical_considerations: req.body.ethical_considerations,
          submitted_by: req.body.submitted_by,
          submitted_date: req.body.submitted_date,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({Research: researchs, Message: 'Research entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researches = await Research.findAll({
          attributes: ['id','title','category','purpose_id','version_number','research_duration','ethical_considerations','submitted_by','submitted_date'],
        });
        res.status(OK).json(researches);
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const research = await Research.findOne({
          attributes: ['id','title','category','purpose_id','version_number','research_duration','ethical_considerations','submitted_by','submitted_date'],
          where: {id: req.params.id},
          include: [
            {
              model: Endorsements,
              attributes: ['status'],
              include: [
                {
                  model: EndorsementRepresentative,
                  attributes: ['rep_name']
                }
              ]
            },
            {
              model: ResearchInvestigators,
              attributes: ['id_number','first_name','middle_name','last_name','mobile_number','email','college','dept'],
            },
            {
              model: ResearchDocuments,
              attributes: ['document_title_id','document_filepath'],
              include: [
                {
                  model: DocumentTypes,
                  attributes: ['document_name']
                }
              ]
            }
          ]
        });

        const category_ids = research?.category?.split(",")?.map(item=>parseInt(item))

        const categories = await ResearchCategory.findAll({
          attributes: ['id','research_name'],
          where: {id: category_ids}
        })


        const response = {
          title: research?.title,
          category: categories,
          purpose_id: research?.purpose_id,
          version_number: research?.version_number,
          research_duration: research?.research_duration,
          ethical_considerations: research?.ethical_considerations,
          submitted_by: research?.submitted_by,
          submitted_date: research?.submitted_date,
          endorsements: research?.Endorsements?.map(e=> {
              const rep = e?.EndorsementRepresentative
              return ({
                status: e?.status,
                rep_name: rep?.rep_name,
              })
            }),
          research_investigators: research?.ResearchInvestigators?.map(item => ({
            id_number: item.id_number,
            name: `${item?.first_name} ${item?.middle_name||''}${item?.middle_name?' ':''}${item?.last_name}`,
            mobile_number: item.mobile_number,
            email: item.email,
            college: item.college,
            dept: item.dept,
          })),
          research_documents: research?.ResearchDocuments?.map(item => {
            const doc_type = item?.DocumentType;
            return ({
              document_title_id: item?.document_title_id,
              document_filepath: item?.document_filepath,
              document_name: doc_type?.document_name,
            })
          })
        }

        // res.status(OK).json({Research: research, Categories: categories});
        res.status(OK).json({Research: response});
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

        const researchs = await Research.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchs) {
          res.status(NOT_FOUND).json({
            Message: `No matching User Role with id ${req.params.id}`,
          });
          return;
        }

        await researchs.update({
          title: req.body.title || researchs.title,
          category: req.body.category || researchs.category,
          purpose_id: req.body.purpose_id || researchs.purpose_id,
          version_number: req.body.version_number || researchs.version_number,
          research_duration: req.body.research_duration || researchs.research_duration,
          ethical_considerations: req.body.ethical_considerations || researchs.ethical_considerations,
          submitted_by: req.body.submitted_by || researchs.submitted_by,
          submitted_date: req.body.submitted_date || researchs.submitted_date,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Research: researchs,
          Message: "Research entry updated.",
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
        const researchs = await Research.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchs) {
          res.status(NOT_FOUND).json({
            Message: `No matching Research entry with id : ${req.params.id}`,
          });

          return;
        }
        await researchs.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `Research entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

};

module.exports.ResearchController = ResearchController;
