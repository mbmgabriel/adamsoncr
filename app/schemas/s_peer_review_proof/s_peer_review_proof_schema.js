/**
 * @openapi
 * components:
 *   schemas:
 *     SPeerReviewProof:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *     SPeerReviewProofResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SPeerReviewProof'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     SPeerReviewProofsResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/SPeerReviewProofResponse'
 */