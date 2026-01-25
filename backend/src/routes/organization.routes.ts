/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization management endpoints (Better Auth Plugin)
 */

/**
 * @swagger
 * /api/auth/organization/create:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 description: Organization name
 *                 example: "My Organization"
 *               slug:
 *                 type: string
 *                 description: Organization slug (URL-friendly)
 *                 example: "my-org"
 *               logo:
 *                 type: string
 *                 description: Organization logo URL
 *                 example: "https://example.com/logo.png"
 *               metadata:
 *                 type: object
 *                 description: Additional metadata
 *     responses:
 *       200:
 *         description: Organization created successfully
 *       401:
 *         description: Unauthorized
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/list-user-organizations:
 *   get:
 *     summary: List all organizations the current user belongs to
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       logo:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [owner, admin, member]
 *                       isActive:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/set-active-organization:
 *   post:
 *     summary: Set the active organization for the current session
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *             properties:
 *               organizationId:
 *                 type: string
 *                 description: Organization ID to set as active
 *     responses:
 *       200:
 *         description: Active organization set successfully
 *       401:
 *         description: Unauthorized
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/invite-member:
 *   post:
 *     summary: Invite a member to the organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - email
 *               - role
 *             properties:
 *               organizationId:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member]
 *               teamId:
 *                 type: string
 *                 description: Optional team ID to add member to
 *     responses:
 *       200:
 *         description: Member invited successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/list-members:
 *   get:
 *     summary: List all members of an organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: List of organization members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [owner, admin, member]
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *       401:
 *         description: Unauthorized
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/update-member-role:
 *   post:
 *     summary: Update a member's role in the organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - memberId
 *               - role
 *             properties:
 *               organizationId:
 *                 type: string
 *               memberId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member]
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/remove-member:
 *   post:
 *     summary: Remove a member from the organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - memberId
 *             properties:
 *               organizationId:
 *                 type: string
 *               memberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/create-team:
 *   post:
 *     summary: Create a team in an organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - name
 *             properties:
 *               organizationId:
 *                 type: string
 *               name:
 *                 type: string
 *                 description: Team name
 *     responses:
 *       200:
 *         description: Team created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/list-teams:
 *   get:
 *     summary: List all teams in an organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         required: false
 *         schema:
 *           type: string
 *         description: Organization ID (defaults to active organization)
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       organizationId:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/remove-team:
 *   post:
 *     summary: Remove a team from an organization
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - teamId
 *             properties:
 *               organizationId:
 *                 type: string
 *               teamId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
// Note: This endpoint is handled by Better Auth plugin

/**
 * @swagger
 * /api/auth/organization/check-slug:
 *   post:
 *     summary: Check if an organization slug is available
 *     tags: [Organizations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *             properties:
 *               slug:
 *                 type: string
 *                 description: Slug to check
 *     responses:
 *       200:
 *         description: Slug availability check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     available:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 */
// Note: This endpoint is handled by Better Auth plugin

// This file documents Better Auth organization endpoints for Swagger
// The actual endpoints are handled by the Better Auth plugin at /api/auth/organization/*
// These Swagger annotations provide API documentation for developers

export default {};
