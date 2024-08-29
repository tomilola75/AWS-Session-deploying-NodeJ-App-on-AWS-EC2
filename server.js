const express = require("express");
const app = express();
const { resolve } = require("path");
const port = process.env.PORT || 3000;

// Importing the dotenv module to use environment variables:
require("dotenv").config();

const api_key = process.env.SECRET_KEY;

const stripe = require("stripe")(api_key);

// Setting up the static folder:
app.use(express.static(resolve(__dirname, process.env.STATIC_DIR)));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route for the homepage:
app.get("/", (req, res) => {
  const path = resolve(__dirname, process.env.STATIC_DIR, "index.html");
  res.sendFile(path);
});

// Route for the success page:
app.get("/success", (req, res) => {
  const path = resolve(__dirname, process.env.STATIC_DIR, "success.html");
  res.sendFile(path);
});

// Route for the cancel page:
app.get("/cancel", (req, res) => {
  const path = resolve(__dirname, process.env.STATIC_DIR, "cancel.html");
  res.sendFile(path);
});

// Workshop page routes:
app.get("/workshop1", (req, res) => {
  const path = resolve(__dirname, process.env.STATIC_DIR, "workshops", "workshop1.html");
  res.sendFile(path);
});

app.get("/workshop2", (req, res) => {
  const path = resolve(__dirname, process.env.STATIC_DIR, "workshops", "workshop2.html");
  res.sendFile(path);
});

app.get("/workshop3", (req, res) => {
  const path = resolve(__dirname, process.env.STATIC_DIR, "workshops", "workshop3.html");
  res.sendFile(path);
});

// Stripe Checkout session creation route:
app.post("/create-checkout-session/:pid", async (req, res) => {
  const priceId = req.params.pid;
  const domainURL = process.env.DOMAIN;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${domainURL}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/cancel`,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true, // Allowing the use of promo codes
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send("Error creating checkout session");
  }
});

// Server listening:
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
  console.log(`You may access your app at: ${process.env.DOMAIN}`);
});
