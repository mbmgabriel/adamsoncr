const express = require('express')
const router = express.Router()

const { SAttachmentInfosController } = require('../../controllers/s_attachment_infos/s_attachment_infos_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/s-attachment-infos/create:
 *   post:
 *     tags:
 *       - SAttachmentInfos
 *     description: CREATE SAttachmentInfos API
 *     summary: Create New SAttachmentInfos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SAttachmentInfossResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SAttachmentInfos'
 */
router.post('/create', verify_user_account, SAttachmentInfosController.create)
/**
 *  @openapi
 *  /api/v1/s-attachment-infos/all:
 *    get:
 *      tags: 
 *        - SAttachmentInfos
 *      description: GET All SAttachmentInfos API.
 *      summary: Get All SAttachmentInfos
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SAttachmentInfossResponse'
*/
router.get('/all', verify_user_account, SAttachmentInfosController.all)
/**
 *  @openapi
 *  /api/v1/s-attachment-infos/{id}:
 *    get:
 *      tags: 
 *        - SAttachmentInfos
 *      description: GET Specific SAttachmentInfos by Id API.
 *      summary: Get Specific SAttachmentInfos
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
 *                $ref: '#/components/schemas/SAttachmentInfosResponse'
 *      
*/
router.get('/:id', verify_user_account, SAttachmentInfosController.get)
/**
 * @openapi
 * /api/v1/s-attachment-infos/{id}:
 *   put:
 *     tags:
 *       - SAttachmentInfos
 *     description: UPDATE SAttachmentInfos by Id API
 *     summary: Update Specific SAttachmentInfos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SAttachmentInfosResponse'
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
 *             $ref: '#/components/schemas/SAttachmentInfos'
 * 
 */
router.put('/:id', verify_user_account, SAttachmentInfosController.update)
/**
 * @openapi
 * /api/v1/s-attachment-infos/{id}:
 *   delete:
 *     tags:
 *       - SAttachmentInfos
 *     description: DELETE SAttachmentInfos by Id API
 *     summary: Delete Specific SAttachmentInfos
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
router.delete('/:id', verify_user_account, SAttachmentInfosController.delete)

module.exports.SAttachmentInfosRoutes = router