const express = require('express')
const router = express.Router()

const { DepartmentsController } = require('../../controllers/departments/departments_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/departments/create:
 *   post:
 *     tags:
 *       - Departments
 *     description: CREATE Departments API
 *     summary: Create New Departments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Departments'
 */
router.post('/create', verify_user_account, DepartmentsController.create)
/**
 *  @openapi
 *  /api/v1/departments/all:
 *    get:
 *      tags: 
 *        - Departments
 *      description: GET All Departments API.
 *      summary: Get All Departments
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DepartmentssResponse'
*/
router.get('/all', verify_user_account, DepartmentsController.all)
/**
 *  @openapi
 *  /api/v1/departments/{id}:
 *    get:
 *      tags: 
 *        - Departments
 *      description: GET Specific Departments by Id API.
 *      summary: Get Specific Departments
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
 *                $ref: '#/components/schemas/DepartmentsResponse'
 *      
*/
router.get('/:id', verify_user_account, DepartmentsController.get)
/**
 * @openapi
 * /api/v1/departments/{id}:
 *   put:
 *     tags:
 *       - Departments
 *     description: UPDATE Departments by Id API
 *     summary: Update Specific Departments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentsResponse'
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
 *             $ref: '#/components/schemas/Departments'
 * 
 */
router.put('/:id', verify_user_account, DepartmentsController.update)
/**
 * @openapi
 * /api/v1/departments/{id}:
 *   delete:
 *     tags:
 *       - Departments
 *     description: DELETE Departments by Id API
 *     summary: Delete Specific Departments
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
router.delete('/:id', verify_user_account, DepartmentsController.delete)

module.exports.DepartmentsRoutes = router