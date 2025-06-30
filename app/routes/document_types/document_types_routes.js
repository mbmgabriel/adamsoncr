const express = require('express')
const router = express.Router()

const { DocumentTypesController } = require('../../controllers/document_types/document_types_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/document_types/create:
 *   post:
 *     tags:
 *       - DocumentTypes
 *     description: CREATE DocumentTypes API
 *     summary: Create New DocumentTypes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentTypessResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentTypes'
 */
router.post('/create', verify_user_account, DocumentTypesController.create)
/**
 *  @openapi
 *  /api/v1/document_types/all:
 *    get:
 *      tags: 
 *        - DocumentTypes
 *      description: GET All DocumentTypes API.
 *      summary: Get All DocumentTypes
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DocumentTypessResponse'
*/
router.get('/all', verify_user_account, DocumentTypesController.all)
/**
 *  @openapi
 *  /api/v1/document_types/{id}:
 *    get:
 *      tags: 
 *        - DocumentTypes
 *      description: GET Specific DocumentTypes by Id API.
 *      summary: Get Specific DocumentTypes
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
 *                $ref: '#/components/schemas/DocumentTypesResponse'
 *      
*/
router.get('/:id', verify_user_account, DocumentTypesController.get)
/**
 * @openapi
 * /api/v1/document_types/{id}:
 *   put:
 *     tags:
 *       - DocumentTypes
 *     description: UPDATE DocumentTypes by Id API
 *     summary: Update Specific DocumentTypes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentTypesResponse'
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
 *             $ref: '#/components/schemas/DocumentTypes'
 * 
 */
router.put('/:id', verify_user_account, DocumentTypesController.update)
/**
 * @openapi
 * /api/v1/document_types/{id}:
 *   delete:
 *     tags:
 *       - DocumentTypes
 *     description: DELETE DocumentTypes by Id API
 *     summary: Delete Specific DocumentTypes
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
router.delete('/:id', verify_user_account, DocumentTypesController.delete)

module.exports.DocumentTypesRoutes = router