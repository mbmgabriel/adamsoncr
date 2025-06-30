/**
 * @openapi
 * components:
 *   schemas:
 *     ResearchCategory:
 *       type: object
 *       properties:
 *         research_name:
 *           type: string
 *     ResearchCategoryResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ResearchCategory'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ResearchCategorysResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ResearchCategoryResponse'
 */