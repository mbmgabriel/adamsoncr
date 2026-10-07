/**
 * @openapi
 * components:
 *   schemas:
 *     CAttachmentInfos:
 *       type: object
 *       properties:
 *         incentive_form_id:
 *           type: integer
 *         info_id:
 *           type: integer
 *         is_active:
 *           type: integer
 *         attachment_file:
 *           type: string
 *     CAttachmentInfosResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/CAttachmentInfos'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     CAttachmentInfossResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CAttachmentInfosResponse'
 */