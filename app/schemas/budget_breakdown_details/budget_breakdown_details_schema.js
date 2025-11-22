/**
 * @openapi
 * components:
 *   schemas:
 *     BudgetBreakdownDetails:
 *       type: object
 *       properties:
 *         fund_name:
 *           type: integer
 *         fund_desc:
 *           type: integer
 *     BudgetBreakdownDetailsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BudgetBreakdownDetails'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     BudgetBreakdownDetailssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/BudgetBreakdownDetailsResponse'
 */