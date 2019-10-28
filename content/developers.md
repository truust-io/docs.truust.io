---
title: Developers
metaDescription: >-
  Get up and running with our API and other tools and start developing your
  Truust integration.
---
> Get up and running with our API and other tools and start developing your Truust integration.

- - -

## Quick Start

### Getting API Keys

There are several different identifiers associated with your Truust account. Here are some important ones you'll need to know.

The public and secret keys together make up your account's API keys. Each account associated with Truust will have their own set of API keys, which they can change or rotate at any time for added security. Because this affects your integration, it should be done with caution.

<div class="alert alert-warning">

**IMPORTANT**

Sandbox API keys are different from those in the production environment, so they must be updated in your code by your developers when switching between environments. More information about switching environments is available in our developer docs.

</div>

#### Public key

This is your account specific public identifier. Each account associated with Truust will have their own public key.

To find your public key:

- Log into either the production Dashboard or the sandbox Dashboard, depending on which environment you are working in
- Click on the "Accounts Settings" button from your "Accounts" page list
- Click the "API Developers" tab from the top menu
- Scroll to the API Keys section and you will see the "Public Key" value

#### Secret key

This is your account secret identifier. Each account associated with Truust will have their own secret key. Your secret key should not be shared outside the use of an API call – even with us.

To find your secret key:

- Log into either the production Dashboard or the sandbox Dashboard, depending on which environment you are working in
- Click on the "Accounts Settings" button from your "Accounts" page list
- Click the "API Developers" tab from the top menu
- Scroll to the API Keys section and you will see an empty "Secret Key" field
- Click the "Reveal" button located next to the Secret Key field

Your secret key will be revealed in the Secret Key field on the same page.

### Environments

The environment specifies where requests via the API should be directed – sandbox or production. Because you have a different set of API keys for each environment, you'll need to update your code depending on which environment you're working in.

There are both production and sandbox environments for the Control Panel and the API.



## Webhooks

Truust can send webhook events that **notify your application any time an event happens on your account**. This is especially useful for events that are not triggered by a direct API request, like order status change and many user actions. This mechanism is also useful for services that are not directly responsible for making an API request, but still need to receive the response from that request.

You can register webhook URLs and the attached event and we will notify you any time that event happens in your account. When the event occurs we will create a request containing **all the relevant information about what just happened**, via an HTTP `POST` request, to any endpoint URLs that you have defined in your account´s Webhooks settings.

Webhooks are necessary only for behind-the-scenes transactions. Most requests (e.g., creating links) generate results that are reported synchronously to your code. These do not require webhooks for verification.

### Events

Here is a complete list with all the available events we will trigger for your account:

* `Order Published`
* `Order Failed`
* `Order Accepted`
* `Order Rejected`
* `Order Cancelled`
* `Payout Created`
* `Order Released`

### Registering the Webhook Endpoint

### Webhook Logs

## API Reference

If you need an extensive integration and apply your own rules, you can access our services via API. To review our technical API Reference, visit the following link:

> <https://dashboard.truust.io/documentation/api-reference/>

Our technical team is here to help. If you are a company with more complex technical needs, contact us at <mailto:hello@truust.io>.
