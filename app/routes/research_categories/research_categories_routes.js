const express = require('express')
const router = express.Router()

const { ResearchCategoryController } = require('../../controllers/research_categories/research_categories_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

/**
 * @openapi
 * /api/v1/research_categories/create:
 *   post:
 *     tags:
 *       - ResearchCategory
 *     description: CREATE ResearchCategory API
 *     summary: Create New ResearchCategory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchCategorysResponse'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResearchCategory'
 */
router.post('/create', verify_user_account, ResearchCategoryController.create)
/**
 *  @openapi
 *  /api/v1/research_categories/all:
 *    get:
 *      tags: 
 *        - ResearchCategory
 *      description: GET All ResearchCategory API.
 *      summary: Get All ResearchCategory
 *      security: 
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResearchCategorysResponse'
*/
router.get('/all', verify_user_account, ResearchCategoryController.all)
/**
 *  @openapi
 *  /api/v1/research_categories/{id}:
 *    get:
 *      tags: 
 *        - ResearchCategory
 *      description: GET Specific ResearchCategory by Id API.
 *      summary: Get Specific ResearchCategory
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
 *                $ref: '#/components/schemas/ResearchCategoryResponse'
 *      
*/
router.get('/:id', verify_user_account, ResearchCategoryController.get)
/**
 * @openapi
 * /api/v1/research_categories/{id}:
 *   put:
 *     tags:
 *       - ResearchCategory
 *     description: UPDATE ResearchCategory by Id API
 *     summary: Update Specific ResearchCategory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResearchCategoryResponse'
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
 *             $ref: '#/components/schemas/ResearchCategory'
 * 
 */
router.put('/:id', verify_user_account, ResearchCategoryController.update)
/**
 * @openapi
 * /api/v1/research_categories/{id}:
 *   delete:
 *     tags:
 *       - ResearchCategory
 *     description: DELETE ResearchCategory by Id API
 *     summary: Delete Specific ResearchCategory
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
router.delete('/:id', verify_user_account, ResearchCategoryController.delete)

module.exports.ResearchCategoryRoutes = router