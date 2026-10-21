---
title: 'Card Issuing: One API, Any Issuer'
---

> Issue payment cards to your customers through a single API, whatever issuer sits underneath. Truust is multi-tenant and issuer-agnostic: every Account chooses which issuer backs its cards, and the same calls create cards, fund them and track what is spent. This guide explains the common model; each issuer has its own guide for the details.

---

## Overview

Card issuing on Truust is built around one idea: **your integration should not depend on the issuer**. Stripe, CaixaBank or Mastercard each have their own APIs, file formats and rules. Truust absorbs those differences, so that issuing a card, topping it up or reading its movements looks the same no matter who issues it.

What changes from one issuer to another is a single parameter, the **card type** (`payin_type`):

| Card type | Issuer | Card | Status |
|---|---|---|---|
| `STRIPE` | Stripe Issuing | Virtual Visa card funded by a Truust wallet | Available |
| `M2P_ISSUING` | CaixaBank (TCR) | Prepaid card | In rollout |
| `ICCP` | Mastercard iCCP | B2B virtual card with a spending limit, drawing on a parent card | Coming soon |

Switching issuer, or running several of them in parallel for different Accounts, does not require changes in your integration beyond that value.

---

## The Pieces

| Piece | What it is |
|---|---|
| **Account** | Your company in Truust. It owns the issuer configuration and funds the cards from its own wallet. |
| **Customer** | The cardholder: the person or business the card is issued to. |
| **Wallet** | The balance behind a card. Every `STRIPE` and `M2P_ISSUING` card is backed by exactly one wallet. |
| **Parent card** | Only for `ICCP`: the card that holds the balance the virtual cards spend from. Its wallet is the one `ICCP` cards are issued against, so several of them can share it. |
| **Card** | The card record: its status, the last four digits and the id of the card at the issuer. Truust never stores the full card number. |
| **Issuer gateway** | The issuer credentials and programme data of the Account, configured once in the Dashboard under **Source → Edit → Add Other Gateway**. |

Issuer configuration lives **per Account**, not per platform. Two Accounts on the same platform can issue through different issuers, or through the same issuer with different programmes.

---

## The Common Contract

Every issuer follows the same three rules.

### 1. Cards are issued with one endpoint

First create the wallet that will back the card, then issue the card on it:

