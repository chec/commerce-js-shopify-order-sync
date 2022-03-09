const axios = require('axios');

exports.create_order = (req, res) => {
    let data = req.body.payload;

    const order = {
      fulfillment_status: null,
      send_receipt: true,
      send_fulfillment_receipt: true,
      total_tax: data.order.tax.amount.raw,
      currency: data.currency.code,
      customer: {
        first_name: data.customer.firstname,
        last_name: data.customer.lastname,
        email: data.customer.email,
      },
      shipping_address: {
        address1: data.shipping.street,
        address2: data.shipping.street_2,
        city: data.shipping.town_city,
        province: data.shipping.county_state,
        zip: data.shipping.postal_zip_code,
        first_name: data.shipping.name.split(' ').slice(0, -1).join(' '),
        last_name: data.shipping.name.split(' ').slice(-1).join(' '),
        country: data.shipping.country,
      },
      shipping_lines: [
        {
          price: data.order.shipping.price.formatted,
          title: data.order.shipping.description,
        },
      ],
      line_items: [],
      transactions: [],
      source_name: "commercejs",
      note: "Synced from Commerce.js",
    };

    Object.keys(data.order.line_items).forEach(function (item) {
      order.line_items.push({
        title: data.order.line_items[item].product_name,
        price: data.order.line_items[item].price.raw,
        sku: data.order.line_items[item].sku,
        grams: 0, //Need to pass form Meta Data
        quantity: data.order.line_items[item].quantity,
      });
    });

    Object.keys(data.transactions).forEach(function (item) {
      order.transactions.push({
        kind: 'sale',
        status: 'success',
        amount: data.transactions[item].amount.raw,
        authorization: data.transactions[item].gateway_transaction_id,
      });
    });

    console.log("= Shopify Order Sanitized ===========");
    console.log(order);
    console.log("=====================================");

    axios.post(`https://${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_API_PASSWORD}@${process.env.SHOPIFY_DOMAIN}/admin/api/2020-01/orders.json`, {
      order: order,
    })
    .then((response) => {
      console.log("= Shopify: Success ================");
      console.log(JSON.stringify(response.data));
      console.log("===================================");
      res.status(200).json({
        message: `Success: Order has been successfully synced to ${process.env.SHOPIFY_DOMAIN}`,
        body: response.data
      });
    })
    .catch((err) => {
      console.log("= Shopify: Error ==================");
      console.log(err);
      console.log("===================================");
      res.json({
        message: `Error: An issue connecting with Shopify store ${process.env.SHOPIFY_DOMAIN}`,
        body: err.message
      });
    });
};
