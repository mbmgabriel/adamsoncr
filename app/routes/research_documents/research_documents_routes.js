const express = require('express')
const router = express.Router()

const { ResearchDocumentsController } = require('../../controllers/research_documents/research_documents_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')
const { upload_service } = require('../../services/upload_service/upload_service')

/**
 * @openapi
 * /api/v1/research_documents/create/{research_id}/{document_title_id}:
 *   post:
 *     tags:
 *       - ResearchDocuments
 *     description: CREATE ResearchDocuments API
 *     summary: Create New ResearchDocuments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchDocumentsResponse'
 *     parameters:
 *       - in: path
 *         name: research_id
 *         description: research_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: document_title_id
 *         description: document_title_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/documentUploadResponse'
 */
router.post('/create/:research_id/:document_title_id', verify_user_account, upload_service.single('document_filepath'), ResearchDocumentsController.create)
/**
 *  @openapi
 *  /api/v1/research_documents/all:
 *    get:
 *      tags: 
 *        - ResearchDocuments
 *      description: GET All ResearchDocuments API.
 *      summary: Get All ResearchDocuments
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResearchDocumentssResponse'
*/
router.get('/all', verify_user_account, ResearchDocumentsController.all)
/**
 *  @openapi
 *  /api/v1/research_documents/{id}:
 *    get:
 *      tags: 
 *        - ResearchDocuments
 *      description: GET Specific ResearchDocuments by Id API.
 *      summary: Get Specific ResearchDocuments
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *           type: integer
 *          required: true
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResearchDocumentsResponse'
 *      
*/
router.get('/:id', verify_user_account, ResearchDocumentsController.get)
/**
 * @openapi
 * /api/v1/research_documents/{id}:
 *   put:
 *     tags:
 *       - ResearchDocuments
 *     description: UPDATE ResearchDocuments by Id API
 *     summary: Update Specific ResearchDocuments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchDocumentsResponse'
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResearchDocuments'
 * 
 */
router.put('/:id', verify_user_account, ResearchDocumentsController.update)
/**
 * @openapi
 * /api/v1/research_documents/{id}:
 *   delete:
 *     tags:
 *       - ResearchDocuments
 *     description: DELETE ResearchDocuments by Id API
 *     summary: Delete Specific ResearchDocuments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 * 
 */
router.delete('/:id', verify_user_account, ResearchDocumentsController.delete)

module.exports.ResearchDocumentsRoutes = router