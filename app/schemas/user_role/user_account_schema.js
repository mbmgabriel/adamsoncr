/**
 * @openapi
 * components:
 *   schemas:
 *     UserRole:
 *       type: object
 *       properties:
 *         role_name:
 *           type: string
 *           example: 'Administrator'
 *         role_desc:
 *           type: string
 *           example: 'Administrator'
 *     UserRoleResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/UserRole'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     UserRolesResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/UserRoleResponse'
 */
