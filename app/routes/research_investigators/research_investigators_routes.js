const express = require('express')
const router = express.Router()

const { ResearchInvestigatorsController } = require('../../controllers/research_investigators/research_investigators_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/research_investigators/create:
 *   post:
 *     tags:
 *       - ResearchInvestigators
 *     description: CREATE ResearchInvestigators API
 *     summary: Create New ResearchInvestigators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchInvestigatorssResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResearchInvestigators'
 */
router.post('/create', verify_user_account, ResearchInvestigatorsController.create)
/**
 *  @openapi
 *  /api/v1/research_investigators/all:
 *    get:
 *      tags: 
 *        - ResearchInvestigators
 *      description: GET All ResearchInvestigators API.
 *      summary: Get All ResearchInvestigators
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResearchInvestigatorssResponse'
*/
router.get('/all', verify_user_account, ResearchInvestigatorsController.all)
/**
 *  @openapi
 *  /api/v1/research_investigators/{id}:
 *    get:
 *      tags: 
 *        - ResearchInvestigators
 *      description: GET Specific ResearchInvestigators by Id API.
 *      summary: Get Specific ResearchInvestigators
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
 *                $ref: '#/components/schemas/ResearchInvestigatorsResponse'
 *      
*/
router.get('/:id', verify_user_account, ResearchInvestigatorsController.get)
/**
 * @openapi
 * /api/v1/research_investigators/{id}:
 *   put:
 *     tags:
 *       - ResearchInvestigators
 *     description: UPDATE ResearchInvestigators by Id API
 *     summary: Update Specific ResearchInvestigators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchInvestigatorsResponse'
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
 *             $ref: '#/components/schemas/ResearchInvestigators'
 * 
 */
router.put('/:id', verify_user_account, ResearchInvestigatorsController.update)
/**
 * @openapi
 * /api/v1/research_investigators/{id}:
 *   delete:
 *     tags:
 *       - ResearchInvestigators
 *     description: DELETE ResearchInvestigators by Id API
 *     summary: Delete Specific ResearchInvestigators
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
router.delete('/:id', verify_user_account, ResearchInvestigatorsController.delete)

module.exports.ResearchInvestigatorsRoutes = router