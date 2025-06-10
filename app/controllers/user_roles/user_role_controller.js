const { Op } = require("sequelize");

const { UserRole, sequelize } = require("../../models");
const { userRoleValidator } = require("../user_roles/user_role_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const UserRoleController = {
  create: async (req, res) => {
    const matched = userRoleValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'Role Name required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const userRoles = await UserRole.create({
          role_name: req.body.role_name,
          role_desc: req.body.role_desc,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({UserRole: userRoles, Message: 'User Role created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const userRoles = await UserRole.findAll({
          attributes: ['role_name', 'role_desc'],
        });
        res.status(OK).json({UserRole: userRoles});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const userRoles = await UserRole.findAll({
          attributes: ['role_name', 'role_desc'],
          where: {id: req.params.id},
        });

        res.status(OK).json({UserRole: userRoles});
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

        const userRoles = await UserRole.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!userRoles) {
          res.status(NOT_FOUND).json({
            Message: `No matching User Role with id ${req.params.id}`,
          });
          return;
        }

        await userRoles.update({
          role_name: req.body.role_name || userRoles.role_name,
          role_desc: req.body.role_desc || userRoles.role_desc,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          UserRole: userRoles,
          Message: "User Role updated.",
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
        const userRoles = await UserRole.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!userRoles) {
          res.status(NOT_FOUND).json({
            Message: `No matching User Role with id : ${req.params.id}`,
          });

          return;
        }
        await userRoles.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `User Role Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.UserRoleController = UserRoleController;
