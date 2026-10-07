---
title: 'Stripe Authorization: Virtual Cards'
---

> Issue virtual cards against a customer wallet and authorise card payments in real time. Cards are issued through Stripe Issuing with credentials configured per Account; every payment attempt reaches Truust as a synchronous webhook, is approved or declined against the wallet balance, and is recorded as an order tagged with the `Authorization` category.

---

## Overview

Stripe Authorization turns a customer wallet into a spendable balance: the customer gets a virtual card, and every purchase is authorised in real time against the funds held in that wallet.

The flow has two halves:

- **Issuing** — you create a cardholder, a wallet and a virtual card through the API. The card details (PAN, CVC, expiry) are never stored by Truust; they are revealed directly in the browser through Stripe.js.
- **Authorising** — when the cardholder pays, Stripe calls Truust within a **2 second deadline**. Truust checks the available balance and answers approve or decline. Money only moves when the payment is later captured.

This feature is only available on accounts whose platform runs in **BaaS mode**. On any other platform the endpoints return `404`.

The issuing currency is fixed to **EUR**. A wallet in any other currency is rejected.

---

## Setup

Credentials are configured **per Account**, not per platform, so different Accounts can issue against different Stripe accounts. In the Dashboard: **Source → Edit → Add Other Gateway → Stripe Authorization**.

| Field | Description |
|---|---|
| `secret` | Stripe secret or restricted key (`sk_` / `rk_`). Used for every server-side call. |
| `publishable` | Stripe publishable key (`pk_`). Sent to the browser so Stripe.js can reveal the card details. |
| `webhook_secret` | Signing secret of the Stripe webhook endpoint (`whsec_`). Accepts several separated by commas. |

If an Account has no Stripe Authorization gateway, every operation fails with `422` and the message *"Stripe Authorization is not configured for this account"*. There is no fallback to a global configuration.

<Note>
Stripe Issuing uses two webhook endpoints — the real-time authorization one and the asynchronous events one — and each has its own signing secret. Put both in `webhook_secret`, separated by commas.
</Note>

---

## How It Works

### 1. The customer becomes a cardholder

A customer created with `type: "STRIPE"` is registered as a Stripe cardholder as soon as it is created. This requires a complete KYC block — see [Cardholder requirements](#cardholder-requirements). The resulting cardholder id (`ich_...`) is stored in `metadata.stripe_cardholder_id`.

### 2. A wallet funds the card

Each card is backed by exactly one EUR wallet. The wallet balance is the spendable limit of the card: there is no credit line, no overdraft.

### 3. The card is issued

`POST /2.0/customers/{uuid}/cards` with a `wallet_id` issues a virtual card. The response never contains the PAN — only the last four digits in `alias` and the Stripe card id in `gateway_reference_id`.

### 4. Every payment attempt is authorised in real time

When the cardholder pays, Stripe sends `issuing_authorization.request` and waits up to **2 seconds** for the answer. Truust:

1. Resolves the card and rejects it if it is unknown or inactive.
2. Takes a lock on the wallet, so two simultaneous authorisations cannot spend the same money.
3. Computes the **available balance**: cached wallet balance minus the amount already held by live authorisations.
4. Answers `approved: true` if the available balance covers the amount, `false` otherwise.
5. Records the attempt as an order and a payin — **declines included**.

Approving does **not** move money. It only reserves it: the amount stops counting towards the available balance until the authorisation is captured or reversed.

### 5. Capture moves the money

Stripe sends `issuing_transaction.created` when the merchant captures, usually seconds to days later. Only then is the amount transferred from the customer wallet to the Account wallet, and a transaction is recorded.

---

## Cardholder Requirements

Stripe requires a full identity for the cardholder. A customer of type `STRIPE` cannot be created without these fields:

| Field | Location |
|---|---|
| First and last name | `name` (split on the first space) |
| Email | `email` |
| Phone | `prefix` + `phone` |
| Date of birth | `metadata.kyc.date_birth` |
| Street | `metadata.kyc.street_residence` |
| City | `metadata.kyc.city_residence` |
| Postal code | `metadata.kyc.zip_residence` |
| Country | `metadata.kyc.country_residence` (ISO 3166-1 alpha-2) |

If any is missing the request fails with `422` and lists exactly what is missing:

```json
{
  "message": "Missing required KYC fields",
  "errors": { "kyc": ["metadata.kyc.date_birth", "metadata.kyc.city_residence"] }
}
```

<Warning>
Stripe rejects cardholder names containing digits or special characters. `Test User 01` fails; `Test User` works.
</Warning>

---

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/2.0/customers` | Create the customer with `type: "STRIPE"`. Registers the cardholder. |
| `POST` | `/2.0/wallets` | Create the EUR wallet that funds the card. |
| `POST` | `/2.0/customers/{uuid}/cards` | Issue the virtual card against a wallet. |
| `GET` | `/2.0/cards/{uuid}` | Card details. With `?nonce=` also returns an ephemeral key. |
| `DELETE` | `/2.0/cards/{uuid}` | Cancel the card in Stripe. Irreversible. |

---

## Issuing a Card

```bash
curl -X POST {{endpoint}}/2.0/customers/{customer_uuid}/cards \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "payin_type": "STRIPE", "wallet_id": 7485 }'
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `payin_type` | string | Yes | `STRIPE`. |
| `wallet_id` | integer | Yes | ID of the wallet that funds the card. Must belong to the customer and be in EUR. |

