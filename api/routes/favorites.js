import express from "express";
import {
  addToFavorite,
  removeFromFavorite,
  getUserFavorites,
} from "../controllers/favorite.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Operations related to user favorites
 */

/**
 * @swagger
 * /api/favorite:
 *   post:
 *     summary: Add to favorite
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to favorites successfully
 *       400:
 *         description: Bad request
 */
router.post("/", addToFavorite);

/**
 * @swagger
 * /api/favorite/remove:
 *   post:
 *     summary: Remove from favorite
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Removed from favorites successfully
 *       404:
 *         description: Product not found in favorites
 *       500:
 *         description: Internal server error
 */
router.post("/remove", removeFromFavorite);

/**
 * @swagger
 * /api/favorite/user/{userId}:
 *   get:
 *     summary: Get user's favorite products
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: ObjectId of the user
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/user/:userId", getUserFavorites);

export default router;
