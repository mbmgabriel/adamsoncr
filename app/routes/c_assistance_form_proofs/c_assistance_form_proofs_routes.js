const express = require('express')
const router = express.Router()

const { CAssistanceFormProofsController } = require('../../controllers/c_assistance_form_proofs/c_assistance_form_proofs_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/c-assistance-form-proofs/create:
 *   post:
 *     tags:
 *       - CAssistanceFormProofs
 *     description: CREATE CAssistanceFormProofs API
 *     summary: Create New CAssistanceFormProofs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CAssistanceFormProofssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CAssistanceFormProofs'
 */
router.post('/create', verify_user_account, CAssistanceFormProofsController.create)
/**
 *  @openapi
 *  /api/v1/c-assistance-form-proofs/all:
 *    get:
 *      tags: 
 *        - CAssistanceFormProofs
 *      description: GET All CAssistanceFormProofs API.
 *      summary: Get All CAssistanceFormProofs
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CAssistanceFormProofssResponse'
*/
router.get('/all', verify_user_account, CAssistanceFormProofsController.all)
/**
 *  @openapi
 *  /api/v1/c-assistance-form-proofs/{id}:
 *    get:
 *      tags: 
 *        - CAssistanceFormProofs
 *      description: GET Specific CAssistanceFormProofs by Id API.
 *      summary: Get Specific CAssistanceFormProofs
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
 *                $ref: '#/components/schemas/CAssistanceFormProofsResponse'
 *      
*/
router.get('/:id', verify_user_account, CAssistanceFormProofsController.get)
/**
 * @openapi
 * /api/v1/c-assistance-form-proofs/{id}:
 *   put:
 *     tags:
 *       - CAssistanceFormProofs
 *     description: UPDATE CAssistanceFormProofs by Id API
 *     summary: Update Specific CAssistanceFormProofs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CAssistanceFormProofsResponse'
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
 *             $ref: '#/components/schemas/CAssistanceFormProofs'
 * 
 */
router.put('/:id', verify_user_account, CAssistanceFormProofsController.update)
/**
 * @openapi
 * /api/v1/c-assistance-form-proofs/{id}:
 *   delete:
 *     tags:
 *       - CAssistanceFormProofs
 *     description: DELETE CAssistanceFormProofs by Id API
 *     summary: Delete Specific CAssistanceFormProofs
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
router.delete('/:id', verify_user_account, CAssistanceFormProofsController.delete)

module.exports.CAssistanceFormProofsRoutes = router