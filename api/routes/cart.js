import express from "express";
import {
  addToCart,
  deleteFromCart,
  emptyCart,
  getCart,
  removeCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operations related to user's shopping cart
 */

/**
 * @swagger
 * /api/cart/add-to-cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user adding the product to the cart
 *               productId:
 *                 type: string
 *                 description: ID of the product to add
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product to add
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Bad request - Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */
router.post("/add-to-cart", addToCart);

/**
 * @swagger
 * /api/cart/get-cart:
 *   get:
 *     summary: Get details of the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Cart ID
 *                 userId:
 *                   type: string
 *                   description: User ID associated with the cart
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: ID of the product
 *                       quantity:
 *                         type: number
 *                         description: Quantity of the product
 *                       _id:
 *                         type: string
 *                         description: ID of the product entry in the cart
 *                 active:
 *                   type: boolean
 *                   description: Indicates if the cart is active
 *                 modifiedOn:
 *                   type: string
 *                   format: date-time
 *                   description: Date and time of last modification
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.get("/get-cart", getCart);

/**
 * @swagger
 * /api/cart/delete-from-cart:
 *   post:
 *     summary: Delete a product from the cart
 *     tags: [Cart]
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
 *         description: Product removed from cart successfully
 *       404:
 *         description: Product not found in the cart
 *       500:
 *         description: Internal server error
 */
router.post("/delete-from-cart", deleteFromCart);

/**
 * @swagger
 * /api/cart/empty-cart:
 *   post:
 *     summary: Empty the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart emptied successfully
 *       404:
 *         description: Cart not found or is already empty
 *       500:
 *         description: Internal server error
 */
router.post("/empty-cart", emptyCart);

/**
 * @swagger
 * /api/cart/remove-cart:
 *   delete:
 *     summary: Remove the entire cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart removed successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.delete("/remove-cart", removeCart);

export default router;
