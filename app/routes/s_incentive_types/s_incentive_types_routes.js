const express = require('express')
const router = express.Router()

const { SIncentiveTypesController } = require('../../controllers/s_incentive_types/s_incentive_types_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/s-incentive-types/create:
 *   post:
 *     tags:
 *       - SIncentiveTypes
 *     description: CREATE SIncentiveTypes API
 *     summary: Create New SIncentiveTypes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SIncentiveTypessResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SIncentiveTypes'
 */
router.post('/create', verify_user_account, SIncentiveTypesController.create)
/**
 *  @openapi
 *  /api/v1/s-incentive-types/all:
 *    get:
 *      tags: 
 *        - SIncentiveTypes
 *      description: GET All SIncentiveTypes API.
 *      summary: Get All SIncentiveTypes
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SIncentiveTypessResponse'
*/
router.get('/all', verify_user_account, SIncentiveTypesController.all)
/**
 *  @openapi
 *  /api/v1/s-incentive-types/{id}:
 *    get:
 *      tags: 
 *        - SIncentiveTypes
 *      description: GET Specific SIncentiveTypes by Id API.
 *      summary: Get Specific SIncentiveTypes
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
 *                $ref: '#/components/schemas/SIncentiveTypesResponse'
 *      
*/
router.get('/:id', verify_user_account, SIncentiveTypesController.get)
/**
 * @openapi
 * /api/v1/s-incentive-types/{id}:
 *   put:
 *     tags:
 *       - SIncentiveTypes
 *     description: UPDATE SIncentiveTypes by Id API
 *     summary: Update Specific SIncentiveTypes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SIncentiveTypesResponse'
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
 *             $ref: '#/components/schemas/SIncentiveTypes'
 * 
 */
router.put('/:id', verify_user_account, SIncentiveTypesController.update)
/**
 * @openapi
 * /api/v1/s-incentive-types/{id}:
 *   delete:
 *     tags:
 *       - SIncentiveTypes
 *     description: DELETE SIncentiveTypes by Id API
 *     summary: Delete Specific SIncentiveTypes
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
router.delete('/:id', verify_user_account, SIncentiveTypesController.delete)

module.exports.SIncentiveTypesRoutes = router