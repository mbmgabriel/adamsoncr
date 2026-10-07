var express = require("express");
const { UserAccountRoutes } = require("./user_account/user_account_routes");
const { UserRoleRoutes } = require("./user_role/user_role_routes");
const { ResearchRoutes } = require("./research/research_routes");
const { ResearchPurposeRoutes } = require("./research_purposes/research_purposes_routes");
const { ResearchCategoryRoutes } = require("./research_categories/research_categories_routes");
const { EndorsementRepresentativeRoutes } = require("./endorsement_representatives/endorsement_representatives_routes");
const { DocumentTypesRoutes } = require("./document_types/document_types_routes");
const { ResearchInvestigatorsRoutes } = require("./research_investigators/research_investigators_routes");
const { EndorsementsRoutes } = require("./endorsements/endorsements_routes");
const { ResearchDocumentsRoutes } = require("./research_documents/research_documents_routes");
const { BudgetBreakdownsRoutes } = require("./budget_breakdowns/budget_breakdowns_routes");
const { DepartmentsRoutes } = require("./departments/departments_routes")
const { BudgetBreakdownDetailsRoutes } = require("./budget_breakdown_details/budget_breakdown_details_routes")
const { StatusTablesRoutes } = require("./status_tables/status_tables_routes")
const { ProcessesRoutes } = require("./processes/processes_routes")
const { RequestAssistanceFormsRoutes } = require("./request_assistance_forms/request_assistance_forms_routes")
const { CAssistanceFormProofsRoutes } = require("./c_assistance_form_proofs/c_assistance_form_proofs_routes")
const { SAssistanceFormProofsRoutes } = require("./s_assistance_form_proofs/s_assistance_form_proofs_routes")
const { IncentiveFormsRoutes } = require("./incentive_forms/incentive_forms_routes")
const { CAttachmentInfosRoutes } = require("./c_attachment_infos/c_attachment_infos_routes")
const { SAttachmentInfosRoutes } = require("./s_attachment_infos/s_attachment_infos_routes")
const { SIncentiveTypesRoutes } = require("./s_incentive_types/s_incentive_types_routes")
const { SPeerReviewProofRoutes } = require("./s_peer_review_proof/s_peer_review_proof_routes")

var router = express.Router();

router.use("/user", UserAccountRoutes);
router.use("/roles", UserRoleRoutes);
router.use("/research", ResearchRoutes);
router.use("/research_purposes", ResearchPurposeRoutes);
router.use("/research_categories", ResearchCategoryRoutes);
router.use("/endorsement_representatives", EndorsementRepresentativeRoutes);
router.use("/document_types", DocumentTypesRoutes);
router.use("/research_investigators", ResearchInvestigatorsRoutes);
router.use("/endorsements", EndorsementsRoutes);
router.use("/research_documents", ResearchDocumentsRoutes);
router.use("/budget_breakdowns", BudgetBreakdownsRoutes)
router.use("/departments", DepartmentsRoutes)
router.use("/budget_breakdown_details", BudgetBreakdownDetailsRoutes)
router.use("/status_tables", StatusTablesRoutes)
router.use("/processes", ProcessesRoutes)
router.use("/request-assistance-forms", RequestAssistanceFormsRoutes)
router.use("/c-assistance-form-proofs", CAssistanceFormProofsRoutes)
router.use("/s-assistance-form-proofs", SAssistanceFormProofsRoutes)
router.use("/incentive-forms", IncentiveFormsRoutes)
router.use("/c-attachment-infos", CAttachmentInfosRoutes)
router.use("/s-attachment-infos", SAttachmentInfosRoutes)
router.use("/s-incentive-types", SIncentiveTypesRoutes)
router.use("/s-peer-review-proof", SPeerReviewProofRoutes)

module.exports = router;