var express = require("express");
const { UserAccountRoutes } = require("./user_account/user_account_routes");
const { UserRoleRoutes } = require("./user_role/user_role_routes");
const { ResearchRoutes } = require("./research/research_routes");
const { ResearchPurposeRoutes } = require("./research_purposes/research_purposes_routes");
const { ResearchCategoryRoutes } = require("./research_categories/research_categories_routes");
const { EndorsementRepresentativeRoutes } = require("./endorsement_representatives/endorsement_representatives_routes");
const { DocumentTypesRoutes } = require("./document_types/document_types_routes");

var router = express.Router();

router.use("/user", UserAccountRoutes);
router.use("/roles", UserRoleRoutes);
router.use("/research", ResearchRoutes);
router.use("/research_purposes", ResearchPurposeRoutes);
router.use("/research_categories", ResearchCategoryRoutes);
router.use("/endorsement_representatives", EndorsementRepresentativeRoutes);
router.use("/document_types", DocumentTypesRoutes);

module.exports = router;