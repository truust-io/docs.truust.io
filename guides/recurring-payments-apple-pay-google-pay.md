---
title: 'Recurring Payments with Apple Pay and Google Pay'
---

> Set up recurring payments using Apple Pay and Google Pay as the payment method through the Truust API.

---

## Overview

This guide walks you through the full integration to accept a first payment via Apple Pay or Google Pay and then charge the customer automatically on a recurring basis, without requiring further interaction.

The flow consists of:

1. Creating an initial order with recurring metadata
2. Creating a payin with Apple Pay or Google Pay
3. Displaying the payment button to the customer
4. Handling the payment confirmation
5. Retrieving the subscription identifier and card token
6. Charging subsequent recurring payments

## Prerequisites

- A Truust account with an active Redsys gateway that supports Apple Pay and/or Google Pay.
- Apple Pay and/or Google Pay enabled in your Truust account settings.
- A valid API token (see [Authentication](/developers)).

---

## Step 1: Create the Initial Order

Create an order using `POST /2.0/orders` with the recurring metadata fields:

```bash
curl -X POST {{endpoint}}/2.0/orders \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -d buyer_id={buyer_id} \
  -d auto_settle=1 \
  -d name="Monthly Subscription" \
  -d value=9.99 \
  -d "metadata[recurring_type]=cof" \
  -d "metadata[recurring_sca]=mit"
```

| Parameter | Required | Description |
|---|---|---|
| `buyer_id` | Yes | The customer ID of the buyer |
| `auto_settle` | Yes | Must be `1` |
| `name` | Yes | Order name (max 120 chars) |
| `value` | Yes | Amount to charge |
| `metadata[recurring_type]` | Yes | Set to `cof` (Credential on File) |
| `metadata[recurring_sca]` | Yes | Set to `mit` (Merchant Initiated Transaction) |

<Note>
The `recurring_type` and `recurring_sca` metadata fields tell the payment gateway that this is the initial transaction of a recurring series and that future charges will be merchant-initiated.
</Note>

---

## Step 2: Create the Payin

Create a payin using `POST /2.0/payins` with the Apple Pay or Google Pay type:

```bash
curl -X POST {{endpoint}}/2.0/payins \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -d order_id={order_id} \
  -d type=REDSYS_APPLE_PAY \
  -d save_card=1
```

| Parameter | Required | Description |
|---|---|---|
| `order_id` | Yes | The order ID from Step 1 |
| `type` | Yes | `REDSYS_APPLE_PAY` or `REDSYS_GOOGLE_PAY` |
| `save_card` | Yes | Must be `1` to tokenize the card for future charges |

The response will include a `direct_link` that you will use in the next step to display the payment button to the customer.

```json
{
  "data": {
    "id": 20212799,
    "self": "/2.0/payins/20212799",
    "type": "REDSYS_APPLE_PAY",
    "status": "CREATED",
    "subscription_id": "S",
    "direct_link": "https://{{endpoint}}/direct/ydq9GxJA208W1mgpw...",
    "connections": {
      "order": "/2.0/orders/{order_id}",
      "card": "/2.0/cards/{card_hash}"
    }
  }
}
```

---

## Step 3: Display the Payment Button

Load the `direct_link` from the previous step in an iframe or redirect the customer to it. Truust will render the Apple Pay or Google Pay button automatically.

If the customer's device does not support the selected payment method, Truust will display a message indicating that the payment method is not available.

### Detecting Apple Pay Availability (Optional)

If you want to conditionally show the Apple Pay option in your UI before loading the iframe, you can check for device compatibility on web:

```javascript
if (window.ApplePaySession) {
  var canMakePayments = ApplePaySession.canMakePayments();
  if (canMakePayments) {
    // Apple Pay is available — show the option
  }
} else {
  // Apple Pay is not available on this device
}
```

<Note>
Google Pay availability depends on the device and browser. On Android devices with Chrome, Google Pay is generally available. The Truust checkout will handle the detection automatically when using `REDSYS_GOOGLE_PAY`.
</Note>

Once the customer taps the payment button, the Apple Pay or Google Pay payment sheet will be presented:

![Apple Pay Checkout](/assets/apple-pay-checkout.png)

After the customer authorizes the payment, they will be redirected to the `buyer_confirmed_url` or `buyer_denied_url` that you set when creating the order.

---

## Step 4: Handle the Payment Confirmation

