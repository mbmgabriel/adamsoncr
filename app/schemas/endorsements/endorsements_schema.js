/**
 * @openapi
 * components:
 *   schemas:
 *     Endorsements:
 *       type: object
 *       properties:
 *         research_id:
 *           type: integer
 *         endorsement_rep_id:
 *           type: integer
 *         status:
 *           type: string
 *     EndorsementsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Endorsements'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     EndorsementssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/EndorsementsResponse'
 */