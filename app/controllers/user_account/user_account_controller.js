const { Op } = require("sequelize");


const { UserAccount, User, UserRole, Departments, sequelize } = require("../../models/");
const bcrypt = require('bcrypt')

const fs = require('fs');
const {
  createUserAccountFormValidator,
  updatePasswordFormValidator,
} = require("./user_account_validator");
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const UserAccountController = {
  // initialize: async (req, res) => {
  //   const newUser = await sequelize.transaction(async (t) => {
  //     try {
  //       const superAdmin = await UserAccount.create(
  //         {
  //           username: req.body.username,
  //           password: req.body.password,
  //           role_id: 1,
  //         },
  //         { transaction: t }
  //       );

  //       return superAdmin;
  //     } catch (error) {
  //       res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
  //     }
  //   });
  //  },
  login: async (req, res) => {
    try {
      const user = await UserAccount.findOne({
        where: {username: req.body.username},
        include: [
          {
            model: UserRole,
            attributes: ['role_name', 'role_desc']
          },
        ],
      });
      if (!user) {
        res.status(NOT_FOUND).json({ message: "Username does not exist" });
        return;
      }

      const match = await bcrypt.compare(req.body.password, user.password)

      if (!match) {
        res.status(NOT_FOUND).json({
          message: "Username or password does not match",
        });
        return;
      }
      const token = await user.generateToken(user.id);

      const user_info = await User.findOne(
        {
          where: {user_account_id: user.id},
        }
      );

      const loginUser = {
        user_account_id: user.id,
        username: user.username,
        // role_id: user.role_id,
        profile_image: user.profile_image,
        email: user.email,
        // token: user.token,
        // verified_at: user.verified_at,
        user_id: user_info.id,
        last_name: user_info.last_name,
        first_name: user_info.first_name,
        middle_name: user_info.middle_name,
        position: user_info.position,
        dept: user_info.dept,
        college: user_info.college,
        contact_number: user_info.contact_number,
        role_name: user.UserRole.role_name,
        // created_by: user.created_by,
        // created_at: user.created_at,
        // updated_by: user.updated_by,
        // updated_at: user.updated_at,
        // deleted_by: user.deleted_by,
        // deleted_at: user.deleted_at
      }
      res.status(OK).json({ UserAccount: loginUser, token: token });
      return;
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      return;
    }
  },
  create: async (req, res) => {
    const matched = createUserAccountFormValidator(req.body, res).validate();

    if (!matched) {
      // return;
      res.status(NOT_ACCEPTABLE).json({
          message: "Please provide required fields.",
        });
    }

    await sequelize.transaction(async (t) => {
      try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userAccountDetails = {
          username: req.body.username,
          password: hashedPassword,
          role_id: 1,
          email: req.body.email,
          created_by: req.user.id,
        }



        const user = await User.create(
          {
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            position: req.body.position,
            dept: req.body.dept,
            college: req.body.college,
            contact_number: req.body.contact_number,
            created_by: req.user.id,
            UserAccount: userAccountDetails,
          },
          {include: [UserAccount]},
          {transaction: t}
        )

        res.status(OK).json({
          User: user,
          Message: "User Credentials Successfully Created!",
        });

      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const userAccounts = await UserAccount.findAll({
          attributes: ['id', 'username', 'role_id', 'email', 'profile_image', 'created_by', 'created_at'],
          include: [
            {
              model: User,
              attributes: ['last_name','first_name','middle_name','contact_number'],
              include: [
                {
                  model: Departments,
                  attributes: ['id','dept_name']
                }
              ]
            },
            {
              model: UserRole,
              attributes: ['id','role_name', 'role_desc']
            },
            {
              model: Depart
            }
          ]
        });
        res.json(userAccounts);
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const userAccounts = await UserAccount.findOne({
          attributes: ['id', 'username', 'role_id', 'email', 'profile_image', 'created_by', 'created_at'],
          where: {id: req.params.id},
          include: [
            {
              model: User,
              attributes: ['last_name','first_name','middle_name', 'contact_number'],
              include: [
                {
                  model: Departments,
                  attributes: ['id','dept_name']
                }
              ]
            },
            {
              model: UserRole,
              attributes: ['id','role_name', 'role_desc']
            },
          ],
        });

        if (!userAccounts) {
          res.status(NOT_FOUND).json({
            message: `No matching record with ${req.params.id}`,
          });
          return;
        }

        res.status(OK).json(userAccounts);
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  getWithFilter: async (req, res) => {

    const {dept_id, role_id} = req.query;
    

    await sequelize.transaction(async (t) => {
      try {
        const userAccounts = await UserAccount.findAll({
          attributes: ['id', 'username', 'role_id', 'email', 'profile_image', 'created_by', 'created_at'],
          where: role_id ? {role_id: role_id} : undefined,
          include: [
            {
              model: User,
              attributes: ['last_name','first_name','middle_name', 'contact_number','dept_id'],
              include: [{model: Departments, attributes: ['dept_name']}],
              where: dept_id ? {dept_id: dept_id} : undefined,
            },
            {
              model: UserRole,
              attributes: ['role_name', 'role_desc']
            },
          ],
        });

        if (!userAccounts) {
          res.status(NOT_FOUND).json({
            message: `No matching record with ${req.params.id}`,
          });
          return;
        }

        res.status(OK).json(userAccounts);
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
        const userAccount = await UserAccount.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!userAccount) {
          res.status(NOT_FOUND).json({
            message: `No matching user with user id ${req.params.id}`,
          });
          return;
        }

        const user = await User.findOne(
          {
            where: {
              user_account_id: req.params.id,
            },
          },
        );

        await user.update({
          last_name: req.body.last_name,
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          // position: req.body.position,
          // dept: req.body.dept,
          // college: req.body.college,
          contact_number: req.body.contact_number,
          updated_by: req.user.id,
        });

      
        res.status(OK).json({ User: user, Message: 'User Details Successfully Updated!' });

      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  delete: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const userAccount = await UserAccount.findOne(
          {
            where: { id: req.params.id },
          },
        );

        if (!userAccount) {
          res.status(NOT_FOUND).json({
            message: `No matching user with user id ${req.params.id}`,
          });

          return;
        }

        const user = await User.findOne(
          {
            where: { user_account_id: req.params.id },
          },
        );

        
        await userAccount.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        await user.destroy({
          force: false,
          deleted_by: user.id,
        });

        
        res.status(OK).json({
          Message: `User Account Deleted Successfully!`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  updatePassword: async (req, res) => {
    const matched = updatePasswordFormValidator(req.body, res).validate();

    if (!matched) return;

    const user = await UserAccount.findOne({
      where: {
        id: req.params.user_account_id,
      }
    });

    if (!user) {res.status(PRECONDITION_FAILED).json({ message: "User does not exist" });}
    
    const matchCurrent = await bcrypt.compare(req.body.current_password, user.password)
    const matchConfirm = await bcrypt.compare(req.body.confirm_password, user.password)

    if (
      !matchCurrent ||
      req.body.new_password !== req.body.confirm_password
    ) {
      res.status(PRECONDITION_FAILED).json({ message: "Password does not match" });
      return;
    }

    if (matchConfirm) {
      res.status(PRECONDITION_FAILED).json({
        message: "New password must not match existing password",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.confirm_password, 10);
    user.update({
      password: hashedPassword,
    });

    res.status(OK).json({
      message: "Password has been updated successfully",
    });
    return;
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
      const profilePic = await UserAccount.findOne({
        where: {
          id: req.params.id,
        },
        // attributes: ['id', 'role_id', 'profile_image', 'created_by', 'created_at', 'updated_by', 'updated_at', 'deleted_by', 'deleted_at']
      });

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

};

module.exports.UserAccountController = UserAccountController;
