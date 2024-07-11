// routes/payment.js
import express from "express";
import Stripe from "stripe";
import Cart from "../models/Cart.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

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
          unit_amount: priceInCents, // Ensure unit_amount is an integer and valid
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
export default router;
