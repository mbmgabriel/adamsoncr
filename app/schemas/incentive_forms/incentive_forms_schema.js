/**
 * @openapi
 * components:
 *   schemas:
 *     IncentiveForms:
 *       type: object
 *       properties:
 *         name_of_authors:
 *           type: string
 *         email_address:
 *           type: string
 *         contact_number:
 *           type: string
 *         incentive_type_id:
 *           type: string
 *         submission_date:
 *           type: string
 *         publisher_info:
 *           type: string
 *         title_of_work:
 *           type: string
 *         publication_date:
 *           type: string
 *         citation_date:
 *           type: string
 *         citation_no:
 *           type: string
 *         isbn:
 *           type: string
 *         peer_review_proof_id:
 *           type: string
 *     IncentiveFormsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/IncentiveForms'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     IncentiveFormssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/IncentiveFormsResponse'
 */