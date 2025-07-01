/**
 * @openapi
 * components:
 *   schemas:
 *     ResearchInvestigators:
 *       type: object
 *       properties:
 *         research_id:
 *           type: integer
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
 *     ResearchInvestigatorsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ResearchInvestigators'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ResearchInvestigatorssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ResearchInvestigatorsResponse'
 */