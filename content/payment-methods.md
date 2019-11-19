---
title: Payment Methods
metaTitle: Payment Methods
---
> Accept payments from all major card schemes and the most popular alternative payment methods.

- - -

Integrating with Truust offers your customers many different ways to pay – and we’re always working on adding more. Here's a quick list of what we currently offer, and whom they are available to.

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

| Number           | Expiration | CCV | CIP    |
| ---------------- | ---------- | --- | ------ |
| 4548812049400004 | 12/21      | 123 | 123456 |

#### Card numbers for unsuccessful verification

The following credit card numbers will simulate an unsuccessful card verification response.

| Number           | Expiration | CCV |
| ---------------- | ---------- | --- |
| 1111111111111117 | 12/21      | 123 |

## Bank Transfers

### How we handle Bank Transfer Payments

SEPA Direct Debit payments are an asynchronous method, so funds are not immediately available. A payin created from a `BANKWIRE` type can remain pending for up to 14 business days from its creation, though the average time is around five business days. Once the charge is confirmed, its status is updated to succeed.

### Errors in Bank Transfers

## Payment Links

To accept payments via Truust you don’t need to know all the subtleties and perform technical integration. If you have a few orders, you may send a link to order payment directly to your clients’ e-mails. Use a "Create Order" button in the Order section of your Dashboard to send a link to payment to a client’s e-mail address or generate it on the special page of the site.

You and your customers can safely create and share payment links in seconds. Payment links are useful for all kinds of businesses. An accountant sending e-invoices, e-commerce making their social channels shoppable: the applications are endless.

### Batch Creation

With the API, you should be able to create many API requests at the same time to do multiple payins or payouts for example.

### Two-sided Payment Links

When creating an order two payment links will be visible, the first one is for the buyer from which will do the transfer through a TPV, the second one will allow the seller to confirm the payment and validate the order.

### Sharing Payment Links

Truust offers the possibility of generating payment links that can be shared via SMS, Whatsapp, Facebook and Pinterest straight forward from the Dashboard.

Also, after genereting the payment link you can share it via email or any other channel that fits with your business. You just have to copy and paste the link that is provided in truust.
