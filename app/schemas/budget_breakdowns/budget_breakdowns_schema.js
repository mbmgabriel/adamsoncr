/**
 * @openapi
 * components:
 *   schemas:
 *     BudgetBreakdowns:
 *       type: object
 *       properties:
 *         research_id:
 *           type: integer
 *         fund_id:
 *           type: integer
 *         amount:
 *           type: number
 *           format: double
 *     BudgetBreakdownsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BudgetBreakdowns'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     BudgetBreakdownssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/BudgetBreakdownsResponse'
 */