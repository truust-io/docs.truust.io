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

### Environments

## Webhooks

Truust can send webhook events that **notify your application any time an event happens on your account**. This is especially useful for events that are not triggered by a direct API request, like order status change and many user actions. This mechanism is also useful for services that are not directly responsible for making an API request, but still need to receive the response from that request.

You can register webhook URLs and the attached event and we will notify you any time that event happens in your account. When the event occurs we will create a request containing **all the relevant information about what just happened**, via an HTTP `POST` request, to any endpoint URLs that you have defined in your account´s Webhooks settings.

Webhooks are necessary only for behind-the-scenes transactions. Most requests (e.g., creating links) generate results that are reported synchronously to your code. These do not require webhooks for verification.

### Events

Here is a complete list with all the available events we will trigger for your account:

- `Order Published`
- `Order Failed`
- `Order Accepted`
- `Order Rejected`
- `Order Cancelled`
- `Payout Created`
- `Order Released`

### Registering the Webhook Endpoint

### Webhook Logs

## API Reference

If you need an extensive integration and apply your own rules, you can access our services via API. To review our technical API Reference, visit the following link:

> [https://dashboard.truust.io/documentation/api-reference/](https://dashboard.truust.io/documentation/api-reference/)

Our technical team is here to help. If you are a company with more complex technical needs, contact us at [hello@truust.io](mailto:hello@truust.io).
