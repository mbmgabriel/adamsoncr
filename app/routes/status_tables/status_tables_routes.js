const express = require('express')
const router = express.Router()

const { StatusTablesController } = require('../../controllers/status_tables/status_tables_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/status_tables/create:
 *   post:
 *     tags:
 *       - StatusTables
 *     description: CREATE StatusTables API
 *     summary: Create New StatusTables
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusTablessResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusTables'
 */
router.post('/create', verify_user_account, StatusTablesController.create)
/**
 *  @openapi
 *  /api/v1/status_tables/all:
 *    get:
 *      tags: 
 *        - StatusTables
 *      description: GET All StatusTables API.
 *      summary: Get All StatusTables
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/StatusTablessResponse'
*/
router.get('/all', verify_user_account, StatusTablesController.all)
/**
 *  @openapi
 *  /api/v1/status_tables/{id}:
 *    get:
 *      tags: 
 *        - StatusTables
 *      description: GET Specific StatusTables by Id API.
 *      summary: Get Specific StatusTables
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
 *                $ref: '#/components/schemas/StatusTablesResponse'
 *      
*/
router.get('/:id', verify_user_account, StatusTablesController.get)
/**
 * @openapi
 * /api/v1/status_tables/{id}:
 *   put:
 *     tags:
 *       - StatusTables
 *     description: UPDATE StatusTables by Id API
 *     summary: Update Specific StatusTables
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusTablesResponse'
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
 *             $ref: '#/components/schemas/StatusTables'
 * 
 */
router.put('/:id', verify_user_account, StatusTablesController.update)
/**
 * @openapi
 * /api/v1/status_tables/{id}:
 *   delete:
 *     tags:
 *       - StatusTables
 *     description: DELETE StatusTables by Id API
 *     summary: Delete Specific StatusTables
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
router.delete('/:id', verify_user_account, StatusTablesController.delete)

module.exports.StatusTablesRoutes = router