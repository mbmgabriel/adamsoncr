const express = require('express')
const router = express.Router()

const { SPeerReviewProofController } = require('../../controllers/s_peer_review_proof/s_peer_review_proof_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/s-peer-review-proof/create:
 *   post:
 *     tags:
 *       - SPeerReviewProof
 *     description: CREATE SPeerReviewProof API
 *     summary: Create New SPeerReviewProof
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SPeerReviewProofsResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SPeerReviewProof'
 */
router.post('/create', verify_user_account, SPeerReviewProofController.create)
/**
 *  @openapi
 *  /api/v1/s-peer-review-proof/all:
 *    get:
 *      tags: 
 *        - SPeerReviewProof
 *      description: GET All SPeerReviewProof API.
 *      summary: Get All SPeerReviewProof
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SPeerReviewProofsResponse'
*/
router.get('/all', verify_user_account, SPeerReviewProofController.all)
/**
 *  @openapi
 *  /api/v1/s-peer-review-proof/{id}:
 *    get:
 *      tags: 
 *        - SPeerReviewProof
 *      description: GET Specific SPeerReviewProof by Id API.
 *      summary: Get Specific SPeerReviewProof
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
 *                $ref: '#/components/schemas/SPeerReviewProofResponse'
 *      
*/
router.get('/:id', verify_user_account, SPeerReviewProofController.get)
/**
 * @openapi
 * /api/v1/s-peer-review-proof/{id}:
 *   put:
 *     tags:
 *       - SPeerReviewProof
 *     description: UPDATE SPeerReviewProof by Id API
 *     summary: Update Specific SPeerReviewProof
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SPeerReviewProofResponse'
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
 *             $ref: '#/components/schemas/SPeerReviewProof'
 * 
 */
router.put('/:id', verify_user_account, SPeerReviewProofController.update)
/**
 * @openapi
 * /api/v1/s-peer-review-proof/{id}:
 *   delete:
 *     tags:
 *       - SPeerReviewProof
 *     description: DELETE SPeerReviewProof by Id API
 *     summary: Delete Specific SPeerReviewProof
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
router.delete('/:id', verify_user_account, SPeerReviewProofController.delete)

module.exports.SPeerReviewProofRoutes = router