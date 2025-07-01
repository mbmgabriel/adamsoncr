/**
 * @openapi
 * components:
 *   schemas:
 *     ResearchDocuments:
 *       type: object
 *       properties:
 *         document_title_id:
 *           type: integer
 *         document_filepath:
 *           type: string
 *     ResearchDocumentsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ResearchDocuments'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ResearchDocumentssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ResearchDocumentsResponse'
 */