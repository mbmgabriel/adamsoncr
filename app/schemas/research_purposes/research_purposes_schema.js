/**
 * @openapi
 * components:
 *   schemas:
 *     ResearchPurpose:
 *       type: object
 *       properties:
 *         purpose_name:
 *           type: string
 *           example: 'Administrator'
 *     ResearchPurposeResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ResearchPurpose'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ResearchPurposesResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ResearchPurposeResponse'
 */