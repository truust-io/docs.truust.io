---
title: 'Getting Started with Truust'
---

> Truust helps you create any type of payments flow—from e-commerce to split payments and everything in between

## Overview

We offer a variety of products that make it easy for you to accept payments in your app or website. You’ll interact with us in two ways:

1. The Dashboard
2. The Application Programming Interface (API)

### The Dashboard

The Dashboard is our user-friendly interface focused on the tools you need to keep your business running smoothly – allowing you to manually set up orders, manage transactions, pull reports and more. [Learn more about the Dashboard](/dashboard).

### The API

The API is the architecture of our gateway – our complete set of code that powers everything we do, from payments to customer management.

To integrate with Truust, your developers will update the existing code for your website or mobile app to make requests to our API, allowing you to automate processes and customize the way you interact with the gateway. Our [developer docs](/developers) will guide your developers through everything they'll need for a complete integration.

## Environments

There are two Dashboard and API environments:

- [Sandbox Dashboard](http://dashboard-sandbox.truust.io/): Testing environment
- [Production Dashboard](http://dashboard.truust.io/): Live production environment

Both environments are mutually exclusive; they do not interact with each other, and it is possible to have different login credentials for each environment.

<div className="alert alert-warning">

**Your sandbox account is not linked to your production account in any way**. Nothing created in the sandbox will transfer to production. This includes processing options and recurring billing settings. Your login information, account settings and API keys will also be different.

</div>

## Accounts

Accounts are the different groups with which you can organize your orders. Normally, an **account will correspond to the business** with which you want to use our platform.

### Registering an Account

### Your Account

To set up your account click on the **"Accounts"** option in the left menu. Click the **"Accounts"** Settings button for the account you want to set up.

A screen with all options related to managing your Truust account will be displayed.

- **Business Name**: account name.
- **Logo**: company logo.
- **Payment Method**: payment method that your customers will use to pay for your orders by default. You can set the individual payment method later creating the order.
- **Fees:** commission value that will be applied by default to your transactions. You can indicate this commission in two ways: as a percentage and as an absolute value.

### Multiples Accounts

You can create additional Truust accounts associated with your email address. You might create some accounts yourself, and might be given access to other accounts as a team member. To create a new account, click on the name of your current Truust account at the lower-left corner, and select **New account**.

You must use separate Truust accounts for projects, websites, or businesses that operate independently from one another. When you activate a new account, it is subject to Truust’s standard policies and pricing—it does not inherit any special status or other similar considerations that may apply to your existing account.

Using additional accounts has a number of benefits:

- **Separate tax and legal entity information:** Each account can only be associated with the tax ID and legal entity of one business. If you operate multiple businesses that have separate tax ID information (e.g., separate legal entities), you must create additional accounts for each.
- **Unique statement descriptor and public business information**Using the same Truust account for separate businesses can cause confusion as the public business information used is the same for both. For example, a customer who purchases from your business “XYZ” may see a charge from your business “ABC” on their statement, potentially resulting in a dispute. Each additional account has its own public information to accurately describe your business and payments.
- **Easier reporting and reconciliation**Separating the payments processed by your businesses makes it easier to find payments, create and export reports, and reconcile payouts to your bank account.
- **Payouts to separate bank accounts**Each additional account can use a separate bank account for payouts (although you can use the same bank account if you wish).

If you need to create many new accounts—or provision accounts automatically—while maintaining centralized reporting and management, you may wish to consider using tags instead of using multiple conventional Truust accounts.

### Team Members and Roles

Each account can have several team members with different roles and permissions. Our tool becomes the portal to include all the participants from your company in the process. For example, you can have a customer service profile, consulting our panel and reviewing the status of orders and this way giving support to your customers.

You can also access this screen by clicking on **"Team Members"** in the left menu.

In this screen you will be able to carry out all the operations related to the users of your account:

- Add a Team Member to your account
- Edit current Team Members
- Delete a Team Member

#### Add a Team Member

Click the "Create Team Member" button at the top right of the screen.

Fill in the fields to create a new user.

- **Name**: name of the new user.
- **Role**: the role we give it.
  - **Manager**: manages the users of the account.(add, delete users and assign permissions).
  - **Customer Service**: has reduced permissions. You can see the data but not modify it.
- **Email**: Email of the new user.
- **Countries**: country or countries in which the new user will operate.
- **Accounts**: account to which we give access.

### Account Activation

To start working with Truust you must verify your account by providing your personal data, product/service data and company legal data.

https://www.youtube.com/watch?v=pe_gRGE3BLE

#### Step 1: Your Product Details

- **Business website**: In case of not having a website, it is necessary to share either the link to the app or a profile in social networks.
- **Product description**: A brief description of what you sell, who you sell to, and how much you charge your customers.

#### Step 2: Business Details

- **Legal Name**
- **Tax identification number**
- **Legal Address**
- **Tax verification**: you must attach a document with the tax identification number for companies / copy of identification number for freelancers.
- **Company verification**: you must upload the company registration voucher or the tax registration voucher for self-employed.
- **Business Administrator Verification**: you must attach a copy of the Business Administrator’s identification number.
- **Bank verification**: you must upload a bank account ownership certificate.

#### Step 3: Legal Representative Details

The account must be activated by its sole owner. If you wish to activate an account in someone else’s name, you must invite them to the account so that they can complete the activation themselves.

- **Representative Name**
- **Representative Email**
- **Representative Phone Number**

## Wallets

Digital wallets are a way of storing payment information electronically so consumers can make transactions with a computer or smartphone -⁠- and without needing their physical credit or debit cards. Consumers love digital wallets because they're a secure, seamless way to pay on web and mobile. Businesses love them because they can help drive revenue.

Some digital wallets use card details, but others are linked to a bank account. Either way, the wallet payment method style protects you from handling or tokenizing sensitive payment information.

### Virtual Wallets

### Escrow Wallets

## Currencies

We offer options for both single currency and multi-currency setups. If you transact mostly with local customers, we recommend using the default single currency setup. If you transact with a larger international customer base, we recommend a multi-currency setup.

By default, transactions will be created in your home currency. This method requires no additional work to set up, and if most of your transaction volume is domestic, this is all you need.

Regardless of the currency you present in, customers in our supported countries should be able to purchase from you. If a customer makes a purchase using a different currency, the customer's bank will convert the charge to their home currency, and they will be subject to their bank’s currency conversion rates.

### Supported Currencies

Currently we support the following currencies:

- EUR
- GBP
- USD

### Multi-currency Limitations

When you set up your sandbox for the first time, your account will default to processing with a single currency setup – usually with the major currency in your region. If you’d like to test other currencies, you can create new accounts in the sandbox and specify which currency you would like to test for each one.

When any Truust wallet receives payments in multiple currencies, Truust accumulates separate balances for each currency. If possible, Truust automatically sends payouts to an associated bank account for each currency, thereby avoiding exchange fees.

When it’s time to pay out a currency balance to a bank account (or debit card):

- If there is a bank account for that currency, no conversion occurs
- If there is not a bank account for that currency, we automatically convert those funds to your default currency

If you regularly charge in multiple currencies, you may be able to establish multiple bank accounts to have multiple settlement currencies and avoid conversions.

## Fees

In each account you can indicate a fee value that will be applied by default to your orders. It can be indicated in % or in absolute value.

<div className="alert alert-info">

**Example**

For each transaction, you will have 2 calculated values of fees (% and abs.). **We will always use the highest value**. For example, if you configure a 10% fee and an absolute value of 5€, the results will be:

- In a 100€ payment, we will apply 10% (with a total result of 10€ in fees).
- In a 20€ payment, we will apply the absolute 5€ (since the 10% of 20€ does not exceed the other value).

</div>

### Default Fees Scheme

For each transaction, you will have 2 calculated values of fees (% and abs.). **We will always use the highest value**. For example, if you configure a 10% fee and an absolute value of 5€, the results will be:

- In a 100€ payment, we will apply 10% (with a total result of 10€ in fees).
- In a 20€ payment, we will apply the absolute 5€ (since the 10% of 20€ does not exceed the other value).

### Your Fees and Our Fees

Keep in mind that these fee values **must pay for our commissions**, so they can never be lower than the minimum imposed by the platform.

Additionally, each order can have an individual fee that will apply only to that order. These values can be indicated when **creating a link** with the different existing parameters. In the same way, it will apply the same logic of fees mentioned above.

### Changing the Default Fees Scheme

Can you make the buyer assume your service fees instead of the seller? Yes, you can. In that case, you must indicate in the amount field, the total value (resulting from the sum of the original amount plus your fees in absolute value), in the **`fee_amount`** field, the value of your fees in absolute value and in the **`fee_percent`** field, use zero.

<div className="alert alert-info">

**Example**

A marketplace wants to charge 10% to the buyer and a product is listed at 100€. By default in our platform, we will charge the buyer 100€ and transfer 90€ to the seller. If you want to charge the buyer, the following values must be used:

- **`amount`** - 110€
- **`fee_amount`** - 10€
- **`fee_percent`** - 0%

With these values, the buyer will end up being charged 110€ and the seller will receive 100€. It's important to note that **the `fee_percent` must be 0** to avoid calculating the 10% of 110€. The result of this calculation will end up in a total fee value of 11€, which is incorrect.

</div>

## Glossary

### Account

Accounts are the different groups with which you classify your orders. Normally, an account will correspond to the business with which you want to use our platform.

_Other industry names: Merchant Account_

### Bank Account

### Customer

Natural person (natural user) or a legal person (legal user) acting as a buyer (buying a product or a service) or as a seller (selling a product or a service).

_Other industry names: Buyers, Sellers, Users_

### KYC - Know Your Customer

KYC is the process of a company verifying the identity of its clients. Truust is fully compliant with legislations about KYC and AML (Anti Money Laundering) measures. **We require from business that want to use our platform to comply with our rules** and provide the information and documentation requested when signing up to our services.

### Order

Orders are the main entities with which our tool works. **An order is associated with a buyer and a seller**, identified by their phone numbers or email addresses.

You do not have to understand an order as a product. An order should be understood as **a unique access to a payment gateway** with stable actors and fixed values.

_Other industry names: Transaction, Checkout_

### Payin

Deposit of funds by a user to pay for an order.

### Payout

Withdrawal of funds from an order to a end-user’s bank account or wallet.

### Products

Product are a way to create promotions or to sell products limited by quantity or date. Each product has its own payment link. You can use products also to cover your specific needs in your sector, as **Campaigns** for a crowdfunding or **Services** for a services marketplace.

**When should I create a Product instead of an Order?**
If you do not know the buyer or seller of the transaction you must create a product. Orders can only be created when we can identify the seller and buyer.

_Other industry names: Bundles, Campaigns, Services_

### Refund

Reimbursement to a user from a corresponding payin. We also use this term for a rebate, calling them "partial refund".

### Wallet

Digital wallet on which electronic money is stored.

_Other industry names: eWallet, virtual wallet_