Response:

```json
{
  "id": 3052,
  "uuid": "keGMJ3",
  "self": "/2.0/cards/keGMJ3",
  "type": "VISA",
  "cardholder": "Sofia Navarro",
  "alias": "0336",
  "expiration": "07/29",
  "confirmed": true,
  "payin_type": "STRIPE",
  "gateway_reference_id": "ic_1U1KFWF1ZOMFWjpmTzsLjdfX",
  "connections": {
    "customer": "/2.0/customers/wgx81e",
    "wallet": "/2.0/wallets/wRe8bN"
  }
}
```

| Field | Description |
|---|---|
| `alias` | Last four digits of the PAN. The full number is never returned. |
| `confirmed` | `true` while the card is active, `false` once cancelled. |
| `gateway_reference_id` | Card id in Stripe (`ic_...`). Needed by Stripe.js to reveal the details. |
| `connections.wallet` | Only present on issued cards. Its absence means the card is a tokenized one. |

---

## Revealing Card Details

The PAN and CVC never travel through Truust servers. They are rendered by Stripe.js inside secure iframes, and unlocking them takes a nonce generated in the browser plus an ephemeral key obtained from the API:

```js
// 1. In the browser, with the publishable key of the Account
const stripe = Stripe(publishableKey);
const { nonce } = await stripe.createEphemeralKeyNonce({ issuingCard: gatewayReferenceId });

// 2. Exchange the nonce for an ephemeral key
const res  = await fetch(`/2.0/cards/${cardUuid}?nonce=${nonce}`, { headers });
const card = await res.json();

// 3. Mount the Issuing Elements
const elements = stripe.elements();
const common = {
  issuingCard: gatewayReferenceId,
  nonce,
  ephemeralKeySecret: card.ephemeral_key
};
elements.create('issuingCardNumberDisplay', common).mount('#pan');
elements.create('issuingCardExpiryDisplay', common).mount('#exp');
elements.create('issuingCardCvcDisplay',    common).mount('#cvc');
```

`GET /2.0/cards/{uuid}?nonce=` adds two fields to the response:

| Field | Description |
|---|---|
| `ephemeral_key` | Short-lived secret consumed by Stripe.js. Single use. |
| `expires_at` | Expiry, as a Unix timestamp. |

The nonce is single-use and tied to that browser session: an ephemeral key requested with a stale nonce is useless.

---

## The Authorization Webhook

Point both Stripe Issuing webhook endpoints at:

```
POST {{endpoint}}/2.0/stripe/issuing/webhook
```