```bash
curl -X POST {{endpoint}}/2.0/wallets \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "customer_id": 23, "currency": "EUR", "type": "M2P_ISSUING" }'

curl -X POST {{endpoint}}/2.0/customers/{customer_uuid}/cards \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "payin_type": "M2P_ISSUING", "wallet_id": 51 }'
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `payin_type` | string | Yes | The card type: `STRIPE`, `M2P_ISSUING`, `ICCP`. |
| `wallet_id` | integer | Yes | Numeric id of the wallet that backs the card. Must belong to the customer. For `ICCP`, the wallet of the parent card. |

There are no issuer-specific endpoints. Optional fields that only make sense for one issuer (for instance cardholder data for CaixaBank) are documented in that issuer's guide and ignored by the rest.

### 2. The card tells you its status

| Field | Meaning |
|---|---|
| `confirmed` | `true` once the issuer has issued the card and it is active. `false` while it is pending or after it is cancelled. |
| `gateway_reference_id` | Id of the card at the issuer. Empty until the card is issued. |
| `alias` | Last four digits of the card number. |
| `connections.wallet` | The wallet backing the card. |

The wallet only carries the balance; everything about the card itself is on the card.

### 3. Money moves as regular orders

Loading balance onto a card, or taking it back, is an ordinary order with a `WALLET` payin and a `WALLET` payout:

| Movement | Payin from | Payout to |
|---|---|---|
| Top-up | Account wallet | Card wallet |
| Balance recovery | Card wallet | Account wallet |

You use the same orders, payins and payouts you already use for any other wallet-to-wallet movement, with the same webhooks and the same reporting.

---

## Who Authorises the Purchases

This is the one real difference between issuers, and it decides how fast things happen.

### Truust authorises — `STRIPE`

The wallet balance **is** the card balance. When the cardholder pays, the issuer asks Truust in real time, and Truust approves or declines against the available balance of the wallet. Card issuing and top-ups are immediate.

Every purchase attempt, declines included, is recorded as an order with the `Authorization` category, so you see each payment the moment it happens.

### The issuer authorises — `M2P_ISSUING`, `ICCP`

The spendable balance is held outside Truust, and every purchase is authorised there without asking Truust. The wallet carries the issuer as its `type` and **mirrors** that balance.

For `M2P_ISSUING`, operations that touch the card are **asynchronous**:

- A new card is returned with `confirmed: false` and becomes `confirmed: true` when the issuer confirms it.
- A top-up or recovery payout stays `IN_PROGRESS`, with the money held in the order, until the issuer confirms it. It then becomes `CONFIRMED`, or `DENIED` with the payin refunded to its origin.

For `ICCP`, issuing a virtual card is **immediate**: it only assigns a limit, so no money has to move. Balance is loaded and recovered on the parent card.

In both cases purchases reach Truust **after** they happen, when the issuer reports them, and are then reflected on the wallet. The wallet balance can therefore lag behind the real one until the next report.

Your integration does not need to poll the issuer or know how it communicates: listen to the usual card and payout webhooks, or read the resources, and act on their status.

### At a glance

| | `STRIPE` | `M2P_ISSUING` | `ICCP` |
|---|---|---|---|
| Who holds the balance | Truust (the wallet) | CaixaBank | The parent card |
| Who authorises purchases | Truust, in real time | CaixaBank | Mastercard checks the card limit, the parent card issuer checks the balance |
| Card issuing | Immediate | Asynchronous | Immediate |
| Top-ups | Immediate | Asynchronous | On the parent card |
| Purchases visible in Truust | Real time | After the issuer reports them | After the issuer reports them |
| Revealing the card number | Stripe secure elements in the browser | Activation code for the cardholder | Short-lived secure link |
| Card form | Virtual | Prepaid | Virtual, B2B, single or multi-use |

---

## The Issuers

### Stripe Issuing — `STRIPE`

Virtual Visa cards for consumers and businesses, issued in EUR. The cardholder needs a full identity (name, email, phone, date of birth and address). The card number and CVC are revealed in the browser through Stripe's own secure elements and never pass through Truust.

Full details: [Stripe Authorization](/guides/stripe-authorization).

### CaixaBank prepaid — `M2P_ISSUING`

Prepaid cards issued by CaixaBank. Cards are anonymous by default, with optional cardholder data. Each card has its own wallet, so a customer can hold as many cards as needed. Requests and answers are exchanged with CaixaBank in several processing windows a day.

Full details: [M2P Issuing](/guides/m2p-issuing).

### Mastercard iCCP — `ICCP`

**iCCP** (In Control for Commercial Payments) is a Mastercard solution for B2B payments, designed for companies that pay many suppliers — for example travel agencies paying hotels, airlines or wholesalers.

An `ICCP` card is a virtual card with a particularity: it always **hangs from a parent card**.

- **Parent card.** The company's corporate card. It is the only card that holds money: the company loads funds onto it.
- **`ICCP` cards.** Created against the parent card, one per payment or use case. They hold **no balance of their own**: each one has a **limit**, a spending cap that can be restricted by:

| Control | Example |
|---|---|
| Amount | Up to 1,200 € |
| Number of uses | Single use, for one booking |
| Validity | Valid until 15 October |
| Merchant | Only a given merchant or merchant category (MCC) |
| Currency | EUR only |

A purchase that breaks any of these controls is declined by Mastercard before it reaches the balance.

Issuing a virtual card moves no money. A purchase is authorised against the limit of the virtual card and charged to the balance of the parent card, and only what is actually spent leaves it. The unused limit of a virtual card never left the parent card, so it stays available to the company.

```
Parent card balance            10,000 €
Virtual A  limit 2,000 €
Virtual B  limit 1,500 €       → 6,500 € in limits, 0 € moved
Virtual C  limit 3,000 €

Purchase of 1,200 € with A     → parent card 8,800 €, A has 800 € of limit left
```

On Truust, `ICCP` follows the same contract as the other card types: cards are issued with `POST /customers/{uuid}/cards`, `payin_type: "ICCP"` and the `wallet_id` of the parent card, plus the controls. Balance is loaded onto the parent card with regular orders, and purchases are reported back as they are charged.

The full card number, expiry and CVC are generated by Mastercard and never pass through the Truust API. They are shown to the company through a short-lived secure link, in the same spirit as the Stripe secure elements. Once delivered, keeping them safe is the responsibility of whoever uses the card.

---

## Choosing an Issuer

| If you need… | Use |
|---|---|
| Instant issuing and real-time control of every purchase | `STRIPE` |
| Prepaid cards from a Spanish bank, anonymous or nominative | `M2P_ISSUING` |
| Single-use or capped virtual cards to pay suppliers, funded from one pool | `ICCP` |

The choice is made per Account when the issuer gateway is configured. Contact the Truust team to enable an issuer on your Account.

---

## Notes

- Always send numeric ids (`customer_id`, `wallet_id`) in request bodies; UUIDs are only used in URLs.
- One `STRIPE` or `M2P_ISSUING` card per wallet. Issuing another card means creating another wallet. `ICCP` cards are the exception: many can be issued against the wallet of the same parent card.
- A limit is not a balance. The sum of the limits of the `ICCP` cards can exceed the parent card balance; each purchase still needs enough balance on the parent card.
- Truust never stores or returns the full card number. Only the last four digits are exposed in `alias`.
- For issuer-authorised cards, treat `confirmed` and the payout status as the source of truth: an operation is done when the issuer has confirmed it, not when the API accepts it.
- Cancelling a card cannot be undone. Issue a new one instead.
- See the [Create wallet endpoint](/api-reference/create-wallet) and [Get card endpoint](/api-reference/get-card) for the full request schemas.
