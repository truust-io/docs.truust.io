---
title: "Worldpay Integration for eSimFLAG_MC"
---

> Accept payments through Worldpay (Hosted Payment Page) for the eSimFLAG_MC integration using the Truust API, with control over the order currency, the payment methods shown on the link, and the checkout language.

---

## Overview

This guide describes how to integrate **Worldpay** as a payment method for **eSimFLAG_MC** using the Truust API.

The flow is the standard order + payin flow:

1. Create an order with [`POST /2.0/orders`](https://docs.truust.io/api-reference/create-order), choosing the currency and the payment methods that will be offered.
2. Either share the `buyer_link` returned by the order (Truust renders the available payment methods), or create a payin explicitly with [`POST /2.0/payins`](https://docs.truust.io/api-reference/create-payin) using `type=WORLDPAY_HPP`.
3. Optionally set the checkout language with the `hl` parameter.

---

## 1. Create Order: Currency and Payment Methods

When you create an order with [`POST /2.0/orders`](https://docs.truust.io/api-reference/create-order) you can control the currency and which payment methods are offered on the resulting link.

### `currency`

Use the `currency` parameter to indicate the currency of the order. The supported values for this integration are:

| Value | Currency       |
| ----- | -------------- |
| `EUR` | Euro           |
| `USD` | US Dollar      |
| `GBP` | Pound Sterling |
| `MXN` | Mexican Peso   |

### `payin_types`

Use the `payin_types` parameter with an **array** of the payment methods that should appear on the link. Only the methods listed will be shown to the buyer.

For example, to offer Worldpay (Hosted Payment Page) and Apple Pay via Redsys:

```json
["WORLDPAY_HPP", "REDSYS_APPLE_PAY"]
```

### Example request

```bash
curl -X POST {{endpoint}}/2.0/orders \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_id": {buyer_id},
    "auto_settle": 1,
    "name": "eSIM Data Plan",
    "value": 19.99,
    "currency": "USD",
    "payin_types": ["WORLDPAY_HPP", "REDSYS_APPLE_PAY"]
  }'
```

| Parameter     | Required | Description                                                                              |
| ------------- | -------- | ---------------------------------------------------------------------------------------- |
| `name`        | Yes      | Order description or product name (max 120 chars)                                        |
| `value`       | Yes      | Order amount                                                                             |
| `currency`    | No       | Currency of the order: `EUR`, `USD`, `GBP` or `MXN`                                      |
| `payin_types` | No       | Array of payment methods shown on the link (e.g. `["WORLDPAY_HPP", "REDSYS_APPLE_PAY"]`) |

The response includes a `buyer_link` that you can share with the customer. Truust will render the payment methods listed in `payin_types`.

<Note>
If `payin_types` is omitted, all payment methods enabled for the account are shown. When you list `WORLDPAY_HPP`, Worldpay must be enabled for the account.
</Note>

---

## 2. Create Payin: Worldpay HPP

If, instead of relying on the order's `buyer_link`, you create the payin explicitly with [`POST /2.0/payins`](https://docs.truust.io/api-reference/create-payin), the `type` field must be set to `WORLDPAY_HPP`.

```bash
curl -X POST {{endpoint}}/2.0/payins \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": {order_id},
    "type": "WORLDPAY_HPP"
  }'
```

| Parameter  | Required | Description              |
| ---------- | -------- | ------------------------ |
| `order_id` | Yes      | The order ID from step 1 |
| `type`     | Yes      | Must be `WORLDPAY_HPP`   |

The response includes a `direct_link` that points directly to the Worldpay Hosted Payment Page. Redirect the buyer to it or load it in an iframe to complete the payment.

```json
{
  "data": {
    "id": 20212799,
    "type": "WORLDPAY_HPP",
    "status": "CREATED",
    "direct_link": "https://{{endpoint}}/direct/ydq9GxJA208W1mgpw...",
    "connections": {
      "order": "/2.0/orders/{order_id}"
    }
  }
}
```

---

## 3. Checkout Language

You can set the language of the checkout with the `hl` parameter. It accepts a standard language code (for example `es`, `en`, `fr`).

The `hl` parameter can be appended to **both** links:

- The **`buyer_link`** returned by [`POST /2.0/orders`](https://docs.truust.io/api-reference/create-order).
- The **`direct_link`** returned by [`POST /2.0/payins`](https://docs.truust.io/api-reference/create-payin).

### On the `buyer_link`

```
https://{{endpoint}}/AbC123...?hl=es
```

### On the `direct_link`

```
https://{{endpoint}}/direct/ydq9GxJA208W1mgpw...?hl=en
```

<Note>
If `hl` is not provided, the checkout falls back to the locale detected from the buyer's browser.
</Note>

---

## 4. FOREX

The FOREX integration is also available for Worldpay. The endpoint stays the same as for other providers — you only change the `type` parameter to `WORLDPAY` and pass the currency pair you want to convert:

```bash
curl -X GET "{{endpoint}}/2.0/forex/rates?type=WORLDPAY&sell_currency=EUR&buy_currency=USD" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

| Parameter | Required | Description |
|---|---|---|
| `type` | Yes | Set to `WORLDPAY` to request a Worldpay rate |
| `sell_currency` | Yes | Currency you sell (e.g. `EUR`) |
| `buy_currency` | Yes | Currency you buy (e.g. `USD`) |

<Note>
The endpoint is exposed in the sandbox environment, but Worldpay confirmed that their FOREX service only operates in production. In sandbox, a live Worldpay rate may therefore not be returned.
</Note>

Whenever a Worldpay rate is not available, Truust automatically falls back to its own internal rate. As a result, this endpoint **always returns a rate** — you never have to handle an empty response.
