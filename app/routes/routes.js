var express = require("express");
const { UserAccountRoutes } = require("./user_account/user_account_routes");
const { UserRoleRoutes } = require("./user_role/user_role_routes");
const { ResearchRoutes } = require("./research/research_routes");

var router = express.Router();

router.use("/user", UserAccountRoutes);
router.use("/roles", UserRoleRoutes);
router.use("/research", ResearchRoutes);

module.exports = router;