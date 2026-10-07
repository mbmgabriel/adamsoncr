const express = require('express')
const router = express.Router()

const { IncentiveFormsController } = require('../../controllers/incentive_forms/incentive_forms_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/incentive-forms/create:
 *   post:
 *     tags:
 *       - IncentiveForms
 *     description: CREATE IncentiveForms API
 *     summary: Create New IncentiveForms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncentiveFormssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncentiveForms'
 */
router.post('/create', verify_user_account, IncentiveFormsController.create)
/**
 *  @openapi
 *  /api/v1/incentive-forms/all:
 *    get:
 *      tags: 
 *        - IncentiveForms
 *      description: GET All IncentiveForms API.
 *      summary: Get All IncentiveForms
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/IncentiveFormssResponse'
*/
router.get('/all', verify_user_account, IncentiveFormsController.all)

/**
 * @openapi
 * /api/v1/incentive-forms/user:
 *   get:
 *     tags:
 *       - IncentiveForms
 *     description: GET IncentiveForms by Logged-in User Account ID API
 *     summary: Get IncentiveForms by Logged-in User ID 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncentiveFormssResponse'
 */
router.get('/user', verify_user_account, IncentiveFormsController.getByUserId)

/**
 *  @openapi
 *  /api/v1/incentive-forms/{id}:
 *    get:
 *      tags: 
 *        - IncentiveForms
 *      description: GET Specific IncentiveForms by Id API.
 *      summary: Get Specific IncentiveForms
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
 *                $ref: '#/components/schemas/IncentiveFormsResponse'
 *      
*/
router.get('/:id', verify_user_account, IncentiveFormsController.get)

/**
 * @openapi
 * /api/v1/incentive-forms/{id}:
 *   put:
 *     tags:
 *       - IncentiveForms
 *     description: UPDATE IncentiveForms by Id API
 *     summary: Update Specific IncentiveForms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncentiveFormsResponse'
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
 *             $ref: '#/components/schemas/IncentiveForms'
 * 
 */
router.put('/:id', verify_user_account, IncentiveFormsController.update)
/**
 * @openapi
 * /api/v1/incentive-forms/{id}:
 *   delete:
 *     tags:
 *       - IncentiveForms
 *     description: DELETE IncentiveForms by Id API
 *     summary: Delete Specific IncentiveForms
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
router.delete('/:id', verify_user_account, IncentiveFormsController.delete)

module.exports.IncentiveFormsRoutes = router