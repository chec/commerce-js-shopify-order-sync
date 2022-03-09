# CommerceJS Shopify Orders Sync

A small Express.js app for syncing orders from Commerce.js into Shopify. Using the [webhooks functionality](https://commercejs.com/docs/guides/webhooks) triggered on `order.create`, an order will be created using the Shopify API. Simply set up a [Netlify account](https://app.netlify.com/), point your forked repo and enter the necessary credentials to hook up.

You can learn more about Commerce.js & Chec at https://commercejs.com.

## Setup Instructions
1. Set up a Netlify account with a fork of the repo. See the [Netlify docs](https://docs.netlify.com/configure-builds/repo-permissions-linking/) for more information.
2. [Create a webhook](https://dashboard.chec.io/settings/webhooks/add) in the dashboard with the event `order.create`, the URL of your Netlify app and make sure `active` is set.
3. Copy the signing key from your newly created webhook and add it to the Netlify enviroment variables along with your Shopify API credentials.
4. You can customize any [extra fields](https://commercejs.com/docs/api/#extra-fields) in a manner similar to the example if required, otherwise you can remove those lines.


## Local Project setup

```
npm install or yarn install
```

### Copy example env, add Shopify credentials and webhook signing key 
```
cp env.example .env
```

### Run dev server
```
npm run start or yarn start
```

Server will be listening on:

* `GET http://localhost:9000/.netlify/functions/api`: information response
* `POST http://localhost:9000/.netlify/functions/api/create`: webhook URL

For local development use [ngrok](https://ngrok.io) to expose your local server to the web.

## License

This project is licensed under [BSD-3-Clause](LICENSE.md).


## ⚠️ Note

### This repository is no longer maintained
However, we will accept issue reports and contributions for this repository. See the [contribute to the commerce community](https://commercejs.com/docs/community/contribute) page for more information on how to contribute to our open source projects. For update-to-date APIs, please check the latest version of the [API documentation](https://commercejs.com/docs/api/).
