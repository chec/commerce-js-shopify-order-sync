require('dotenv').config()
const crypto = require("crypto");
const axios = require('axios');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

const signingKey = process.env.WEBHOOK_SIGNING_KEY;

router.get('/', (req, res) => {
  res.json({
    message: 'Commerce.js x Shopify Sync',
    body: {
        description: 'A small app to sync Commerce.js & Shopify Orders',
        website: 'http://commercejs.com',
        by: 'Chec - http://chec.io',
    },
  });
});

const { body, validationResult } = require('express-validator');

const orderController = require('../controllers/orderController');

router.post('/create', [
  body('payload.order.tax.amount.raw', 'Tax amount is required').exists(),
  body('payload.currency.code', 'Currency code is required').exists(),
  body('payload.customer.email', 'Customer Email is required').exists(),
  body('payload.shipping.street', 'Shipping street is required').exists(),
  body('payload.shipping.town_city', 'Shipping city is required').exists(),
  body('payload.shipping.county_state', 'Shipping state is required').exists(),
  body('payload.shipping.postal_zip_code', 'Shipping zip code is required').exists(),
  body('payload.shipping.name', 'Shipping name is required').exists(),
  body('payload.shipping.country', 'Shipping country is required').exists(),
  body('payload.order.line_items', 'Minimum one line item is required').exists(),
  body('payload.transactions', 'Minimum one transaction is required').exists(),
], async (req, res, next) => {
  const errors = validationResult(req);

  console.log('=req.body =====================');
  console.log(JSON.stringify(req.body));
  console.log('===============================');

  // Extract the signature
  const { signature } = req.body;
  delete req.body.signature;

  // Verify the signature
  const expectedSignature = crypto.createHmac('sha256', signingKey)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (await expectedSignature !== signature) {
    res.status(400).json({
      message: 'Error: Signature mismatch.',
    });
  }

  // Validate the request
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Error: There was an error with the data provided.',
      body: errors.array()
    });
  }

  // Try the transformation and sync
  try{
    await orderController.create_order(req, res);
  }
  catch(err){
    res.json({
      message: 'Error: An issue has occured',
      body: err.message
    });
  }
});

app.use(bodyParser.json());
app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);
