/**
 * @openapi
 * components:
 *   schemas:
 *     RequestAssistanceForms:
 *       type: object
 *       properties:
 *         name_of_presenter:
 *           type: string
 *         email_address:
 *           type: string
 *         contact_number:
 *           type: string
 *         conference_title:
 *           type: string
 *         research_paper_title:
 *           type: string
 *         conference_link:
 *           type: string
 *         acceptance_date:
 *           type: string
 *           format: date
 *         conference_date:
 *           type: string
 *           format: date
 *         CAssistanceFormProofs:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/RequestAssistanceFormsProofs'
 *     RequestAssistanceFormsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/RequestAssistanceForms'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     RequestAssistanceFormssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/RequestAssistanceFormsResponse'
 *     RequestAssistanceFormsProofs:
 *       type: object
 *       properties:
 *         proof_id:
 *           type: integer
 *           default: 1
 *         is_active:
 *           type: integer
 *           default: 1
 */