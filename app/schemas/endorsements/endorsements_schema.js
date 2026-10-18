/**
 * @openapi
 * components:
 *   schemas:
 *     Endorsements:
 *       type: object
 *       properties:
 *         research_id:
 *           type: integer
 *           default: 1
 *         endorsement_rep_id:
 *           type: integer
 *           default: 3
 *         status_id:
 *           type: integer
 *           default: 2
 *         remarks:
 *           type: string
 *         form_type_id:
 *           type: integer
 *           default: 1
 *     EndorsementsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Endorsements'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     EndorsementssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/EndorsementsResponse'
 */