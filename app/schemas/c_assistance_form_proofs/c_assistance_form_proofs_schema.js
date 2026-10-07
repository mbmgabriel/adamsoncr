/**
 * @openapi
 * components:
 *   schemas:
 *     CAssistanceFormProofs:
 *       type: object
 *       properties:
 *         request_assistance_form_id:
 *           type: integer
 *         proof_id:
 *           type: integer
 *         is_active:
 *           type: integer
 *     CAssistanceFormProofsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/CAssistanceFormProofs'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     CAssistanceFormProofssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CAssistanceFormProofsResponse'
 */