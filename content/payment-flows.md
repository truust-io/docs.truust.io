---
title: Payment Flows
---

Truust provides a robust API and essential tools to manage payments efficiently, ensuring seamless transactions for sellers and service providers.

## Understanding Transaction-Based Flows 

Truust operates on a transaction-based model where **every movement is linked to an order**, adhering to a predefined lifecycle. Each `order` necessitates an established `buyer` and `seller`, correlating directly with a `payin` and a `payout`.

Please review our [API Reference](/developers#apireference) for a comprehensive list of endpoints and parameters.

## Order Lifecycle

Understanding the order lifecycle is crucial to integrating it with your platform seamlessly. Here's a breakdown of the typical lifecycle stages:

### 1. Creating an Order

The lifecycle commences with a transaction on your platform, leading to the creation of an order. This requires inputs like `name`, `amount`, and `buyer_id`, `seller_id`. Optionally, you can also include confirmation and denial URLs for both parties.

Initial status: `DRAFT`.

### 2. Buyer Completes the Pay in

After order creation, share the `buyer_link` with the buyer for payment completion. This can be shared via our Dashboard or through your usual communication channels like email. Alternatively, handle the payment internally by creating a `payin` using our API, directing the buyer to the `direct_link` for payment completion.

Possible payin methods include:
- `REDSYS_V2` or `CECABANK` - Through card payments.
- `BANKWIRE` - Via bank transfer.
- `WALLET` - Using wallet funds.

Successful payments change the order status to `PUBLISHED`, and failures to `FAILURE`.

### 3. Seller Completes the Payout

Post-payment, inform the seller to navigate to the `seller_link`, accept the order, and provide payout details. Should you choose to handle this internally, create a `payout` via our API and confirm the order acceptance through the same.

Payout options include:
- `ACCOUNT` - Funds sent to a specified bank account.
- `WALLET` - Funds sent to a specified wallet.

Status changes to `PENDING_VALIDATE`.

### 4. Validating the Order

This stage involves holding the funds until your validation. You trigger this based on your business rules, either through our API or Dashboard.

Status after validation: `PENDING_RELEASE`.

### 5. Releasing the Order

Upon receiving validation, we process the payout. The time frame for fund availability varies by payout type; `WALLET` payouts are nearly instantaneous, while `ACCOUNT` payouts take 24-72 hours.

## Order Status Overview

The order status provides insight into the money's journey through the payment process:

- `DRAFT` - Initiation of the order.
- `PENDING_PUBLISH` - Payment pending.
- `FAILURE` - Payment failure.
- `PUBLISHED` - Payment successful.
- `CANCELLED` - Order cancelled by buyer.
- `ACCEPTED` - Seller accepted the order.
- `REJECTED` - Seller rejected the order.
- `PENDING_VALIDATE` - Awaiting order validation.
- `PENDING_RELEASE` - Awaiting fund release.
- `BLOCKED_RELEASE` - Release blocked.
- `RELEASED` - Funds have been released.

<div class="alert alert-info">
**Tip:** Use our Dashboard's color-coded order list for a quick status reference.
</div>

## Split Payments

Truust's system simplifies split payment setups between customers and recipients, reducing operational costs and ensuring transaction transparency.

### Default Split Payments

By default, payments use your account's primary methods for both `payin` and `payout`, streamlining the relationship between all parties involved.

The default flow involves:
- Charging the buyer's card.
- Transferring funds to the order’s wallet.
- Retaining funds until order validation.
- Splitting funds upon validation.

Set `fee_amount = 0` on any order to override default fees and transfer the total amount without deductions.

<div class="alert alert-warning">
**Note:** It’s possible to handle split payments without applying fees, transferring the full amount to the recipient.
</div>

### Multiple Split Payments

For complex payment distributions, refer to our [use cases](/payment-flows#usecases) which detail how to implement multiple splits using varied wallet flows.

## Wallet Payments

Our API supports intricate money flows, providing complete control over the integration and execution processes.

### Payin to Wallet

This flow involves transferring buyer funds directly into the seller’s wallet upon successful payment execution.

### Payin from Wallet

This scenario requires the buyer to have sufficient funds in their wallet, typically from previous transactions, to transfer directly to the seller’s bank account.

### Wallet Top-up

Allows buyers to deposit funds into their wallet from their bank account or card, preparing them for future transactions.

<div class="alert alert-info">
**Remember**: Each flow requires adherence to specific API parameters and guidelines to ensure successful execution.
</div>

Learn more about integrating these flows into your operations to optimize your payment management system effectively.