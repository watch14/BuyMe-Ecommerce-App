import express from "express";
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
} from "../controllers/receipt.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Receipts
 *   description: Operations related to receipts
 */

/**
 * @swagger
 * /api/receipts:
 *   post:
 *     summary: Create a new receipt
 *     tags: [Receipts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productList
 *             properties:
 *               userId:
 *                 type: string
 *               productList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Receipt created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", createReceipt);

/**
 * @swagger
 * /api/receipts:
 *   get:
 *     summary: Get all receipts
 *     tags: [Receipts]
 *     responses:
 *       200:
 *         description: A list of receipts
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllReceipts);

/**
 * @swagger
 * /api/receipts/{id}:
 *   get:
 *     summary: Get receipt by ID
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receipt retrieved successfully
 *       404:
 *         description: Receipt not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getReceiptById);

/**
 * @swagger
 * /api/receipts/{id}:
 *   put:
 *     summary: Update a receipt by ID
 *     tags: [Receipts]
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
 *             required:
 *               - productList
 *             properties:
 *               productList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Receipt updated successfully
 *       404:
 *         description: Receipt not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateReceipt);

/**
 * @swagger
 * /api/receipts/{id}:
 *   delete:
 *     summary: Delete a receipt by ID
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receipt deleted successfully
 *       404:
 *         description: Receipt not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteReceipt);

export default router;