The signature is verified against every `webhook_secret` configured across Accounts, so a single URL serves all of them. An unsigned or unrecognised request gets `400`.

| Event | Handling |
|---|---|
| `issuing_authorization.request` | Synchronous decision. Answers `{"approved": true\|false}` within the 2s deadline. Creates the order and payin. |
| `issuing_transaction.created` | Capture. Moves the money and confirms the payin. Ignored for non-capture types. |
| `issuing_authorization.updated` | When `status: "reversed"`, releases the hold. |
| `issuing_card.updated` | Syncs the card status into `confirmed`. |
| `issuing_cardholder.updated` | Acknowledged, no state stored. |

Everything is idempotent on the Stripe authorisation id, so a retried event never duplicates an order, a payin or a transfer.

---

## Orders and Payins

Every authorisation attempt produces a visible order, so declines are auditable too.

**The `Authorization` category** is what separates these orders from ordinary ones. The Dashboard uses it to split the two sections: `/authorizations` lists the orders that carry it, `/orders` the ones that do not. The same rule applies to their payins.

The order uses the regular lifecycle statuses:

| Moment | Order status | Payin status | Money |
|---|---|---|---|
| Authorised | `PENDING_RELEASE` | `AUTHORIZED` | Held, not moved |
| Captured | `RELEASED` | `CONFIRMED` | Moved to the Account wallet |
| Reversed before capture | `CANCELLED` | `DENIED` | Hold released |
| Declined | `FAILURE` | `DENIED` | Never touched |

Order fields worth knowing:

| Field | Value |
|---|---|
| `name` | Merchant name, from `merchant_data.name`. |
| `trustee` | The cardholder. |
| `settlor` | The Account (auto-settled). |
| `metadata.merchant_data` | Merchant block as sent by Stripe. |
| `metadata.authorization_id` | Stripe authorisation id. |

And on the payin:

| Field | Value |
|---|---|
| `type` / `subtype` | `STRIPE` / `ISSUING`. |
| `gateway_reference_id` | Stripe authorisation id (`iauth_...`). |
| `reference_id` | Ledger transfer id. Empty until capture, since nothing moved before that. |
| `reference_data` | The complete authorisation payload from Stripe. |

### Merchant data

`merchant_data` describes where the card was used, and is stored verbatim:

