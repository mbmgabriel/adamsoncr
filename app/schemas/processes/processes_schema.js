/**
 * @openapi
 * components:
 *   schemas:
 *     Processes:
 *       type: object
 *       properties:
 *         from_id:
 *           type: integer
 *         action:
 *           type: integer
 *         to_id:
 *           type: integer
 *     ProcessesResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Processes'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ProcessessResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ProcessesResponse'
 */