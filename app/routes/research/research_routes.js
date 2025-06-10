const express = require('express')
const router = express.Router()

const { ResearchController } = require('../../controllers/research/research_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/research/create:
 *   post:
 *     tags:
 *       - Research
 *     description: CREATE Research API
 *     summary: Create New Research
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchsResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Research'
 */
router.post('/create', verify_user_account, ResearchController.create)
/**
 *  @openapi
 *  /api/v1/research/all:
 *    get:
 *      tags: 
 *        - Research
 *      description: GET All Research API.
 *      summary: Get All Research
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResearchsResponse'
*/
router.get('/all', verify_user_account, ResearchController.all)
/**
 *  @openapi
 *  /api/v1/research/{id}:
 *    get:
 *      tags: 
 *        - Research
 *      description: GET Specific Research by Id API.
 *      summary: Get Specific Research
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
 *                $ref: '#/components/schemas/ResearchResponse'
 *      
*/
router.get('/:id', verify_user_account, ResearchController.get)
/**
 * @openapi
 * /api/v1/research/{id}:
 *   put:
 *     tags:
 *       - Research
 *     description: UPDATE Research by Id API
 *     summary: Update Specific Research
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchResponse'
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
 *             $ref: '#/components/schemas/Research'
 * 
 */
router.put('/:id', verify_user_account, ResearchController.update)
/**
 * @openapi
 * /api/v1/research/{id}:
 *   delete:
 *     tags:
 *       - Research
 *     description: DELETE Research by Id API
 *     summary: Delete Specific Research
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
router.delete('/:id', verify_user_account, ResearchController.delete)

module.exports.ResearchRoutes = router