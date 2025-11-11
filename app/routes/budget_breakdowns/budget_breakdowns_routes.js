const express = require('express')
const router = express.Router()

const { BudgetBreakdownsController } = require('../../controllers/budget_breakdowns/budget_breakdowns_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/budget_breakdowns/create:
 *   post:
 *     tags:
 *       - BudgetBreakdowns
 *     description: CREATE BudgetBreakdowns API
 *     summary: Create New BudgetBreakdowns
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetBreakdownssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetBreakdowns'
 */
router.post('/create', verify_user_account, BudgetBreakdownsController.create)
/**
 *  @openapi
 *  /api/v1/budget_breakdowns/all:
 *    get:
 *      tags: 
 *        - BudgetBreakdowns
 *      description: GET All BudgetBreakdowns API.
 *      summary: Get All BudgetBreakdowns
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BudgetBreakdownssResponse'
*/
router.get('/all', verify_user_account, BudgetBreakdownsController.all)
/**
 *  @openapi
 *  /api/v1/budget_breakdowns/{id}:
 *    get:
 *      tags: 
 *        - BudgetBreakdowns
 *      description: GET Specific BudgetBreakdowns by Id API.
 *      summary: Get Specific BudgetBreakdowns
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
 *                $ref: '#/components/schemas/BudgetBreakdownsResponse'
 *      
*/
router.get('/:id', verify_user_account, BudgetBreakdownsController.get)
/**
 * @openapi
 * /api/v1/budget_breakdowns/{id}:
 *   put:
 *     tags:
 *       - BudgetBreakdowns
 *     description: UPDATE BudgetBreakdowns by Id API
 *     summary: Update Specific BudgetBreakdowns
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetBreakdownsResponse'
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
 *             $ref: '#/components/schemas/BudgetBreakdowns'
 * 
 */
router.put('/:id', verify_user_account, BudgetBreakdownsController.update)
/**
 * @openapi
 * /api/v1/budget_breakdowns/{id}:
 *   delete:
 *     tags:
 *       - BudgetBreakdowns
 *     description: DELETE BudgetBreakdowns by Id API
 *     summary: Delete Specific BudgetBreakdowns
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
router.delete('/:id', verify_user_account, BudgetBreakdownsController.delete)

module.exports.BudgetBreakdownsRoutes = router