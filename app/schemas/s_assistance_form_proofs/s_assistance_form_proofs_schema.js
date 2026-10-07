/**
 * @openapi
 * components:
 *   schemas:
 *     SAssistanceFormProofs:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *     SAssistanceFormProofsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SAssistanceFormProofs'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     SAssistanceFormProofssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/SAssistanceFormProofsResponse'
 */