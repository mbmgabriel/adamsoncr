const { Op } = require("sequelize");


const { Research, ResearchDocuments,Departments,  ResearchCategory, Endorsements, EndorsementRepresentative, ResearchInvestigators, DocumentTypes, BudgetBreakdownDetails, ResearchPurpose, StatusTables, User, UserAccount, UserRole, sequelize } = require("../../models");
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');
const { researchValidator } = require("../research/research_validator")


const ResearchController = {
  create: async (req, res) => {
    const matched = researchValidator(req.body, res).validate()

    if (!matched) {
      res.status(PRECONDITION_FAILED).json({ message: 'Role Name required' });
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
          // submitted_by: req.body.submitted_by,
          submitted_date: req.body.submitted_date,
          status_id: req.body.status_id,
          created_by: req.user.id,
        },
          { transaction: t }
        );
        res.status(CREATED).json({ Research: researchs, Message: 'Research entry created.' });
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  comprehensiveCreate: async (req, res) => {
    const matched = researchValidator(req.body, res).validate()

    if (!matched) {
      res.status(PRECONDITION_FAILED).json({ message: 'Role Name required' });
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
          status_id: req.body.status_id,
          created_at: req.user.id,
        },
          { transaction: t }
        );


        res.status(CREATED).json({ Research: researchs, Message: 'Research entry created.' });
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researches = await Research.findAll({
          attributes: ['id', 'title', 'category', 'purpose_id', 'version_number', 'research_duration', 'ethical_considerations', 'submitted_by', 'submitted_date', 'status_id'],
          include: [
            {
              model: User,
              attributes: ['first_name','middle_name','last_name','dept_id'],
              include: [
                {model: Departments,attributes: ['dept_name']}
              ]
            },  
          ]
          
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
          attributes: ['id', 'title', 'category', 'purpose_id', 'version_number', 'research_duration', 'ethical_considerations', 'submitted_by', 'submitted_date', 'status_id'],
          where: { id: req.params.id },
          include: [
            {
              model: User,
              attributes: ['first_name','middle_name','last_name','dept_id'],
              include: [
                {model: Departments,attributes: ['dept_name']}
              ]
            },
            {
              model: Endorsements,
              attributes: ['status', 'remarks'],
              include: [
                {
                  model: EndorsementRepresentative,
                  attributes: ['rep_name']
                }
              ]
            },
            {
              model: ResearchInvestigators,
              attributes: ['id_number', 'first_name', 'middle_name', 'last_name', 'mobile_number', 'email', 'college', 'dept'],
            },
            {
              model: ResearchDocuments,
              attributes: ['document_title_id', 'document_filepath'],
              include: [
                {
                  model: DocumentTypes,
                  attributes: ['document_name']
                }
              ]
            }
          ]
        });

        const category_ids = research?.category?.split(",")?.map(item => parseInt(item))

        const categories = await ResearchCategory.findAll({
          attributes: ['id', 'research_name'],
          where: { id: category_ids }
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
          endorsements: research?.Endorsements?.map(e => {
            const rep = e?.EndorsementRepresentative
            return ({
              status_id: e?.status_id,
              remarks: e?.remarks,
              rep_name: rep?.rep_name,
            })
          }),
          research_investigators: research?.ResearchInvestigators?.map(item => ({
            id_number: item.id_number,
            name: `${item?.first_name} ${item?.middle_name || ''}${item?.middle_name ? ' ' : ''}${item?.last_name}`,
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
        res.status(OK).json({ Research: response });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  getAllStatic: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const department = await User.findOne({
          attributes: ['dept_id'],
          where: {id: req.user.id},
        })

        const documentTypess = await DocumentTypes.findAll({
          attributes: ['id', 'document_name'],
        });
        const budgetBreakdownDetailss = await BudgetBreakdownDetails.findAll({
          attributes: ['id', 'fund_name', 'fund_desc'],
        });
        // const endorsementRepresentatives = await EndorsementRepresentative.findAll({
        //   attributes: ['id', 'rep_name'],
        // });
        const researchCategorys = await ResearchCategory.findAll({
          attributes: ['id', 'research_name'],
        });
        const researchPurposes = await ResearchPurpose.findAll({
          attributes: ['id', 'purpose_name'],
        });
        const statusTabless = await StatusTables.findAll({
          attributes: ['id', 'status'],
        });


        const approvingBodies = await User.findAll({
          attributes: ['id', 'first_name', 'last_name'],
          where: {dept_id: department.dept_id},
          include: [
            {
              model: UserAccount, attributes: ['role_id'], where: {role_id: [3,4,5]},
              include: [{model: UserRole, attributes: ['role_desc']},]
            }, 
          ]
        })

        // const userAccounts = await UserAccount.findAll({
        //   attributes: ['id', 'username', 'role_id', 'email', 'profile_image', 'created_by', 'created_at'],
        //   include: [
        //     {
        //       model: User,
        //       attributes: ['last_name','first_name','middle_name','contact_number'],
        //     },
        //     {
        //       model: UserRole,
        //       attributes: ['role_name', 'role_desc']
        //     },
        //   ]
        // });
        const response = {
          DocumentTypes: documentTypess,
          BudgetBreakdownDetails: budgetBreakdownDetailss,
          // EndorsementRepresentative: endorsementRepresentatives,
          ResearchCategory: researchCategorys,
          ResearchPurpose: researchPurposes,
          StatusTables: statusTabless,
          EndorsementRepresentative: approvingBodies,
        }

        res.status(OK).json({ Details: response });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  getByDepartment: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const dept_id=req.params.dept_id;
        const researches = await Research.findAll({
          attributes: ['id', 'title', 'category', 'purpose_id', 'version_number', 'research_duration', 'ethical_considerations', 'submitted_by', 'submitted_date', 'status_id'],
          include: {
            model: User,
            attributes: ['user_account_id','last_name','first_name','middle_name','dept_id'],
            include: [
              {model: Departments, attributes:['dept_name']}
            ],
            where: {dept_id: dept_id}
          }
        });
        res.status(OK).json(researches);
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
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
            Message: `No matching Research with id ${req.params.id}`,
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
          status_id: req.body.status_id || researchs.status_id,
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
  updateStatus: async (req, res) => {
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
            Message: `No matching Research with id ${req.params.id}`,
          });
          return;
        }

        await researchs.update({
          status_id: req.params.status_id,
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
