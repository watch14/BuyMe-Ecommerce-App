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
 * /api/promo-code/create:
 *   post:
 *     summary: Create a new promo code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promoCode
 *             properties:
 *               promoCode:
 *                 type: string
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
