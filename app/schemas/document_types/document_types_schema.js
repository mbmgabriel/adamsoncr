/**
 * @openapi
 * components:
 *   schemas:
 *     DocumentTypes:
 *       type: object
 *       properties:
 *         document_name:
 *           type: string
 *     DocumentTypesResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/DocumentTypes'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     DocumentTypessResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/DocumentTypesResponse'
 */