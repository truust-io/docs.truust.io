---
title: 'Payment Methods'
---

> "Accept payments from all major card schemes and the most popular alternative payment methods."

Integrating with Truust provides your customers a myriad of payment options, and we're continually striving to expand our offerings. Below is a current overview of the supported methods and their availability.

## Payment Gateways

This section provides a list of countries where the Truust API interacts with local online payment gateways. Merchants should contact the local providers to obtain a merchant ID and key-in their credentials in the Truust Account settings (refer to the 'Getting Started' section).

![Payment Gateways](/assets/gateways.png)

## Cards

### 3DS - Secure Transactions

3D Secure adds a protection layer against fraudulent payments supported by most card issuers. The Strong Customer Authentication regulation in Europe mandates the use of 3D Secure for card payments. This system involves an additional verification step where cardholders verify their identity on their bank’s portal. This verification is recognized under various brand names like Visa Secure and Mastercard Identity Check.

### Non-Secure Payments

To mitigate transaction disputes, Truust requires a risk-averse deposit based on company risk analysis, average payout amounts, and transaction volume. Additional funds might be required based on these parameters, and failure to provide this deposit may result in halted payouts until compliance.

### Card Tokenization

Tokenization enables Truust to securely capture sensitive card or bank account details directly from customers, returning a `card_id` for server-side use. This process ensures that no sensitive data breaches your server environment, helping maintain PCI compliance.

### Chargebacks

As a merchant, it is essential to be vigilant about potential fraudulent activities. Chargebacks occur when disputes about transactions are lost, attracting a standard fee from Truust.

### Testing with Cards

For development and testing, use the following card numbers to emulate different responses from the payment gateway.

#### Valid card numbers

These credit card numbers won't trigger specific errors but don't necessarily imply successful transactions in the sandbox environment. Other factors could influence transaction outcomes.

| Payin Type | Number           | Expiration | CCV | CIP    |
| ---------- | ---------------- | ---------- | --- | ------ |
| REDSYS_V2  | 4548812049400004 | 12/23      | 123 | 123456 |
| etc.       |                  |            |     |        |

For unsuccessful transactions, various card numbers can be used to simulate card verification failures.

## Bank Transfers

### SEPA Direct Debits

SEPA payments are non-immediate, with funds typically pending for up to 14 business days. Its status updates once confirmed.

## Payment Links

Truust simplifies payment acceptance via email-linked 'Create Order' buttons or generated payment links for customer convenience. These solutions are ideal for various business types, from accountants sending e-invoices to e-commerce platforms enabling social media purchases.

## Recurring Payments and Subscriptions

Merchants can facilitate recurring payments through customizable subscriptions. Initial payments tokenize relevant customer details in a PCI-compliant manner for subsequent automatic deductions based on the chosen frequency and terms.