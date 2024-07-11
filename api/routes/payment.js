import express from "express";
import Stripe from "stripe";
import Cart from "../models/Cart.js";
import Receipt from "../models/Receipt.js";
import User from "../models/User.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

import { sendEmail } from "../utils/mailer.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

// Function to generate a unique receipt number
const generateReceiptNumber = () => {
  return `RCPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Utility function to format product list for email
const formatProductList = (products) => {
  return products
    .map((product, index) => {
      return `${product.productId.productName} - ${product.quantity} : ${product.productId.productPrice}`;
    })
    .join("\n");
};

// Create Checkout Session
router.post("/create-checkout-session", async (req, res, next) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "productName productPrice"
    );

    if (!cart || !cart.products || cart.products.length === 0) {
      return next(CreateError(404, "Cart not found or is empty"));
    }

    const lineItems = cart.products.map((product) => {
      const priceInCents = Math.round(product.productId.productPrice * 100);

      if (priceInCents > 999999999999) {
        throw new Error(
          `Price for product ${product.productId.productName} is too high`
        );
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.productId.productName,
          },
          unit_amount: priceInCents,
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      client_reference_id: userId, // Add this line
    });

    res
      .status(200)
      .json(CreateSuccess(200, "Checkout session created", { id: session.id }));
  } catch (error) {
    console.error(error);
    return next(
      CreateError(
        500,
        error.message || "Internal server error for creating checkout session"
      )
    );
  }
});

// Handle Payment Success
router.get("/payment-success", async (req, res, next) => {
  const sessionId = req.query.session_id;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const cart = await Cart.findOne({
      userId: session.client_reference_id,
    }).populate("products.productId", "productName productPrice");

    if (!cart || !cart.products || cart.products.length === 0) {
      return next(CreateError(404, "Cart not found or is empty"));
    }

    const totalPrice = cart.products.reduce((total, product) => {
      return total + product.quantity * product.productId.productPrice;
    }, 0);

    const tax = totalPrice * 0.18;

    const newReceipt = new Receipt({
      userId: cart.userId,
      productList: cart.products.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.productPrice,
      })),
      totalPrice,
      tax,
      receiptNumber: generateReceiptNumber(),
    });

    await newReceipt.save();

    const user = await User.findById(cart.userId);
    if (user) {
      const emailSubject = `Receipt Number: ${newReceipt.receiptNumber}`;
      const emailText = `Dear ${user.firstName} ${
        user.lastName
      },\n\nYour receipt with number ${
        newReceipt.receiptNumber
      } has been created successfully.\n\nBelow are the details:\n\n${formatProductList(
        cart.products
      )}\nTotal Price: ${totalPrice.toFixed(
        2
      )}\n\nThank you for choosing our services.\n\nRegards,\nBuyMe`;

      await sendEmail(user.email, emailSubject, emailText);

      const sellerEmailSubject = `New Purchase: Receipt Number ${newReceipt.receiptNumber}`;
      const sellerEmailText = `Dear BuyMe,\n\n${user.firstName} ${
        user.lastName
      } has made a purchase.\n\nReceipt Number: ${
        newReceipt.receiptNumber
      }\n\nBelow are the details:\n\n${formatProductList(
        cart.products
      )}\n\nTotal Price: ${totalPrice.toFixed(
        2
      )}\n\nThank you for your prompt attention.\n\nRegards,\nBuyMe`;

      await sendEmail(
        process.env.GMAIL_USER,
        sellerEmailSubject,
        sellerEmailText
      );

      // Clear the cart after creating the receipt
      cart.products = [];
      await cart.save();
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Payment successful and receipt created",
        data: newReceipt,
      });
  } catch (error) {
    console.error("Error verifying payment session:", error);
    return next(
      CreateError(
        500,
        error.message || "Internal server error for handling payment success"
      )
    );
  }
});

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Operations related to payment processing
 */

/**
 * @swagger
 * /api/payment/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout session
 *     tags: [Payment]
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
 *                 description: ID of the user
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *       404:
 *         description: Cart not found or is empty
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/payment/payment-success:
 *   get:
 *     summary: Handle payment success
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the checkout session
 *     responses:
 *       200:
 *         description: Payment successful and receipt created
 *       404:
 *         description: Cart not found or is empty
 *       500:
 *         description: Internal server error
 */
export default router;
