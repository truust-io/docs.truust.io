---
title: Payment Flows
---
> Truust provides a powerful API and other tools you need to accept payments, as well as pay sellers and service providers.

- - -

## Order Lifecycle

Every order follows a standard life-cycle. You need to check and understand how this life-cycle will fit into your platform. Order statuses can help you understand where your money is in the order lifecycle.

### 1. Order is created

The process will usually start when a new transaction happens in your platform. **You will then create an order through our available methods** indicating a `name`, `amount`, the IDs of both `buyer_id` and `seller_id` and (if you desire) the confirmation and denial URLs for both users (`buyer_*` for the buyer and `seller_*` for the seller). For a complete parameters list check our API Reference.

The current order status shall be `DRAFT`.

### 2. Buyer receives the buyer_link and completes the payment

Once the order is created, you must share the order's `buyer_link` with the buyer to complete the payment. The process of sharing the link can be done through our own platform for manual use or the notification methods you normally use on your site.

If you prefer to **complete the payment totally on your side** without sending the `buyer_link`, you must create the associated `payin` to this order directly with our API. The available payin types currenyly are:

* `ADDON` - Completes the payment using our card-payments gateway
* `BANKWIRE` - Completes the payment using a bank transfer
* `WALLET` - Completes the payment using the funds located at the specified `wallet_id` parameter

Once the `payin` is created through our API, you must redirect the user to the `direct_link` property. From this moment, **the user will be redirected from us to the gateway** page to complete the payment without any more interaction with us.

When the buyer finishes the payment process, he is redirected to the URL that you set when creating the order on the step 1 or a default one provided by us. The order status on this moment shall be `PUBLISHED` if the payment is sucessful or `FAILURE` if there is a problem during the payment.

### 3. Seller receives seller_link and accepts the order

After the payment is done, you should notify the seller about the payment status. The seller must navigate to the `seller_link` provided by us, accept the order and fill the bank account information where the money will be deposited. Once the seller fills in that information, he is redirected to the URL that you set up on step 1.

Again, if **you prefer to complete this process totally on your side**, you must create the associated `payout` to this order and **accept the order with our API**. The available payout types are:

* `ACCOUNT` - Sends the money to the bank account specified at the `bankaccount_id` API parameter
* `WALLET` - Sends the money to the wallet specified at the `wallet_id` API parameter

The final status on this process shall be `PENDING_VALIDATE`.

### 4. Order is validated.

At this moment, the money will be held and waiting for release. **This action is not automatic** and you are responsible to trigger the validation, depending on your bussines rules. Use [our API](/developers) to complete this action or use our Dashboard [Order Actions](/dashboard#orderactions).

The status at this moment shall be `PENDING_RELEASE`.

### 5. Order is released.

Once we received the order to release the payout, we begin the process to close the order. Depending on your payout type the time expected to the funds be available will vary. If you choose to perform a `WALLET` payout, the funds will be available almost instantly.

If you choose to perform an `ACCOUNT` payout, expect the money to be available on the specified bank account in between 24-72h.

## Order Status

Remember. As money travels from the customer to your (or other) bank account, the order is given a series of statuses. The possible order status are the following:

* `DRAFT` - The order has been initiated by someone.
* `PENDING_PUBLISH` - The order has a buyer indentified and is pending to be paid.
* `FAILURE` - The order payin has failed. The reason could be checked on the payins list.
* `PUBLISHED` - The order has been paid and is waiting for acceptance.
* `CANCELLED` - The order has been cancelled by the buyer. The refund is automatically done.
* `ACCEPTED` - The order has been accepted by the seller and waiting for payout details.
* `REJECTED` - The order has been rejected by the seller. The refund will be manually handled.
* `PENDING_VALIDATE` - The payout details are completed and the order is waiting to be validated by someone (usually you or your platform).
* `PENDING_RELEASE` - The order has been validated and waiting to be released. This process is automatic and does not require further action by your part.
* `BLOCKED_RELEASE` - The order release has been blocked for some reason and will not be completed. Contact us for more information.
* `RELEASED` - The order has been released.

<div class="alert alert-info">

**About order status**
You don't need to worry too much about this list. In our Dashboard, our order list follows a color-scheme, where you can easily identify each status.

</div>

## Wallet Payments

Using our standard order life-cycle and our available payin and payout types we offer a variety of money flows to cover almost every need.

This kind of complex movements are only available with our API.

### Payin to Wallet

This movement will transfer the funds from the buyer's card or bank account to the seller's wallet.

![](/assets/payintowallet.png)

### Payin from Wallet

This movement will transfer the funds from the buyer's wallet to the seller's bank account. Note that **the buyer will need a previous order** (Payin to Wallet or Wallet Top-up) to fund his own wallet.

![](/assets/payinfromwallet.png)

### Wallet Top-up

This movement will transfer the funds from the customer's card or bank account to the own wallet.

![](/assets/wallettopup.png)

### Wallet to Wallet

![](/assets/wallettowallet.png)



### One to One

A customer is charged and a transfer is sent to a recipient, a relationship between charging and sending funds.



### One to Many

To perform a One to Many payment you have to combine multiples previous movements. In this case, the full operation will be composed of:

\- Wallet Top-up to the customer acting as One.

\- Payin from Wallet

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

A crowdfunding requires that all funds collected go into a third party deposit account and remain there until the funding target is achieved or are immediately returned to investors if the target is not achieved. Because funding portals cannot touch the funds, a third party is needed who can meet the escrow requirements of crowdfunding regulations.



### Escrow for Crowdlending

## Use Cases
