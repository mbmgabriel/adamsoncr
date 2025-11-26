const express = require('express')
const router = express.Router()

const { EndorsementRepresentativeController } = require('../../controllers/endorsement_representatives/endorsement_representatives_controller')
const verify_user_account = require('../../middlewares/auth/verify_user_account')

// /**
//  * @openapi
//  * /api/v1/endorsement_representatives/create:
//  *   post:
//  *     tags:
//  *       - EndorsementRepresentative
//  *     description: CREATE EndorsementRepresentative API
//  *     summary: Create New EndorsementRepresentative
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Ok
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/EndorsementRepresentativesResponse'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/EndorsementRepresentative'
//  */
// router.post('/create', verify_user_account, EndorsementRepresentativeController.create)
// /**
//  *  @openapi
//  *  /api/v1/endorsement_representatives/all:
//  *    get:
//  *      tags: 
//  *        - EndorsementRepresentative
//  *      description: GET All EndorsementRepresentative API.
//  *      summary: Get All EndorsementRepresentative
//  *      security: 
//  *        - bearerAuth: []
//  *      responses:
//  *        200:
//  *          description: Ok
//  *          content:
//  *            application/json:
//  *              schema:
//  *                $ref: '#/components/schemas/EndorsementRepresentativesResponse'
// */
// router.get('/all', verify_user_account, EndorsementRepresentativeController.all)
// /**
//  *  @openapi
//  *  /api/v1/endorsement_representatives/{id}:
//  *    get:
//  *      tags: 
//  *        - EndorsementRepresentative
//  *      description: GET Specific EndorsementRepresentative by Id API.
//  *      summary: Get Specific EndorsementRepresentative
//  *      security: 
//  *        - bearerAuth: []
//  *      parameters:
//  *        - in: path
//  *          name: id
//  *          schema:
//  *           type: integer
//  *          required: true
//  *      responses:
//  *        200:
//  *          description: Ok
//  *          content:
//  *            application/json:
//  *              schema:
//  *                $ref: '#/components/schemas/EndorsementRepresentativeResponse'
//  *      
// */
// router.get('/:id', verify_user_account, EndorsementRepresentativeController.get)
// /**
//  * @openapi
//  * /api/v1/endorsement_representatives/{id}:
//  *   put:
//  *     tags:
//  *       - EndorsementRepresentative
//  *     description: UPDATE EndorsementRepresentative by Id API
//  *     summary: Update Specific EndorsementRepresentative
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Ok
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/EndorsementRepresentativeResponse'
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: integer
//  *         required: true
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/EndorsementRepresentative'
//  * 
//  */
// router.put('/:id', verify_user_account, EndorsementRepresentativeController.update)
// /**
//  * @openapi
//  * /api/v1/endorsement_representatives/{id}:
//  *   delete:
//  *     tags:
//  *       - EndorsementRepresentative
//  *     description: DELETE EndorsementRepresentative by Id API
//  *     summary: Delete Specific EndorsementRepresentative
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
// router.delete('/:id', verify_user_account, EndorsementRepresentativeController.delete)

module.exports.EndorsementRepresentativeRoutes = router