/**
 * @openapi
 * components:
 *   schemas:
 *     Departments:
 *       type: object
 *       properties:
 *         dept_name:
 *           type: integer
 *         dept_initials:
 *           type: integer
 *         dept_desc:
 *           type: integer
 *     DepartmentsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Departments'
 *         - $ref: '#/components/schemas/TimeStamps'
 *     DepartmentssResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/DepartmentsResponse'
 */