const express = require('express')
const router = express.Router()

const { FormTypesController } = require('../../controllers/form_types/form_types_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/form-types/create:
 *   post:
 *     tags:
 *       - FormTypes
 *     description: CREATE FormTypes API
 *     summary: Create New FormTypes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormTypessResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormTypes'
 */
router.post('/create', verify_user_account, FormTypesController.create)
/**
 *  @openapi
 *  /api/v1/form-types/all:
 *    get:
 *      tags: 
 *        - FormTypes
 *      description: GET All FormTypes API.
 *      summary: Get All FormTypes
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/FormTypessResponse'
*/
router.get('/all', verify_user_account, FormTypesController.all)
/**
 *  @openapi
 *  /api/v1/form-types/{id}:
 *    get:
 *      tags: 
 *        - FormTypes
 *      description: GET Specific FormTypes by Id API.
 *      summary: Get Specific FormTypes
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
 *                $ref: '#/components/schemas/FormTypesResponse'
 *      
*/
router.get('/:id', verify_user_account, FormTypesController.get)
/**
 * @openapi
 * /api/v1/form-types/{id}:
 *   put:
 *     tags:
 *       - FormTypes
 *     description: UPDATE FormTypes by Id API
 *     summary: Update Specific FormTypes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormTypesResponse'
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
 *             $ref: '#/components/schemas/FormTypes'
 * 
 */
router.put('/:id', verify_user_account, FormTypesController.update)
// /**
//  * @openapi
//  * /api/v1/form-types/{id}:
//  *   delete:
//  *     tags:
//  *       - FormTypes
//  *     description: DELETE FormTypes by Id API
//  *     summary: Delete Specific FormTypes
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Ok
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: integer
//  *         required: true
//  * 
//  */
// router.delete('/:id', verify_user_account, FormTypesController.delete)

module.exports.FormTypesRoutes = router