const express = require('express')
const router = express.Router()

const { CAttachmentInfosController } = require('../../controllers/c_attachment_infos/c_attachment_infos_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/c-attachment-infos/create:
 *   post:
 *     tags:
 *       - CAttachmentInfos
 *     description: CREATE CAttachmentInfos API
 *     summary: Create New CAttachmentInfos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CAttachmentInfossResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CAttachmentInfos'
 */
router.post('/create', verify_user_account, CAttachmentInfosController.create)
/**
 *  @openapi
 *  /api/v1/c-attachment-infos/all:
 *    get:
 *      tags: 
 *        - CAttachmentInfos
 *      description: GET All CAttachmentInfos API.
 *      summary: Get All CAttachmentInfos
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CAttachmentInfossResponse'
*/
router.get('/all', verify_user_account, CAttachmentInfosController.all)
/**
 *  @openapi
 *  /api/v1/c-attachment-infos/{id}:
 *    get:
 *      tags: 
 *        - CAttachmentInfos
 *      description: GET Specific CAttachmentInfos by Id API.
 *      summary: Get Specific CAttachmentInfos
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
 *                $ref: '#/components/schemas/CAttachmentInfosResponse'
 *      
*/
router.get('/:id', verify_user_account, CAttachmentInfosController.get)
/**
 * @openapi
 * /api/v1/c-attachment-infos/{id}:
 *   put:
 *     tags:
 *       - CAttachmentInfos
 *     description: UPDATE CAttachmentInfos by Id API
 *     summary: Update Specific CAttachmentInfos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CAttachmentInfosResponse'
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
 *             $ref: '#/components/schemas/CAttachmentInfos'
 * 
 */
router.put('/:id', verify_user_account, CAttachmentInfosController.update)
/**
 * @openapi
 * /api/v1/c-attachment-infos/{id}:
 *   delete:
 *     tags:
 *       - CAttachmentInfos
 *     description: DELETE CAttachmentInfos by Id API
 *     summary: Delete Specific CAttachmentInfos
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
router.delete('/:id', verify_user_account, CAttachmentInfosController.delete)

module.exports.CAttachmentInfosRoutes = router