---
title: The Dashboard
---
> Stay on top with your single source for tracking and analyzing your transactions, customer data and revenue.

- - -

## Overview

All accounts have access to a personalized dashboard from which to perform all operations.

The easiest way to use our services is with our Dashboard. You can create orders, track transactions and manage all order activity. 

### Search and Sort

### Reporting

## Orders

Truust works with the concept **orders**. Orders are the main entities with which our tool works. An order is **a transaction associated with a buyer and a seller**, identified by their phone numbers or email addresses.

Each order will end up having associated at least one Payin (incoming money) and one or more Payouts (outgoing money).

To create orders is necessary the information of the product, the information of the buyer and the information of the seller.

You do not have to understand order as a product. An order should be understood as **a unique access to a payment gateway** with stable actors and fixed values.

_Other industry names: Transaction, Checkout_

### List all Orders

## Order Actions

### Create and Edit Orders

To start creating orders follow the steps below:

1. Go to the orders page from the menu on the left of the page. Click “Orders”.
2. Once on the page, click on the “New” button at the top right of the page.

A screen will open with the 3 steps necessary to generate the Order.

> **NOTE**
>
> \
>
> Orders can be created when we know the seller and the buyer, if we do not have the information, we must use the "bundles" functionality (explained later in this document).

#### Step 1: Order – Main Details

The first screen refers to the data of the product or service.

* **Name**: Write the name of the product or service. It will be the name that will be displayed on the payment screen, make sure it is recognizable by users.
* **Account**: select the account from which you want to make the transaction. Remember that a user can create several accounts under the same user, for example, a business with different locations or an entrepreneur with different businesses.
* **Amount**: specify in this field the amount of money to be requested for the product or service. The value of the transaction will be in euros.

We have _additional information_ that we can add to the order and that can be of great help to us to organize our orders internally.

* **Image:** add an image to the product or service.
* **Tag:** to relate the order with a tag that allows us to locate it easily (only visible internally).
* **Fee:** you can indicate a Fee for a specific order that overwrites the one configured by default in your account. The Fee can be specified both in percentage and in absolute value. We will go into detail with the Fees in the account configuration section.

Once you have completed the screen, click on the “Next” button.

#### Step 2: Buyer – Payer Details

On this screen, you must enter the purchaser data.

* **Buyer Prefix**: the prefix of the buyer’s telephone.
* **Buyer Phone**: the buyer’s telephone number.
* **Buyer Confirmation URL**: page to which we will redirect the buyer once the payment has been completed. Web addresses should start with http or https. If you don't have any we will use our default page with your logo.
* **Buyer URL Error**: Page where we will redirect the buyer if there is any problem with the payment. Web addresses should start with http or https. If you don't have any we will use our default page with your logo.

Once completed click on the “Next” button.

#### Step 3: Seller – Payee Details

In this screen enter the data of the seller.

* **Seller Prefix**: the seller’s telephone prefix.
* **Seller Phone**: the phone number of the seller.
* **Seller Confirmation URL**: page where we will redirect the seller once we have collected the payment information. Web addresses should start with http or https. If you don't have any we will use our default page with your logo.
* **Seller Error URL**: Page where we will redirect the merchant if there is a problem collecting payment information. Web addresses should start with http or https. If you don't have any we will use our default page with your logo.

Once completed click on the "Create Order" button.

### Cancel and Refund an Order

Refunds are the term that explains when there is a lost dispute over a transaction and a refund must be made to the buyer.

### Validate an Order

It's the action you take to release the money in the seller's account. This action can only be performed when the payment has been confirmed by Redsys and the merchant has entered their details into the platform.

### Block and Unblock an Order

You can block an order to stop from releasing the payment to the seller. This dashboard functionality is very useful, for exemple, for transactions that may be suspicious of malpractice or when a return is requested and thus block the outflow of payment until the product has been returned and verified.

 When executing **"Block order"** the process will be stopped indefinitely until we **"Unblock order"**.

Instructions:

**How to block an order**

1. Sign in to your [Truust account](https://dashboard.truust.io/login).
2. From the order section, click the **\[···]** menu on the right of the order you want to block.
3. Then click **Block order**. 
   \
   A notification confirming the blocking action will be shown on the screen, and the order status will change to **"Blocked release"**.

The order will remain blocked till the unblock action is done.

Instructions:

**How to unblock an order**

1. Sign in to your [Truust account](https://dashboard.truust.io/login).
2. From the order page, click the **\[···]** menu on the right of the order you want to unblock
3. Then click **Unblock order**. 
   \
   A notification confirming the unblocking action will be shown, and the order status will change to its previous status.

### Add a Bank Account for a Payout

## Pay Ins

### List all Pay Ins

Pay Ins are the payments made by buyers, the inflows of money.

To access the Dashboard Pay Ins screen, click on the “Payins” option in the left menu.

Once the buyer has made the payment, it will be listed in this section.

## Payouts

### List all Payouts

Payouts are the payments we make to the sellers, they are the payments that come out of the escrow account, the outflows of money.

To access the Dashboard Payouts screen, click on the Payouts option in the left menu.

## Products

### List all Products

### Create and Edit Products

To create a Product, access from the list products page and click on the "New" button. Next, fill in the following fields to create a new product:

* **Name**: write the name of the product. It will be the name that will be shown on the payment screen, make sure it is recognizable by users.
* **Account**: select from the account that you want to make the transaction.
* **Amount**: specify in this field the amount of money that will be requested in each order.
* **Currency**: specifies the currency that will be used for each order.
* **Description**: adds a brief description of the product.
* **Image**: attach an image for the product.
