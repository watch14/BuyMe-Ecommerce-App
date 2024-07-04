import express from "express";
import { getAllProducts } from "../controllers/sort.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

/**
 * @swagger
 * /api/sort:
 *   get:
 *     summary: Get all products with optional sorting and filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., productName, productPrice)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: Sort order (asc or desc)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter products
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllProducts);

export default router;
