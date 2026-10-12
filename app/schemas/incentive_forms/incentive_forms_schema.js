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
 *           type: integer
 *           default: 1
 *         submission_date:
 *           type: string
 *           format: date
 *         publisher_info:
 *           type: string
 *         title_of_work:
 *           type: string
 *         publication_date:
 *           type: string
 *           format: date
 *         citation_date:
 *           type: string
 *           format: date
 *         citation_no:
 *           type: integer
 *           default: 1
 *         isbn:
 *           type: string
 *         peer_review_proof_id:
 *           type: integer
 *           default: 1
 *         CAttachmentInfos:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/AttachmentInfos'
 *     IncentiveFormsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/IncentiveForms'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     IncentiveFormssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/IncentiveFormsResponse'
 *     AttachmentInfos:
 *       type: object
 *       properties:
 *        info_id:
 *          type: integer
 *          default: 1
 *        is_active:
 *          type: integer
 *          default: 1
 */