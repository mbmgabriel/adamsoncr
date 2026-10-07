/**
 * @openapi
 * components:
 *   schemas:
 *     SIncentiveTypes:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *     SIncentiveTypesResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SIncentiveTypes'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     SIncentiveTypessResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/SIncentiveTypesResponse'
 */