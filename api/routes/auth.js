import express from "express";
import {
  login,
  register,
  registerAdmin,
  resetPassword,
  sendEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operations related to products
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       500:
 *         description: Internal server error
 */
router.post("/register", register);

// registre as admin
/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Auth]
 *     description: Register a new user with admin privileges.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin registered successfully
 *       500:
 *         description: Internal server error
 */
router.post("/register-admin", registerAdmin);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.post("/login", login);

//send reset Email
/**
 * @swagger
 * /api/auth/send-email:
 *   post:
 *     summary: Send reset email to user
 *     tags: [Auth]
 *     description: Send a reset email to the user's registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset email sent successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid email)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/send-email", sendEmail);

//reset the password
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user's password
 *     tags: [Auth]
 *     description: Reset user's password using a valid token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Bad request (e.g., missing token or password)
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", resetPassword);

export default router;
