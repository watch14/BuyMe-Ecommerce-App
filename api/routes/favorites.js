import express from "express";
import {
  addToFavorite,
  removeFromFavorite,
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
 * /api/favorite/delete/{id}:
 *   delete:
 *     summary: Remove from favorite
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ObjectId of the favorite to remove
 *     responses:
 *       200:
 *         description: Removed from favorites successfully
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", removeFromFavorite);

export default router;
