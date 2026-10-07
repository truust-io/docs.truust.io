---
title: 'M2P Issuing: Prepaid Cards'
---

> How prepaid cards issued by CaixaBank work on Truust: what each party does, how a card goes from requested to active, how balance moves on and off the card, and how requests and answers travel between Truust and CaixaBank in batch files.

---

## Overview

M2P Issuing lets a company (the **Account**) hand out prepaid cards to the people it works with (its **customers**). The cards are issued by **CaixaBank** through its card platform (**TCR**). Truust sits in the middle: it receives the requests through the API, sends them to CaixaBank and keeps the accounting of every card.

The key point is **where the money lives**:

- The balance that can be spent with the card is held by **CaixaBank**. CaixaBank authorises every purchase against that balance, without asking Truust.
- Each card has its own **wallet** in Truust, of type `M2P_ISSUING`. That wallet mirrors the card balance: it goes up when the card is topped up and down when balance is recovered or spent.

Because CaixaBank only exchanges information in **batch files**, every operation that touches the card is **asynchronous**: Truust accepts the request immediately and the result arrives in the next processing window.

This differs from [Stripe Authorization](/guides/stripe-authorization), where the wallet balance *is* the card balance and every purchase is authorised by Truust in real time.

| | Stripe Authorization | M2P Issuing |
|---|---|---|
| Who holds the balance | Truust (the wallet) | CaixaBank (the wallet mirrors it) |
| Who authorises purchases | Truust, in real time | CaixaBank |
| Card issuing | Immediate | Next processing window |
| Funding the card | Immediate | Next processing window |

---

## The Pieces

| Piece | What it is |
|---|---|
| **Account** | The company that issues the cards. Funds the cards from its own wallet. |
| **Customer** | The beneficiary of one or more cards. |
| **Card wallet** | A wallet of type `M2P_ISSUING`, one per card. Mirrors the card balance. |
| **Card** | The card record. `confirmed: false` while CaixaBank has not issued it; `confirmed: true` with the CaixaBank token in `gateway_reference_id` once issued. |
| **Custodial wallets** | Two internal wallets of the Account (*custodio pagos* and *custodio tarjetas*) that track how much of the safeguarded money has been moved to the cards at CaixaBank. |
| **TCR gateway** | The CaixaBank programme data of the Account (BIN, affinity, colectivo, deposit account…), configured in the Dashboard under **Source → Edit → Add Other Gateway → TCR**. |

---

## Card Lifecycle

### 1. Requesting a card

Two API calls: create the wallet that will back the card, then create the card on it.

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

Each wallet holds a single card, and every call to `POST /wallets` creates a new one, so a customer can have as many cards as needed. Cards are issued **anonymous** by default; cardholder data can be sent in `ficha_beneficiario`.

The card is returned with `confirmed: false`. Nothing has been sent to CaixaBank yet.

### 2. Issuing confirmation

In the next processing window the request travels to CaixaBank. When CaixaBank answers, the card is updated:

- **Accepted:** `confirmed: true`, the card token in `gateway_reference_id` and the `activation_code` for the cardholder.
- **Rejected:** the card stays `confirmed: false` and the rejection is logged for review.

### 3. Top-ups

A top-up moves money from the Account wallet to the card wallet using a regular order:

1. Order with the card customer as buyer and seller, and fees set to 0.
2. Payin `WALLET` from the Account wallet. The money is now held in the order.
3. Payout `WALLET` to the card wallet.

Instead of executing, the payout stays **`IN_PROGRESS`** and the money remains held in the order. In the next processing window the top-up is sent to CaixaBank:

- **Accepted:** the payout is executed (`CONFIRMED`), the money reaches the card wallet and the custodial wallets record that this amount is now on the card.
- **Rejected:** the payout is `DENIED` and the payin is refunded to the Account wallet.

Only issued cards (`confirmed: true`) are sent; a top-up for a card that is still pending waits until the card is issued.

### 4. Balance recovery

The reverse movement: order with `auto_settle`, payin `WALLET` from the card wallet and payout `WALLET` to the Account wallet. It follows the same rule — the payout waits `IN_PROGRESS` until CaixaBank confirms that the balance has been taken off the card.

### 5. Consumption

What the cardholder spends is authorised by CaixaBank directly. CaixaBank reports it afterwards in a file, and Truust has to reflect it on the card wallet.

<Note>
The consumption file is not processed yet.
</Note>

---

## Batch Files

All the communication with CaixaBank happens through files exchanged by SFTP. There are three **processing windows** per day:

| Window | Truust sends its file | Truust imports the answer |
|---|---|---|
| 9h | 08:45 | 11:00 |
| 13h | 12:45 | 15:00 |
| 15h | 14:45 | 17:00 |

The import times are a provisional margin until CaixaBank confirms how long it takes to answer.

### Outgoing file

Before each window Truust builds **one file** with everything that is pending, mixed together:

- **Issuing requests:** cards with `confirmed: false` that have not been sent yet.
- **Top-ups and balance recoveries:** payouts held `IN_PROGRESS` against a card that is already issued and that have not been sent yet.

Each line carries a **request number** that identifies what it refers to: the card wallet for an issuing request, the payout for a top-up or recovery. Once a line has been sent it is marked, so it is never sent twice.

The file is a fixed-width text file in the TCR format. It is uploaded to the CaixaBank SFTP — the same channel used for the FB500 settlement files — named `cardIssuing_{ddmmyyyyHH}.txt` in production and `pruebasSNE_{ddmmyyyyHH}.txt` in test.

### Answer file

CaixaBank answers through the FB500 return channel. Truust reads every pending answer file and, line by line, finds the request by its request number:

- **Issuing answer:** confirms the card and stores its token and activation code.
- **Top-up / recovery answer:** executes or denies the held payout, as described above.

Answers that do not match a pending request (for example a duplicated answer) are ignored and logged. Processed files are archived.

### Traceability

Every file sent and every file imported is recorded with its window, the number of lines and how many matched, and the result of each run is notified by email and Slack. The process only runs in production.

<Note>
The details of the TCR record layout and the CaixaBank file exchange will be completed in this section.
</Note>

---

## Sandbox

There is no connection with CaixaBank in sandbox: cards stay `confirmed: false` and top-ups stay `IN_PROGRESS`. The Truust team simulates the answers that CaixaBank sends in production so the full flow can be tested.
