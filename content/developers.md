---
title: Developers
metaDescription: >-
  Get up and running with our API and other tools and start developing your
  Truust integration.
---

> Get up and running with our API and other tools and start developing your Truust integration.

---

## Quick Start

### Getting API Keys

There are several different identifiers associated with your Truust account. Here are some important ones you'll need to know.

The public and secret keys together make up your account's API keys. Each account associated with Truust will have their own set of API keys, which they can change or rotate at any time for added security. Because this affects your integration, it should be done with caution.

<div class="alert alert-warning">

**IMPORTANT**

Sandbox API keys are different from those in the production environment, so they must be updated in your code by your developers when switching between environments. More information about switching environments is available in our developer docs.

</div>

#### Public key

This is your account-specific public identifier. Each account associated with Truust will have its public key.

To find your public key:

- Log into either the production Dashboard or the sandbox Dashboard, depending on which environment you are working in
- Click on the "Accounts Settings" button from your "Accounts" page list
- Click the "API Developers" tab from the top menu
- Scroll to the API Keys section and you will see the "Public Key" value

#### Secret key

This is your account secret identifier. Each account associated with Truust will have its secret key. Your secret key should not be shared outside the use of an API call – even with us.

To find your secret key:

- Log into either the production Dashboard or the sandbox Dashboard, depending on which environment you are working in
- Click on the "Accounts Settings" button from your "Accounts" page list
- Click the "API Developers" tab from the top menu
- Scroll to the API Keys section and you will see an empty "Secret Key" field
- Click the "Reveal" button located next to the Secret Key field

Your secret key will be revealed in the Secret Key field on the same page.

### Environments

The environment specifies where requests via the API should be directed – sandbox or production. Because you have a different set of API keys for each environment, you'll need to update your code depending on which environment you're working in.

There are both production and sandbox environments for the API. The URL endpoints will be:

- https://api-sandbox.truust.io/ - Testing environment
- https://api.truust.io/ - Live production environment

## Webhooks

Truust can send webhook events that **notify your application any time an event happens on your account**. This is especially useful for events that are not triggered by a direct API request, like order status change and many user actions. This mechanism is also useful for services that are not directly responsible for making an API request, but still, need to receive the response from that request.

You can register webhook URLs and the attached event and we will notify you any time that event happens in your account. When the event occurs we will create a request containing **all the relevant information about what just happened**, via an HTTP `POST` request, to any endpoint URLs that you have defined in your account´s Webhooks settings.

Webhooks are necessary only for behind-the-scenes transactions. Most requests (e.g., creating links) generate results that are reported synchronously to your code. These do not require webhooks for verification.

To configure a webhook, you'll need to:

1. Create a webhook destination URL on your server
2. Create a new webhook in the Dashboard by entering your webhook destination URL and selecting at least one type of event for the webhook to fire on
3. Set up your server to parse incoming webhooks
4. Test your webhook handling code

### Notifications

Here is a complete list with all the available notifications we will trigger for your account:

- `Order Published` - The order has been successfully paid
- `Order Failed` - There has been an error completing the payment
- `Order Accepted` - The order has been accepted by the seller or automatically settled
- `Order Rejected` - The order has been rejected by the seller
- `Order Cancelled` - The order has been canceled for any reason
- `Payout Created` - The payout associated with the order, has been created and we have the information needed to proceed with the payout
- `Order Released` - The order has been released and we have transferred the funds to the assigned payout account

### Registering the Webhook Endpoint

To create a webhook:

1. Log into the Dashboard corresponding to the environment you want to setup
2. Click on the Webhooks option on the side-menu
3. Click the Create New Webhook button
4. Provide your destination URL and your selected notification
5. Click the Create Webhook button

When adding a webhook in the Dashboard, you'll need to provide a destination URL using a valid HTTPS path. This URL will receive all webhook notifications as POST requests and must be a publicly accessible URL on your site

You can create multiple webhook destination URLs to route certain webhook notifications to specific endpoints.

## API Reference

If you need an extensive integration and apply your own rules, you can access our services via API. To review our technical API Reference, visit the following link:

> <https://documenter.getpostman.com/view/4961785/UV5f6tDm>

Our technical team is here to help. If you are a company with more complex technical needs, contact us at <mailto:hello@truust.io>.

## Plugins and Connectors

### Mirakl for marketplaces

Our Truust connector for Mirakl is the only one in the market that allows the marketplace to (1) work with any payment gateway, (2) provide an independent accounting for the funding account.

The platform connects directly to its own online payment gateway to execute the shopping cart pay-in to the funding account. The connector monitors Mirakl activity fetching everything from Sellers, Orders and Vouchers. It checks if the pay-in transaction has been correctly split among Fees and Sellers balance. Only then, Truust executes pay-outs to Sellers' IBAN and settles the platform fee. Our technology runs its own ledger where each Seller balance is managed by a Truust wallet.

### WooCommerce for ecommerce

Our WordPress plugin for WooCommerce is available to download for free at the following GitHub repository: [https://github.com/truust-io/woocommerce-truust](https://github.com/truust-io/woocommerce-truust)
