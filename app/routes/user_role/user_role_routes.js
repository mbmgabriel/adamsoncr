const express = require('express')
const router = express.Router()

const { UserRoleController } = require('../../controllers/user_roles/user_role_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/roles/create:
 *   post:
 *     tags:
 *       - User Roles
 *     description: CREATE User Role API
 *     summary: Create New User Role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRolesResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRole'
 */
router.post('/create', verify_user_account, UserRoleController.create)
/**
 *  @openapi
 *  /api/v1/roles/all:
 *    get:
 *      tags: 
 *        - User Roles
 *      description: GET All User Roles API.
 *      summary: Get All User Roles
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserRolesResponse'
*/
router.get('/all', verify_user_account, UserRoleController.all)
/**
 *  @openapi
 *  /api/v1/roles/{id}:
 *    get:
 *      tags: 
 *        - User Roles
 *      description: GET Specific User Role by Id API.
 *      summary: Get Specific User Role
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
 *                $ref: '#/components/schemas/UserRoleResponse'
 *      
*/
router.get('/:id', verify_user_account, UserRoleController.get)
/**
 * @openapi
 * /api/v1/roles/{id}:
 *   put:
 *     tags:
 *       - User Roles
 *     description: UPDATE User Role by Id API
 *     summary: Update Specific User Role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleResponse'
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
 *             $ref: '#/components/schemas/UserRole'
 * 
 */
router.put('/:id', verify_user_account, UserRoleController.update)
/**
 * @openapi
 * /api/v1/roles/{id}:
 *   delete:
 *     tags:
 *       - User Roles
 *     description: DELETE User Role by Id API
 *     summary: Delete Specific User Role
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
router.delete('/:id', verify_user_account, UserRoleController.delete)

module.exports.UserRoleRoutes = router