When the payment is completed, Truust will send a webhook to your configured endpoint. You can use either of these events:

- **`PayinConfirmed`**: Triggered when the payin is confirmed.
- **`EscrowPublished`**: Triggered when the order is published (payment completed). This event includes the full order and payin details.

### EscrowPublished Webhook Payload

```json
{
  "escrow": {
    "id": "7654321",
    "name": "Order Name",
    "amount": 9.99,
    "currency": "EUR",
    "status": "PUBLISHED",
    "metadata": { ... },
    "auto_settled": "1"
  },
  "platform": "your-platform",
  "payin": {
    "id": 1234567,
    "reference_id": "XXXXXXXXX",
    "escrow_id": 7654321,
    "card_id": 1234567,
    "type": "REDSYS_APPLE_PAY",
    "status": "CONFIRMED",
    "save_card": 1,
    "provider": {
      "Ds_Amount": "999",
      "Ds_Currency": "978",
      "Ds_Order": "XXXXXXXXX",
      "Ds_MerchantCode": "XXXXXXXXX",
      "Ds_Response": "0000",
      "Ds_AuthorisationCode": "XXXXXX",
      "Ds_SecurePayment": "1",
      "Ds_CardNumber": "407980******7842",
      "Ds_ExpiryDate": "3111",
      "Ds_Merchant_Identifier": "a1b2c3d4e5f6..."
    },
    "card": {
      "id": 1234567,
      "name": "407980******7842",
      "payin_type": "REDSYS_APPLE_PAY"
    }
  }
}
```

<Warning>
If you are currently subscribed to the `PayinEPGConfirmed` event, note that this event is **not triggered** for Apple Pay and Google Pay payins. You must use `PayinConfirmed` or `EscrowPublished` instead.
</Warning>

---

## Step 5: Retrieve the Subscription Identifier and Card

Once the first payment is confirmed, you need to store two values from the payin for future recurring charges:

### Subscription Identifier

Retrieve the `Ds_Merchant_Identifier` from the `provider` object of the confirmed payin. This value acts as the recurring subscription reference for Redsys.

You can obtain it from:
- The webhook payload (see Step 4)
- The API by calling `GET /2.0/payins/{payin_id}`

```json
{
  "data": {
    "id": 1234567,
    "type": "REDSYS_APPLE_PAY",
    "status": "CONFIRMED",
    "provider": {
      "Ds_Merchant_Identifier": "a1b2c3d4e5f6..."
    }
  }
}
```

### Card ID

Retrieve the `card_id` from the payin's `connections` or directly from the webhook payload. This is the tokenized card that will be used for subsequent charges.

```json
{
  "data": {
    "connections": {
      "card": "/2.0/cards/{card_hash}"
    }
  }
}
```

<Warning>
Make sure to store both the `Ds_Merchant_Identifier` and the `card_id` — you will need them to create recurring charges.
</Warning>

---

## Charging Recurring Payments

Once you have the `Ds_Merchant_Identifier` and `card_id` from the initial payment, you can charge the customer on a recurring basis without any further interaction from them.

### 1. Create a new Order with the recurring identifier

```bash
curl -X POST {{endpoint}}/2.0/orders \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -d buyer_id={buyer_id} \
  -d auto_settle=1 \
  -d name="Monthly Subscription - March 2026" \
  -d value=9.99 \
  -d "metadata[recurring_type]=cof" \
  -d "metadata[recurring_sca]=mit" \
  -d "metadata[recurring_id]={Ds_Merchant_Identifier}"
```

The key difference from the initial order is the `metadata[recurring_id]` parameter, which must contain the `Ds_Merchant_Identifier` value obtained in Step 5.

### 2. Create the Payin with the stored card

```bash
curl -X POST {{endpoint}}/2.0/payins \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -d order_id={order_id} \
  -d type=REDSYS_APPLE_PAY \
  -d card_id={card_id}
```

### 3. Execute the payment

Make a `POST` request to the `direct_link` returned by the payin to trigger the charge:

```bash
curl -X POST {direct_link}
```

Since the card is already tokenized and this is a merchant-initiated transaction, the payment will be processed automatically without requiring the customer to authenticate again.

<Note>
Use the same `type` (`REDSYS_APPLE_PAY` or `REDSYS_GOOGLE_PAY`) that was used in the initial payment.
</Note>