| Field | Example |
|---|---|
| `name` | `Decathlon` |
| `category` | `sporting_goods_stores` |
| `category_code` | `5941` — the [MCC](https://stripe.com/docs/issuing/categories) |
| `city`, `country`, `postal_code` | `Barcelona`, `ES`, `08018` |
| `network_id`, `terminal_id` | Merchant and terminal identifiers |

---

## Available Balance

The decision is not taken against the raw wallet balance but against:

```
available = wallet balance − sum of live authorisations
```

A live authorisation is a payin in `AUTHORIZED` state on that wallet. A wallet holding 19.35 € with a 5.00 € authorisation awaiting capture will decline anything above 14.35 €.

The wallet balance is cached and refreshed from the ledger when it is older than **5 seconds**, which keeps the decision inside the 2s deadline without serving a stale figure.

<Warning>
An approved authorisation that is never captured keeps its amount on hold indefinitely. Stripe normally sends a reversal when the authorisation expires, which releases it automatically — but nothing on the Truust side expires holds on its own.
</Warning>

---

## In the Dashboard

| Section | Contents |
|---|---|
| **BaaS → Issued Cards** (customer) | Every issued card: UUID, ledger wallet, balance, currency, type, masked PAN, brand, and a button to reveal the details. |
| **Wallets → Card tab** | The same data for the card backing that wallet. |
| **Authorizations** | The orders carrying the `Authorization` category. The last column links straight to their payins. |
| **Authorizations → Payins** | Their payins, with the full Stripe payload and the merchant block in the details modal. |

Issued cards are deliberately kept out of the customer's **Cards** tab, which only lists tokenized cards.

---

## Testing

A full run, from an empty Account to a captured payment.

### 1. Configure the gateway

**Source → Edit → Add Other Gateway → Stripe Authorization**, with the keys of your Stripe **test** account. Use the Issuing test keys, not the live ones.

### 2. Point the webhooks at your environment

In the Stripe Dashboard, create the two Issuing endpoints (real-time authorizations and events) against `/2.0/stripe/issuing/webhook`, and copy both signing secrets into the gateway, comma-separated.

Locally, the Stripe CLI does the same job:

```bash
stripe listen --forward-to localhost/2.0/stripe/issuing/webhook
```

It prints a `whsec_...` — add it to the gateway too.

### 3. Create the cardholder

```bash
curl -X POST {{endpoint}}/2.0/customers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sofia Navarro",
    "email": "sofia.navarro@example.com",
    "prefix": "+34",
    "phone": "655307711",
    "type": "STRIPE",
    "metadata": {
      "kyc": {
        "date_birth": "1991-11-02",
        "street_residence": "Passeig de Gracia 55",
        "city_residence": "Barcelona",
        "zip_residence": "08007",
        "country_residence": "ES"
      }
    }
  }'
```

Check that the response carries `metadata.stripe_cardholder_id`. If it does not, the cardholder was not registered.

### 4. Create the wallet and issue the card

```bash
curl -X POST {{endpoint}}/2.0/wallets \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "customer_type": "user", "customer_id": 114763, "currency": "EUR" }'

curl -X POST {{endpoint}}/2.0/customers/{customer_uuid}/cards \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "payin_type": "STRIPE", "wallet_id": {wallet_id} }'
```

Both `customer_id` and `wallet_id` are numeric ids, as in every `POST`; UUIDs are only used in URLs.

### 5. Fund the wallet

Move funds into the wallet and confirm the balance is visible on **Wallets** before going further. An unfunded wallet declines everything, which looks like a broken integration but is the correct answer.

### 6. Trigger an authorisation

From the Stripe Dashboard, open the card under **Issuing → Cards** and use **Create test purchase**, or with the CLI:

```bash
stripe issuing authorizations create --amount 2490 --card ic_xxx
```

Expected: Truust answers `{"approved": true}`, and **Authorizations** shows a new order named after the merchant, in `PENDING_RELEASE`. The wallet balance has **not** changed yet — the amount is on hold.

### 7. Capture it

```bash
stripe issuing authorizations capture iauth_xxx
```

Expected: the order moves to `RELEASED`, the payin to `CONFIRMED` with a `reference_id`, the customer wallet drops by the amount and the Account wallet rises by the same figure.

### 8. Check the edge cases

| Case | How | Expected |
|---|---|---|
| Insufficient funds | Authorise above the balance | `{"approved": false}`, order in `FAILURE`, no money moved |
| Reversal | `stripe issuing authorizations reverse iauth_xxx` | Order in `CANCELLED`, hold released |
| Uncaptured hold | Authorise and stop | Order stays in `PENDING_RELEASE`, amount still discounted from the available balance |
| Cancelled card | `DELETE /2.0/cards/{uuid}`, then authorise | `{"approved": false}` |

### 9. Verify the card details

Open **BaaS → Issued Cards** and use *View card data*. The PAN, expiry and CVC must render inside the card. If they do not, the usual cause is a `publishable` key that does not belong to the same Stripe account as the `secret`.

---

## Notes

- Issuing is EUR only. A wallet in another currency is rejected when the card is issued.
- One card per wallet: issuing a second card from the Dashboard creates a new wallet for it.
- Declines create an order too. This is intentional — a payment attempt that failed for lack of funds is auditable.
- Approving does not move money; only capture does. Reconcile against the ledger transfer, not against the authorisation.
- `reference_data` holds the raw Stripe payload, whose shape belongs to Stripe. Do not build logic on top of its keys.
- Cancelling a card cannot be undone. Issue a new one instead.
- See the [Create customer endpoint](/api-reference/create-customer), [Create wallet endpoint](/api-reference/create-wallet) and [Get card endpoint](/api-reference/get-card) for the full request schemas.
