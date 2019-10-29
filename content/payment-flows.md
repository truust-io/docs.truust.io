---
title: 'Payment Flows'
---

> Truust provides a powerful API and other tools you need to accept payments, as well as pay sellers and service providers.

---

## Order Lifecycle

As money travels from the customer to your (or other) bank account, the order is given a series of statuses. A successful order will go through the following statuses:

Order statuses can help you understand where your money is in the order lifecycle.

### Order Status

The possible order status are the following:

- `DRAFT` - The order has been initiated by someone.
- `PENDING_PUBLISH` - The order has a buyer indentified and is pending to be paid.
- `FAILURE` - The order payin has failed. The reason could be checked on the payins list.
- `PUBLISHED` - The order has been paid and is waiting for acceptance.
- `CANCELLED` - The order has been cancelled by the buyer. The refund is automatically done.
- `ACCEPTED` - The order has been accepted by the seller and waiting for payout details.
- `REJECTED` - The order has been rejected by the seller. The refund will be manually handled.
- `PENDING_VALIDATE` - The payout details are completed and the order is waiting to be validated by someone (usually you or your platform).
- `PENDING_RELEASE` - The order has been validated and waiting to be released. This process is automatic and does not require further action by your part.
- `BLOCKED_RELEASE` - The order release has been blocked for some reason and will not be completed. Contact us for more information.
- `RELEASED` - The order has been released.

**About order status**
You don't need to worry too much about this list. In our Dashboard, our order list follows a color-scheme, where you can easily identify each status.

## Wallet Payments

### Payin to Wallet

### Payin from Wallet

### Wallet Top-ups

### One to One

### One to Many

### Many to One

### Many to Many

## Split Payments

Our tool features seamless payment collection, disbursement and management. It helps you reduce your operational costs with our automated split payments. All while tracking the flow of funds from a customer to a recipient, fully recording all transactions.

### Default Split Payments

### Multiple Split

## Escrow Payments

We enable escrow payments in the sharing economy, adding trust to your transactions and assuring that money is released only when comercial conditions are met. You can safely and easily buy and sell goods or services all over the world with the protection of our escrow based technology.

### PSD2 Payments

### Escrow for Crowdfunding

### Escrow for Crowdlending

## Use Cases
