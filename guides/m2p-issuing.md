---
title: 'M2P Issuing: Prepaid Cards'
---

> Issue prepaid cards through CaixaBank (TCR) for the customers of an Account. Each card is backed by its own `M2P_ISSUING` wallet. Issuance, top-ups and balance recovery are exchanged with CaixaBank in batch files, so every operation is asynchronous: the API accepts the request and the result arrives in the next processing window.

---

## Overview

Unlike [Stripe Authorization](/guides/stripe-authorization), the spendable balance of an M2P card is held by CaixaBank, not by Truust. CaixaBank authorises every purchase against its own balance; the Truust wallet mirrors that balance and is reconciled through files.

That changes how the card behaves:

- **Issuing** is asynchronous. The card is created as `confirmed: false` and becomes `confirmed: true` once CaixaBank confirms it in a processing window.
- **Funding** is not immediate. A top-up is a standard order whose payout stays `IN_PROGRESS` until CaixaBank confirms the operation.

This feature is only available on platforms with card issuing enabled. On any other platform `type: "M2P_ISSUING"` is rejected as an invalid type.

---

## Setup

The Account needs a **TCR** gateway with the CaixaBank programme data. In the Dashboard: **Source → Edit → Add Other Gateway → TCR**.

| Field | Description |
|---|---|
| `bin` | Card BIN. |
| `affinity` | Affinity code. |
| `colectivo` | Colectivo code. |
| `moneda` | Card currency (`978` = EUR). |
| `nif_cif_emisor` | Tax id of the issuer. |
| `peticionario` / `sub_peticionario` | Requester codes assigned by CaixaBank. |
| `origen_solicitud` | Request origin code. |
| `deposito_*` | Account where the card funds are deposited. |

---

## Issuing a Card

Issuing a card takes two calls: create the wallet that will back the card, then create the card on that wallet.

### 1. Create the card wallet

```bash
curl -X POST {{endpoint}}/2.0/wallets \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 23,
    "currency": "EUR",
    "type": "M2P_ISSUING",
    "metadata": { "external_id": "6abe77d7cf93d3def5a57296" }
  }'
```

Every call creates a new wallet, so a customer can hold as many cards as needed. `tag` and `metadata` are free for your own references.

### 2. Create the card

```bash
curl -X POST {{endpoint}}/2.0/customers/{customer_uuid}/cards \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "payin_type": "M2P_ISSUING", "wallet_id": 51 }'
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `payin_type` | string | Yes | `M2P_ISSUING`. |
| `wallet_id` | integer | Yes | ID of the `M2P_ISSUING` wallet created in step 1. Must belong to the customer. |
| `ficha_beneficiario` | object | No | Cardholder data. Cards are issued **anonymous** by default. Accepts `nombre`, `primer_apellido`, `segundo_apellido`, `nif`, `email`, `telefono`, `fecha_nacimiento`, `calle`, `numero`, `codigo_postal`, `localidad`. |
| `product_id` | string | No | Card product identifier. |
| `card_type` | string | No | Card type or programme code. |

Response:

```json
{
  "data": {
    "id": 812,
    "self": "/2.0/cards/keGMJ3",
    "uuid": "keGMJ3",
    "cardholder": "",
    "confirmed": false,
    "payin_type": "M2P_ISSUING",
    "gateway_reference_id": null,
    "activation_code": null,
    "product_id": null,
    "card_type": null,
    "connections": {
      "customer": "/2.0/customers/r41KwN",
      "wallet": "/2.0/wallets/b3l2bk"
    }
  }
}
```

Each wallet holds a single card: creating a second card on the same wallet returns `422` with *"This wallet already has a card issued"*. A wallet that is not `M2P_ISSUING`, or that belongs to another customer, returns `404`.

### 3. Wait for the issuing confirmation

The request is sent to CaixaBank in the next processing window. When CaixaBank confirms it, the card is updated:

| Field | Before | After |
|---|---|---|
| `confirmed` | `false` | `true` |
| `gateway_reference_id` | `null` | Card token assigned by CaixaBank. |
| `activation_code` | `null` | Activation code for the cardholder. |

Check the status with `GET /2.0/cards/{uuid}`. If CaixaBank rejects the request, the card stays `confirmed: false`.

---

## Top-ups and Balance Recovery

Funds move with the same orders, payins and payouts used for any wallet. Only cards with `confirmed: true` can be topped up; until then the operation waits.

- **Top-up:** order with the card customer as `buyer_id` and `seller_id`, `fee_value: 0` and `fee_percent: 0`. Payin `WALLET` from the Account wallet and payout `WALLET` to the card wallet.
- **Balance recovery:** order with `auto_settle: 1` and the card customer as `buyer_id`, with fees set to 0. Payin `WALLET` from the card wallet and payout `WALLET` to the Account wallet.

In both cases the payout stays `IN_PROGRESS`, with the funds held in the order, until CaixaBank confirms the operation. Then it becomes `CONFIRMED`. If CaixaBank rejects it, the payout becomes `DENIED` and the payin is refunded to the wallet it came from.

---

## Batch Files with CaixaBank (TCR)

Requests are grouped in a single file per processing window — issuing, top-ups and balance recoveries together — and the answer is imported once per window:

| Window | File sent | Answer imported |
|---|---|---|
| 9h | 08:45 | 11:00 |
| 13h | 12:45 | 15:00 |
| 15h | 14:45 | 17:00 |

<Note>
This section will be completed with the details of the TCR file exchange.
</Note>

---

## Sandbox

There is no connection with CaixaBank in sandbox: cards stay `confirmed: false` and top-ups stay `IN_PROGRESS`. The Truust team simulates the confirmations that CaixaBank sends in production so the full flow can be tested.
