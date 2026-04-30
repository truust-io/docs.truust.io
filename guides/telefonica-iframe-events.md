---
title: 'Iframe Event Communication'
---

> How to listen to payment lifecycle events dispatched by the Telefonica checkout iframe using the `postMessage` API.

---

## Overview

When the Telefonica checkout is embedded as an iframe within your application, it communicates the progress of a payment attempt through the browser's `window.postMessage` API. Your parent page can listen for these events to update its own UI — for example, showing a spinner during processing, disabling buttons, or displaying confirmation messages.

The iframe dispatches events at each stage of the payment flow:

1. The user clicks the pay button
2. Payment data is submitted
3. The payment is being processed
4. The user is redirected to the payment gateway
5. The payment is confirmed or denied

---

## Listening for Events

Add a `message` event listener on the parent window. Every message from the checkout iframe contains a `dispatch` property that identifies the event type.

```javascript
window.addEventListener('message', function (event) {
    // Optionally verify the origin
    // if (event.origin !== 'https://checkout.truust.io') return;

    const data = event.data;

    if (!data || !data.dispatch) return;

    switch (data.dispatch) {
        case 'clickPayment':
            // The user clicked the pay button
            break;
        case 'submittedPayment':
            // The form has been submitted
            break;
        case 'processingPayment':
            // Payment request is in progress
            break;
        case 'redirectPayment':
            // The user will be redirected to the payment gateway
            break;
        case 'errorPayment':
            // The payment request failed
            break;
        case 'statePayment':
            // The pay button's enabled/disabled state changed
            console.log('Button disabled:', data.isDisabled);
            break;
        case 'orderStatus':
            // Final payment result
            console.log('Result:', data.detail);
            break;
    }
});
```

---

## Sending Events to the Iframe

The parent page can also send commands to the checkout iframe. Currently one inbound event is supported:

### `submitPayment`

Triggers the payment form submission programmatically. Use this when you want to control the pay button from outside the iframe.

```javascript
const iframe = document.getElementById('checkout-iframe');
iframe.contentWindow.postMessage({ dispatch: 'submitPayment' }, '*');
```

---

## Event Reference

### `clickPayment`

Dispatched when the user clicks the pay button inside the iframe, before any validation or network request.

| Field      | Type   | Value            |
|------------|--------|------------------|
| `dispatch` | string | `clickPayment`   |

---

### `submittedPayment`

Dispatched when the payment form is submitted (after validation passes).

| Field      | Type   | Value              |
|------------|--------|--------------------|
| `dispatch` | string | `submittedPayment` |

---

### `processingPayment`

Dispatched after form validation succeeds and the payment request is being sent to the server.

| Field      | Type   | Value               |
|------------|--------|---------------------|
| `dispatch` | string | `processingPayment` |

---

### `redirectPayment`

Dispatched when the server responds successfully and the iframe is about to redirect the user to the payment gateway (e.g. 3D Secure).

| Field      | Type   | Value             |
|------------|--------|-------------------|
| `dispatch` | string | `redirectPayment` |

---

### `errorPayment`

Dispatched when the payment request fails (network error, server error, etc.).

| Field      | Type   | Value           |
|------------|--------|-----------------|
| `dispatch` | string | `errorPayment`  |

---

### `statePayment`

Dispatched whenever the pay button's `disabled` attribute changes. The iframe uses a `MutationObserver` to detect this. Use this event to mirror the button state in your parent UI.

| Field        | Type    | Description                          |
|--------------|---------|--------------------------------------|
| `dispatch`   | string  | `statePayment`                       |
| `isDisabled` | boolean | `true` if the button is disabled, `false` otherwise |

---

### `orderStatus`

Dispatched on the final result pages (confirmation or denial) to communicate the outcome of the payment.

| Field          | Type   | Description                                      |
|----------------|--------|--------------------------------------------------|
| `dispatch`     | string | `orderStatus`                                    |
| `detail`       | string | `confirmed_payment` or `denied_payment`          |
| `confirmed_at` | string | ISO 8601 timestamp of confirmation (only on confirmed, may be `null`) |
| `denied_at`    | string | ISO 8601 timestamp of denial (only on confirmed page, may be `null`)  |

---

## Payment Flow

```
+-----------------------------------------------+
|                 Iframe loads                   |
+-----------------------+-----------------------+
                        |
                        | statePayment {isDisabled}
                        |
+-----------------------+-----------------------+
|            User clicks pay button             |
+-----------------------+-----------------------+
                        |
                        | clickPayment
                        |
+-----------------------+-----------------------+
|           Form validates & submits            |
+-----------------------+-----------------------+
                        |
                        | submittedPayment
                        |
+-----------------------+-----------------------+
|          Payment request to server            |
+-----------------------+-----------------------+
                        |
                        | processingPayment
                        |
+-----------------------+-----------------------+
|                  Success?                     |
+-----------+-----------------------+-----------+
            |                       |
           Yes                      No
            |                       |
            | redirectPayment       | errorPayment
            |                       |
+-----------+-----------+ +---------+-----------+
|   Redirect to gateway | |      Error page     |
+-----------+-----------+ +---------------------+
            |
            | (after gateway)
            |
+-----------+-------------------------------+
|              orderStatus                  |
|      confirmed_payment / denied_payment   |
+-------------------------------------------+
```

---

## Notes

- All events are sent to `window.parent` using `postMessage` with a wildcard origin (`'*'`). If the checkout is opened as a popup instead of an iframe, events are sent to `window.opener`.
- It is recommended to validate `event.origin` in your listener to ensure messages come from the expected checkout domain.
- The `statePayment` event may fire multiple times as the button state toggles during form interaction (e.g. while card fields are being filled).
