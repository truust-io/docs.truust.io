---
title: 'Payment Methods'
---

> Accept payments from all major card schemes and the most popular alternative payment methods.

---

Integrating with Truust offers your customers many different ways to pay – and we’re always working on adding more. Here's a quick list of what we currently offer, and whom they are available to.

## Gateways

This is the current list of countries where Truust API calls the local online payment gateway. As a merchant, please contact the local provider to request a merchant id and enter your merchant's credentials in Truust Account settings section (see Getting Started section).

![Gateways](/assets/gateways.png)

## Cards

### 3DS

3D Secure provides a layer of protection against fraudulent payments that is supported by most card issuers. The Strong Customer Authentication regulation in Europe requires the use of 3D Secure for card payments. Unlike regular card payments, 3D Secure requires cardholders to complete an additional verification step with the issuer. Typically, this involves showing the customer an authentication page on their bank’s website, where they are prompted to enter a password associated with the card or a verification code sent to their phone. This process is familiar to customers through the card networks’ brand names, such as Visa Secure and Mastercard Identity Check.

### Non-secure Payments

To mitigate transaction dispute events, Truust demands a Deposit against risks. The amount is calculated based on company risk perception, the average amount of payouts and volume of transactions. Based on those parameters, Truust can demand additional funds for your deposit. You will be communicated about these needs. In case you miss the period of deposit, payouts are blocked. Once the deposit is made, payouts are normalized.

### Card Tokenization

Tokenization is the process Truust uses to collect sensitive card or bank account details directly from your customers in a secure manner. A `card_id` representing this information is returned to your server to use. This ensures that no sensitive card data touches your server, and allows your integration to operate in a PCI-compliant way.

### Chargebacks

Fraudulent activities can happen to any business, and it is your responsibility to know who you should do business with. Chargebacks are the term that explains when there is a lost dispute about a transaction. We charge a standard fee in the event of a chargeback.

### Test Cards

Use the credit card values below to trigger different responses from the gateway.

#### Valid card numbers

These credit card numbers will not trigger specific credit card errors. However, this does not necessarily mean that a transaction will be successful in the sandbox. Other values can impact transaction success.

| Payin Type | Number           | Expiration | CCV | CIP    |
| ---------- | ---------------- | ---------- | --- | ------ |
| REDSYS_V2  | 4548812049400004 | 12/23      | 123 | 123456 |
| CECABANK   | 5540500001000004 | 12/23      | 989 | (none) |
| ADDON_HPP  | 4263970000005262 | 12/23      | 333 | (none) |
| ADDON_V2   | 4918019199883839 | 12/34      | 123 | 1234   |
| ADDON_V2   | 5410080000000021 | 12/40      | 123 | 1234   |
| GPWEBPAY   | 4056070000000008 | 12/23      | 200 | (none) |
| HEARTLAND  | 4012002000060016 | 12/25      | 123 | (none) |
| DCP Izipay | 4012001037141112 | 12/27      | 840 | (none) |
| DCP Izipay | 4005520000000129 | 12/27      | 973 | (none) |

#### Card numbers for unsuccessful verification

The following credit card numbers will simulate an unsuccessful card verification response.

| Number           | Expiration | CCV |
| ---------------- | ---------- | --- |
| 1111111111111117 | 12/21      | 123 |

## Bank Transfers

### How we handle Bank Transfer Payments

SEPA Direct Debit payments are an asynchronous method, so funds are not immediately available. A payin created from a `BANKWIRE` type can remain pending for up to 14 business days from its creation, though the average time is around five business days. Once the charge is confirmed, its status is updated to succeed.

## Payment Links

To accept payments via Truust you don’t need to know all the subtleties and perform technical integration. If you have a few orders, you may send a link to order payment directly to your clients’ e-mails. Use a "Create Order" button in the Order section of your Dashboard to send a link to payment to a client’s e-mail address or generate it on the special page of the site.

You and your customers can safely create and share payment links in seconds. Payment links are useful for all kinds of businesses. An accountant sending e-invoices, e-commerce making their social channels shoppable: the applications are endless.

## Recurring Payments and Subscriptions

With subscriptions you can receive recurring payments from your customers over time. Your customers will make their first payment as they make any other payment on Truust, relevant information will be tokenized and stored in a PCI-compliant way, and payments will be made periodically without further customer interaction. You could customize the subscriptions in many ways: set up a number of times it will be executed or specify an end date, choose the frequency of the payments, or ask for a set-up fee as first payment. You will get notifications which each payment of the subscription.
