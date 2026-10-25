/**
 * @openapi
 * components:
 *   schemas:
 *     Research:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         purpose_id:
 *           type: integer
 *           default: 1
 *         version_number:
 *           type: string
 *         research_duration:
 *           type: string
 *         ethical_considerations:
 *           type: integer
 *           default: 1
 *         submitted_by:
 *           type: string
 *         submitted_date:
 *           type: string
 *           readOnly: true
 *           description: Server-recorded submission timestamp, preserved during updates.
 *           format: date-time
 *         status_id:
 *           type: integer
 *           default: 1
 *     ResearchResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Research'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ResearchsResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ResearchResponse'
 *     ResearchInvestigatorsForResearch:
 *       type: object
 *       properties:
 *         id_number:
 *           type: string
 *         first_name:
 *           type: string
 *         middle_name:
 *           type: string
 *         last_name:
 *           type: string
 *         mobile_number:
 *           type: string
 *         email:
 *           type: string
 *         college:
 *           type: string
 *         dept:
 *           type: string
 *     EndorsementsForResearch:
 *       type: object
 *       properties:
 *         endorsement_rep_id:
 *           type: integer
 *         status:
 *           type: string
 *         remarks:
 *           type: string
 *     BudgetBreakdownsForResearch:
 *       type: object
 *       properties:
 *         fund_id:
 *           type: integer
 *           default: 1
 *         amount:
 *           type: number
 *           format: double
 *           default: 1
 *     ResearchComplete:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         purpose_id:
 *           type: integer
 *           default: 1
 *         version_number:
 *           type: string
 *         research_duration:
 *           type: string
 *         ethical_considerations:
 *           type: integer
 *           default: 1
 *         submitted_by:
 *           type: string
 *         submitted_date:
 *           type: string
 *           readOnly: true
 *           description: Server-recorded submission timestamp, preserved during updates.
 *           format: date-time
 *         status_id:
 *           type: integer
 *           default: 1
 *         research_investigators:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResearchInvestigatorsForResearch'  
 *         budget_breakdowns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BudgetBreakdownsForResearch'    
 */
