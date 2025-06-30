/**
 * @openapi
 * components:
 *   schemas:
 *     EndorsementRepresentative:
 *       type: object
 *       properties:
 *         rep_name:
 *           type: string
 *     EndorsementRepresentativeResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/EndorsementRepresentative'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     EndorsementRepresentativesResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/EndorsementRepresentativeResponse'
 */