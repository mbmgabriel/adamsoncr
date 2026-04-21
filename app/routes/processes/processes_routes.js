const express = require('express')
const router = express.Router()

const { ProcessesController } = require('../../controllers/processes/processes_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/processes/create:
 *   post:
 *     tags:
 *       - Processes
 *     description: CREATE Processes API
 *     summary: Create New Processes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessessResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Processes'
 */
router.post('/create', verify_user_account, ProcessesController.create)
/**
 *  @openapi
 *  /api/v1/processes/all:
 *    get:
 *      tags: 
 *        - Processes
 *      description: GET All Processes API.
 *      summary: Get All Processes
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ProcessessResponse'
*/
router.get('/all', verify_user_account, ProcessesController.all)
/**
 *  @openapi
 *  /api/v1/processes/{id}:
 *    get:
 *      tags: 
 *        - Processes
 *      description: GET Specific Processes by Id API.
 *      summary: Get Specific Processes
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
 *                $ref: '#/components/schemas/ProcessesResponse'
 *      
*/
router.get('/:id', verify_user_account, ProcessesController.get)
/**
 * @openapi
 * /api/v1/processes/{id}:
 *   put:
 *     tags:
 *       - Processes
 *     description: UPDATE Processes by Id API
 *     summary: Update Specific Processes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessesResponse'
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
 *             $ref: '#/components/schemas/Processes'
 * 
 */
router.put('/:id', verify_user_account, ProcessesController.update)
/**
 * @openapi
 * /api/v1/processes/{id}:
 *   delete:
 *     tags:
 *       - Processes
 *     description: DELETE Processes by Id API
 *     summary: Delete Specific Processes
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
router.delete('/:id', verify_user_account, ProcessesController.delete)

module.exports.ProcessesRoutes = router