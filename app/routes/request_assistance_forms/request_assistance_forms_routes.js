const express = require('express')
const router = express.Router()

const { RequestAssistanceFormsController } = require('../../controllers/request_assistance_forms/request_assistance_forms_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/request-assistance-forms/create:
 *   post:
 *     tags:
 *       - RequestAssistanceForms
 *     description: CREATE RequestAssistanceForms API
 *     summary: Create New RequestAssistanceForms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestAssistanceFormssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestAssistanceForms'
 */
router.post('/create', verify_user_account, RequestAssistanceFormsController.create)
/**
 *  @openapi
 *  /api/v1/request-assistance-forms/all:
 *    get:
 *      tags: 
 *        - RequestAssistanceForms
 *      description: GET All RequestAssistanceForms API.
 *      summary: Get All RequestAssistanceForms
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RequestAssistanceFormssResponse'
*/
router.get('/all', verify_user_account, RequestAssistanceFormsController.all)

/**
 * @openapi
 * /api/v1/request-assistance-forms/user:
 *   get:
 *     tags:
 *       - RequestAssistanceForms
 *     description: GET RequestAssistanceForms by Logged-in User Account ID API
 *     summary: Get RequestAssistanceForms by Logged-in User ID 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestAssistanceFormssResponse'
 */
router.get('/user', verify_user_account, RequestAssistanceFormsController.getByUserId)

/**
 *  @openapi
 *  /api/v1/request-assistance-forms/{id}:
 *    get:
 *      tags: 
 *        - RequestAssistanceForms
 *      description: GET Specific RequestAssistanceForms by Id API.
 *      summary: Get Specific RequestAssistanceForms
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
 *                $ref: '#/components/schemas/RequestAssistanceFormsResponse'
 *      
*/
router.get('/:id', verify_user_account, RequestAssistanceFormsController.get)



/**
 * @openapi
 * /api/v1/request-assistance-forms/{id}:
 *   put:
 *     tags:
 *       - RequestAssistanceForms
 *     description: UPDATE RequestAssistanceForms by Id API
 *     summary: Update Specific RequestAssistanceForms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestAssistanceFormsResponse'
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
 *             $ref: '#/components/schemas/RequestAssistanceForms'
 * 
 */
router.put('/:id', verify_user_account, RequestAssistanceFormsController.update)
/**
 * @openapi
 * /api/v1/request-assistance-forms/{id}:
 *   delete:
 *     tags:
 *       - RequestAssistanceForms
 *     description: DELETE RequestAssistanceForms by Id API
 *     summary: Delete Specific RequestAssistanceForms
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
router.delete('/:id', verify_user_account, RequestAssistanceFormsController.delete)

module.exports.RequestAssistanceFormsRoutes = router