const express = require('express')
const router = express.Router()

const { SAssistanceFormProofsController } = require('../../controllers/s_assistance_form_proofs/s_assistance_form_proofs_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/s-assistance-form-proofs/create:
 *   post:
 *     tags:
 *       - SAssistanceFormProofs
 *     description: CREATE SAssistanceFormProofs API
 *     summary: Create New SAssistanceFormProofs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SAssistanceFormProofssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SAssistanceFormProofs'
 */
router.post('/create', verify_user_account, SAssistanceFormProofsController.create)
/**
 *  @openapi
 *  /api/v1/s-assistance-form-proofs/all:
 *    get:
 *      tags: 
 *        - SAssistanceFormProofs
 *      description: GET All SAssistanceFormProofs API.
 *      summary: Get All SAssistanceFormProofs
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SAssistanceFormProofssResponse'
*/
router.get('/all', verify_user_account, SAssistanceFormProofsController.all)
/**
 *  @openapi
 *  /api/v1/s-assistance-form-proofs/{id}:
 *    get:
 *      tags: 
 *        - SAssistanceFormProofs
 *      description: GET Specific SAssistanceFormProofs by Id API.
 *      summary: Get Specific SAssistanceFormProofs
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
 *                $ref: '#/components/schemas/SAssistanceFormProofsResponse'
 *      
*/
router.get('/:id', verify_user_account, SAssistanceFormProofsController.get)
/**
 * @openapi
 * /api/v1/s-assistance-form-proofs/{id}:
 *   put:
 *     tags:
 *       - SAssistanceFormProofs
 *     description: UPDATE SAssistanceFormProofs by Id API
 *     summary: Update Specific SAssistanceFormProofs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SAssistanceFormProofsResponse'
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
 *             $ref: '#/components/schemas/SAssistanceFormProofs'
 * 
 */
router.put('/:id', verify_user_account, SAssistanceFormProofsController.update)
/**
 * @openapi
 * /api/v1/s-assistance-form-proofs/{id}:
 *   delete:
 *     tags:
 *       - SAssistanceFormProofs
 *     description: DELETE SAssistanceFormProofs by Id API
 *     summary: Delete Specific SAssistanceFormProofs
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
router.delete('/:id', verify_user_account, SAssistanceFormProofsController.delete)

module.exports.SAssistanceFormProofsRoutes = router