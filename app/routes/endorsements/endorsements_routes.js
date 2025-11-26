const express = require('express')
const router = express.Router()

const { EndorsementsController } = require('../../controllers/endorsements/endorsements_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/endorsements/create:
 *   post:
 *     tags:
 *       - Endorsements
 *     description: CREATE Endorsements API
 *     summary: Create New Endorsements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndorsementssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Endorsements'
 */
router.post('/create', verify_user_account, EndorsementsController.create)
/**
 *  @openapi
 *  /api/v1/endorsements/all:
 *    get:
 *      tags: 
 *        - Endorsements
 *      description: GET All Endorsements API.
 *      summary: Get All Endorsements
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/EndorsementssResponse'
*/
router.get('/all', verify_user_account, EndorsementsController.all)
/**
 *  @openapi
 *  /api/v1/endorsements/research/{research_id}:
 *    get:
 *      tags: 
 *        - Endorsements
 *      description: GET Specific Endorsements by Research Id API.
 *      summary: Get Specific Endorsements by Research ID
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: research_id
 *          schema:
 *           type: integer
 *          required: true
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/EndorsementsResponse'
 *      
*/
router.get('/research/:research_id', verify_user_account, EndorsementsController.getByResearchId)
/**
 *  @openapi
 *  /api/v1/endorsements/{id}:
 *    get:
 *      tags: 
 *        - Endorsements
 *      description: GET Specific Endorsements by Id API.
 *      summary: Get Specific Endorsements
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
 *                $ref: '#/components/schemas/EndorsementsResponse'
 *      
*/
router.get('/:id', verify_user_account, EndorsementsController.get)
/**
 * @openapi
 * /api/v1/endorsements/{id}:
 *   put:
 *     tags:
 *       - Endorsements
 *     description: UPDATE Endorsements by Id API
 *     summary: Update Specific Endorsements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndorsementsResponse'
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
 *             $ref: '#/components/schemas/Endorsements'
 * 
 */
router.put('/:id', verify_user_account, EndorsementsController.update)
/**
 * @openapi
 * /api/v1/endorsements/{id}:
 *   delete:
 *     tags:
 *       - Endorsements
 *     description: DELETE Endorsements by Id API
 *     summary: Delete Specific Endorsements
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
router.delete('/:id', verify_user_account, EndorsementsController.delete)

module.exports.EndorsementsRoutes = router