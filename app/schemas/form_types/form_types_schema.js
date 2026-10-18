/**
 * @openapi
 * components:
 *   schemas:
 *     FormTypes:
 *       type: object
 *       properties:
 *         form_type:
 *           type: string
 *         description:
 *           type: string
 *     FormTypesResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/FormTypes'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     FormTypessResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/FormTypesResponse'
 */