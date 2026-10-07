/**
 * @openapi
 * components:
 *   schemas:
 *     SAttachmentInfos:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *     SAttachmentInfosResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SAttachmentInfos'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     SAttachmentInfossResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/SAttachmentInfosResponse'
 */