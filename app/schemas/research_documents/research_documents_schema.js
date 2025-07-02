/**
 * @openapi
 * components:
 *   schemas:
 *     ResearchDocuments:
 *       type: object
 *       properties:
 *         research_id:
 *           type: integer
 *         document_title_id:
 *           type: integer
 *     ResearchDocumentsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ResearchDocuments'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     ResearchDocumentssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ResearchDocumentsResponse'
 *     documentUploadResponse:
 *       type: object
 *       required:
 *         - document_filepath 
 *       properties:
 *         document_filepath:
 *           type: string
 *           format: binary
 *           default: 'sample'
 */