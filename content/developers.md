---
title: Developers
metaDescription: Get started with our API and other tools to develop your Truust integration swiftly and effectively.
---

# Developers Guide

Welcome to the Truust Developers Guide! This guide provides all the necessary information to quickly set up and begin using the Truust API and other integration tools.

---

## Quick Start Guide

### Obtaining Your API Keys

Each Truust account is uniquely identified by a set of public and secret API keys. Here's how you can find and manage these keys:

#### Public Key

Your public key is a unique identifier for your account.

**Steps to locate your public key:**

1. Log into the Truust Dashboard (Production or Sandbox, based on your environment).
2. Navigate to "Accounts Settings" in the "Accounts" page menu.
3. Select the "API Developers" tab.
4. In the "API Keys" section, your public key will be listed under "Public Key".

#### Secret Key

The secret key is a confidential identifier that should only be used within API requests.

**Steps to access your secret key:**

1. Follow the steps to navigate to the "API Keys" section as described above.
2. Next to the "Secret Key" field, click the "Reveal" button.
3. Your secret key will appear in the field.

#### Important Considerations

- **Environment Specifics:** API keys differ between Sandbox and Production environments. Ensure they are updated in your application when switching environments.
- **Security:** Rotate these keys periodically to enhance security. Remember that key rotations require updates in your integrations.

<div class="alert alert-warning">
    <strong>Important:</strong> Sandbox and Production API keys are different and should be updated accordingly by your development team when transitioning environments.
</div>

### API Environments

Truust provides two environments for API interaction:

- Sandbox: `https://api-sandbox.truust.io/` (For testing and development)
- Production: `https://api.truust.io/` (For live operations)

Adjust your API keys and endpoints based on the environment you are working in.

## Webhooks

Webhooks in Truust allow your applications to receive automatic updates about events happening within your account, such as order changes and more.

### Configuring Webhooks

To set up a webhook:

1. Log into the Truust Dashboard.
2. Navigate to "Webhooks" and click "Create New Webhook".
3. Enter your destination URL and select the event types you want to subscribe to.
4. Confirm by clicking "Create Webhook".

**Webhook Notifications Include:**

- Order Published
- Order Failed
- Order Accepted
- Order Rejected
- Order Cancelled
- Payout Created
- Order Released

Ensure your server is properly configured to handle incoming webhook data, which is sent via HTTP POST requests.

## API Reference

For detailed information on integrating and using our extensive API, visit our [API Documentation](https://documenter.getpostman.com/view/27442666/2s93kxb5RQ).

For assistance, contact our technical support team at [hello@truust.io](mailto:hello@truust.io).

## Connectors

For visualizing how different components connect within our system, refer to the following diagram:

![Connectors Diagram](/assets/connectors.png)