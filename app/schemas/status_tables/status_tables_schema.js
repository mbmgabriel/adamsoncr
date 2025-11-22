/**
 * @openapi
 * components:
 *   schemas:
 *     StatusTables:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *     StatusTablesResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/StatusTables'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     StatusTablessResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/StatusTablesResponse'
 */