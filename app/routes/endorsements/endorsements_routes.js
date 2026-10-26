const express = require('express')
const router = express.Router()

const { EndorsementsController } = require('../../controllers/endorsements/endorsements_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/endorsements/create:
 *   post:
 *     tags:
 *       - Endorsements
 *     description: CREATE Endorsements API
 *     summary: Create New Endorsements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndorsementssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Endorsements'
 */
router.post('/create', verify_user_account, EndorsementsController.create)
/**
 *  @openapi
 *  /api/v1/endorsements/all:
 *    get:
 *      tags: 
 *        - Endorsements
 *      description: GET All Endorsements API.
 *      summary: Get All Endorsements
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/EndorsementssResponse'
*/
router.get('/all', verify_user_account, EndorsementsController.all)

/**
 *  @openapi
 *  /api/v1/endorsements/formtype/{form_type_id}/research/{research_id}:
 *    get:
 *      tags: 
 *        - Endorsements
 *      description: GET Specific Endorsements by Research Id and Form Type API.
 *      summary: Get Specific Endorsements by Research ID and Form Type
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: research_id
 *          schema:
 *           type: integer
 *          required: true
 *        - in: path
 *          name: form_type_id
 *          schema:
 *           type: integer
 *          required: true
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/EndorsementsResponse'
 *      
*/
router.get('/formtype/:form_type_id/research/:research_id', verify_user_account, EndorsementsController.getByResearchIdFormType)

/**
 *  @openapi
 *  /api/v1/endorsements/research/{research_id}:
 *    get:
 *      tags: 
 *        - Endorsements
 *      description: GET Specific Endorsements by Research Id API.
 *      summary: Get Specific Endorsements by Research ID
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: research_id
 *          schema:
 *           type: integer
 *          required: true
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/EndorsementsResponse'
 *      
*/
router.get('/research/:research_id', verify_user_account, require('../../services/notifications/applications').researchAccess, (req, res) => {
  req.params.form_type_id = 1;
  return EndorsementsController.getByResearchIdFormType(req, res);
})
/**
 *  @openapi
 *  /api/v1/endorsements/{id}:
 *    get:
 *      tags: 
 *        - Endorsements
 *      description: GET Specific Endorsements by Id API.
 *      summary: Get Specific Endorsements
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
 *                $ref: '#/components/schemas/EndorsementsResponse'
 *      
*/
router.get('/:id', verify_user_account, EndorsementsController.get)
/**
 * @openapi
 * /api/v1/endorsements/status/{research_id}/{form_type_id}:
 *   put:
 *     tags:
 *       - Endorsements
 *     description: UPDATE Endorsements by Research ID and User API
 *     summary: Update Specific Endorsements by Research ID and User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndorsementsResponse'
 *     parameters:
 *       - in: path
 *         name: research_id
 *         schema:
 *          type: integer
 *         required: true
 *       - in: path
 *         name: form_type_id
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_id:
 *                 type: integer
 *               remarks:
 *                 type: string
 * 
 */
router.put('/status/:research_id/:form_type_id', verify_user_account, (req, res) => Number(req.params.form_type_id) === 1 ? EndorsementsController.updateByResearchUser(req, res) : require('../../services/notifications/applications').reviewForm(req, res))

/**
 * @openapi
 * /api/v1/endorsements/endorse/{research_id}:
 *   put:
 *     tags:
 *       - Endorsements
 *     description: Endorse Endorsements by Research ID (ONLY RESEARCH)
 *     summary: Endorse Research (ONLY RESEARCH)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndorsementsResponse'
 *     parameters:
 *       - in: path
 *         name: research_id
 *         schema:
 *          type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remarks:
 *                 type: string
 * 
 */
router.put('/endorse/:research_id', verify_user_account, EndorsementsController.endorseResearch)

/**
 * @openapi
 * /api/v1/endorsements/reevaluate/{research_id}:
 *   put:
 *     tags:
 *       - Endorsements
 *     description: Send back Endorsement by Research ID (ONLY RESEARCH)
 *     summary: Research Reevaluate (ONLY RESEARCH)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndorsementsResponse'
 *     parameters:
 *       - in: path
 *         name: research_id
 *         schema:
 *          type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remarks:
 *                 type: string
 * 
 */
router.put('/reevaluate/:research_id', verify_user_account, EndorsementsController.reevaluateResearch)


/**
 * @openapi
 * /api/v1/endorsements/{id}:
 *   put:
 *     tags:
 *       - Endorsements
 *     description: UPDATE Endorsements by Id API
 *     summary: Update Specific Endorsements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndorsementsResponse'
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
 *             $ref: '#/components/schemas/Endorsements'
 * 
 */
router.put('/:id', verify_user_account, require('../../services/notifications/applications').reviewForm)
/**
 * @openapi
 * /api/v1/endorsements/{id}:
 *   delete:
 *     tags:
 *       - Endorsements
 *     description: DELETE Endorsements by Id API
 *     summary: Delete Specific Endorsements
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
router.delete('/:id', verify_user_account, EndorsementsController.delete)

module.exports.EndorsementsRoutes = router