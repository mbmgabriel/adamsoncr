const express = require('express')
const router = express.Router()

const { BudgetBreakdownDetailsController } = require('../../controllers/budget_breakdown_details/budget_breakdown_details_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/budget_breakdown_details/create:
 *   post:
 *     tags:
 *       - BudgetBreakdownDetails
 *     description: CREATE BudgetBreakdownDetails API
 *     summary: Create New BudgetBreakdownDetails
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetBreakdownDetailssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetBreakdownDetails'
 */
router.post('/create', verify_user_account, BudgetBreakdownDetailsController.create)
/**
 *  @openapi
 *  /api/v1/budget_breakdown_details/all:
 *    get:
 *      tags: 
 *        - BudgetBreakdownDetails
 *      description: GET All BudgetBreakdownDetails API.
 *      summary: Get All BudgetBreakdownDetails
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BudgetBreakdownDetailssResponse'
*/
router.get('/all', verify_user_account, BudgetBreakdownDetailsController.all)
/**
 *  @openapi
 *  /api/v1/budget_breakdown_details/{id}:
 *    get:
 *      tags: 
 *        - BudgetBreakdownDetails
 *      description: GET Specific BudgetBreakdownDetails by Id API.
 *      summary: Get Specific BudgetBreakdownDetails
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
 *                $ref: '#/components/schemas/BudgetBreakdownDetailsResponse'
 *      
*/
router.get('/:id', verify_user_account, BudgetBreakdownDetailsController.get)
/**
 * @openapi
 * /api/v1/budget_breakdown_details/{id}:
 *   put:
 *     tags:
 *       - BudgetBreakdownDetails
 *     description: UPDATE BudgetBreakdownDetails by Id API
 *     summary: Update Specific BudgetBreakdownDetails
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetBreakdownDetailsResponse'
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
 *             $ref: '#/components/schemas/BudgetBreakdownDetails'
 * 
 */
router.put('/:id', verify_user_account, BudgetBreakdownDetailsController.update)
/**
 * @openapi
 * /api/v1/budget_breakdown_details/{id}:
 *   delete:
 *     tags:
 *       - BudgetBreakdownDetails
 *     description: DELETE BudgetBreakdownDetails by Id API
 *     summary: Delete Specific BudgetBreakdownDetails
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
router.delete('/:id', verify_user_account, BudgetBreakdownDetailsController.delete)

module.exports.BudgetBreakdownDetailsRoutes = router