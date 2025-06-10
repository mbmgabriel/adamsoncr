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
 *         version_number:
 *           type: string
 *         research_duration:
 *           type: string
 *         ethical_considerations:
 *           type: string
 *         submitted_by:
 *           type: string
 *         submitted_date:
 *           type: string
 *     ResearchResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Research'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ResearchsResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ResearchResponse'
 */
