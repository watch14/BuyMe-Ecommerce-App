import express from "express";
import {
  createPromoCode,
  deletePromoCode,
  getAllPromoCodes,
  getPromoCodeById,
} from "../controllers/promocode.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promo Code
 *   description: Operations related to promo codes
 */

/**
 * @swagger
 * /api/promo-code/create:
 *   post:
 *     summary: Create a new promo code
 *     tags: [Promo Code]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promoCode
 *               - discountType
 *               - discountValue
 *             properties:
 *               promoCode:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, exact]
 *               discountValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Promo code created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/create", createPromoCode);

/**
 * @swagger
 * /api/promo-code:
 *   get:
 *     summary: Get all promo codes
 *     tags: [Promo Code]
 *     responses:
 *       200:
 *         description: List of all promo codes
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllPromoCodes);

/**
 * @swagger
 * /api/promo-code/{id}:
 *   get:
 *     summary: Get a promo code by ID
 *     tags: [Promo Code]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo code ID
 *     responses:
 *       200:
 *         description: Promo code details
 *       404:
 *         description: Promo code not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getPromoCodeById);

/**
 * @swagger
 * /api/promo-code/delete/{id}:
 *   delete:
 *     summary: Delete a promo code by ID
 *     tags: [Promo Code]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo code ID
 *     responses:
 *       200:
 *         description: Promo code deleted successfully
 *       404:
 *         description: Promo code not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", deletePromoCode);

export default router;
