import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - categoryId
 *               - productPrice
 *               - productPicture
 *               - productDescription
 *               - productRate
 *               - productStock
 *             properties:
 *               productName:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               productPicture:
 *                 type: array
 *                 items:
 *                   type: string
 *               productColor:
 *                 type: string
 *               productDescription:
 *                 type: string
 *               productRate:
 *                 type: number
 *               productStock:
 *                 type: number
 *               productDiscount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/create", createProduct);

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Search products by name or description with optional filters and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query to find products by name or description (can be partial)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum product price to filter products
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum product price to filter products
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter products by a specific category
 *       - in: query
 *         name: filterByStock
 *         schema:
 *           type: boolean
 *         description: If false, filter products with stock greater than 0; otherwise, do not filter by stock.
 *           Default behavior is not to filter by stock.
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of records to skip for pagination
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of records to return for pagination (max 100)
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/search", getAllProducts);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               productPicture:
 *                 type: array
 *                 items:
 *                   type: string
 *               productColor:
 *                 type: string
 *               productDescription:
 *                 type: string
 *               productRate:
 *                 type: number
 *               productStock:
 *                 type: number
 *               productDiscount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteProduct);

export default router;
