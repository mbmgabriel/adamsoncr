const express = require('express')
const router = express.Router()

const { ResearchPurposeController } = require('../../controllers/research_purposes/research_purposes_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/research_purposes/create:
 *   post:
 *     tags:
 *       - ResearchPurpose
 *     description: CREATE ResearchPurpose API
 *     summary: Create New ResearchPurpose
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchPurposesResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResearchPurpose'
 */
router.post('/create', verify_user_account, ResearchPurposeController.create)
/**
 *  @openapi
 *  /api/v1/research_purposes/all:
 *    get:
 *      tags: 
 *        - ResearchPurpose
 *      description: GET All ResearchPurpose API.
 *      summary: Get All ResearchPurpose
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResearchPurposesResponse'
*/
router.get('/all', verify_user_account, ResearchPurposeController.all)
/**
 *  @openapi
 *  /api/v1/research_purposes/{id}:
 *    get:
 *      tags: 
 *        - ResearchPurpose
 *      description: GET Specific ResearchPurpose by Id API.
 *      summary: Get Specific ResearchPurpose
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
 *                $ref: '#/components/schemas/ResearchPurposeResponse'
 *      
*/
router.get('/:id', verify_user_account, ResearchPurposeController.get)
/**
 * @openapi
 * /api/v1/research_purposes/{id}:
 *   put:
 *     tags:
 *       - ResearchPurpose
 *     description: UPDATE ResearchPurpose by Id API
 *     summary: Update Specific ResearchPurpose
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchPurposeResponse'
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
 *             $ref: '#/components/schemas/ResearchPurpose'
 * 
 */
router.put('/:id', verify_user_account, ResearchPurposeController.update)
/**
 * @openapi
 * /api/v1/research_purposes/{id}:
 *   delete:
 *     tags:
 *       - ResearchPurpose
 *     description: DELETE ResearchPurpose by Id API
 *     summary: Delete Specific ResearchPurpose
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
router.delete('/:id', verify_user_account, ResearchPurposeController.delete)

module.exports.ResearchPurposeRoutes = router