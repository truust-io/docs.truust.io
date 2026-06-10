---
title: 'Telefonica Checkout: Terms Checkboxes'
---

> Render up to three terms checkboxes on the Telefonica checkout on a per-order basis, using `metadata.terms_data` (visibility and obligation) and `template.lang` (wording) of `POST /2.0/orders` and `PUT /2.0/orders/{id}`. The buyer's acceptance — result and timestamp — is written back to the order metadata when the payment is created.

---

## Overview

Some integrations need the buyer to explicitly accept one or more terms before paying. The Telefonica checkout supports up to **three independent consent checkboxes**, each one fully configurable per order:

- **Whether it is shown and whether it is mandatory** is controlled by `metadata.terms_data`.
- **The wording** is controlled by `template.lang` (and supports HTML, so you can include links).
- **The buyer's decision** (accepted or not, and at what time) is persisted back into `metadata.terms_data` when the payment is created, so it is available afterwards on the order.

This feature applies **only to the Telefonica checkout template**. If your account uses a different template, the checkboxes are not rendered.

The three checkboxes are identified by a fixed key:

| Key | Typical use |
|---|---|
| `marketing` | Consent to receive commercial communications. |
| `properties` | Acceptance of service-specific / particular conditions. |
| `other` | Any additional term. |

---

## How It Works

Each checkbox is driven by three keys inside `metadata.terms_data`, where `<key>` is one of `marketing`, `properties`, `other`:

- **`terms_<key>_required`** — controls visibility and obligation:
  - `0` — the checkbox is **not rendered**.
  - `1` — the checkbox is **rendered and mandatory**: the buyer cannot pay until it is checked.
  - `2` — the checkbox is **rendered and optional**: the buyer can pay whether it is checked or not.
- **`terms_<key>_text`** (read from `template.lang`) — the label shown next to the checkbox. If omitted, the default literal for the buyer's locale is used (see [Wording](#wording)).
- **`terms_<key>_result`** — the persisted acceptance. If `true` when the order is rendered, the checkbox **starts already checked**.

When the buyer creates the payment, for every **rendered** checkbox the checkout sends back:

- **`terms_<key>_result`** — `true` if the box was checked, `false` if not.
- **`terms_<key>_time`** — the moment the buyer last toggled the box, captured client-side, formatted `HH:mm:ss DD/MM/YY`. The time is updated on every change (checking **and** unchecking). If the buyer never interacted with a pre-checked box, the previous timestamp is kept.

Both values are merged into the existing `metadata.terms_data`, so the configuration keys (`terms_<key>_required`) are preserved.

---

## Wording

The label of each checkbox comes from `template.lang.terms_<key>_text`. The string is rendered as **HTML**, so you can include links or basic inline formatting:

```json
"terms_other_text": "I have read and accept the <a href=\"https://example.com/terms\" target=\"_blank\" rel=\"noopener\">terms and conditions</a>"
```

Use `target="_blank" rel="noopener"` so the link opens outside the checkout without interrupting the payment flow.

If you do not send `terms_<key>_text`, the checkout falls back to the default literal:

| Key | Default (EN) | Default (ES) |
|---|---|---|
| `terms_marketing_text` | I agree to receive marketing communications and personalized offers | Acepto recibir comunicaciones comerciales y ofertas personalizadas |
| `terms_properties_text` | I accept the particular terms of the service | Acepto las condiciones particulares del servicio |
| `terms_other_text` | I accept other terms of the service | Acepto otras condiciones del servicio |

The same `template.lang` filtering rules as [custom literals](/guides/telefonica-checkout-literals) apply: unknown keys are discarded and empty / non-string values fall back to the default.

---

## Endpoints

The consent checkboxes are configured on:

- `POST /2.0/orders` — create an order with consent checkboxes.
- `PUT /2.0/orders/{id}` — update the configuration of an existing order.

`metadata.terms_data` lives next to any other `metadata` keys, and `template.lang` next to other `template` sub-keys.

---

## Payload Structure

```json
{
  "template": {
    "lang": {
      "terms_<key>_text": "<label, HTML allowed>"
    }
  },
  "metadata": {
    "terms_data": {
      "terms_<key>_required": 0
    }
  }
}
```

- `terms_<key>_required` lives in `metadata.terms_data` and decides whether the box is shown / mandatory.
- `terms_<key>_text` lives in `template.lang` and sets the wording.
- A checkbox is only rendered when its `terms_<key>_required` is `1` or `2` — sending only the text without the `required` flag renders nothing.

---

## Example Request

Render all three checkboxes as mandatory, with custom wording and a link in the last one:

```bash
curl -X POST {{endpoint}}/2.0/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Movistar Fibra Purchase",
    "value": 49.90,
    "buyer_id": 123,
    "seller_id": 456,
    "template": {
      "lang": {
        "terms_marketing_text": "I agree to receive commercial communications",
        "terms_properties_text": "I accept the transfer of my data according to the privacy policy",
        "terms_other_text": "I have read and accept the <a href=\"https://example.com/terms\" target=\"_blank\" rel=\"noopener\">terms and conditions</a>"
      }
    },
    "metadata": {
      "terms_data": {
        "terms_marketing_required": 1,
        "terms_properties_required": 1,
        "terms_other_required": 1
      }
    }
  }'
```

When the buyer opens the checkout, the three checkboxes are shown with the custom labels (the last one with a clickable link). The buyer must check the mandatory ones (`required: 1`) before the **Pay** button is enabled.

![Telefonica checkout with terms checkboxes](/assets/telefonica-terms-checkbox.png)

### After the payment is created

Once the buyer proceeds to pay, `metadata.terms_data` on the order is updated with the result and the timestamp of each rendered checkbox, while keeping the original `required` flags:

```json
{
  "metadata": {
    "terms_data": {
      "terms_marketing_required": 1,
      "terms_marketing_result": true,
      "terms_marketing_time": "14:53:02 08/06/26",
      "terms_properties_required": 1,
      "terms_properties_result": true,
      "terms_properties_time": "14:53:05 08/06/26",
      "terms_other_required": 1,
      "terms_other_result": true,
      "terms_other_time": "14:53:09 08/06/26"
    }
  }
}
```

You can read these values later with [Get order](/api-reference/get-order).

---

## Field Reference

All keys live inside `metadata.terms_data`, except `terms_<key>_text` which lives inside `template.lang`. `<key>` is one of `marketing`, `properties`, `other`.

| Field | Location | Type | Direction | Description |
|---|---|---|---|---|
| `terms_<key>_required` | `metadata.terms_data` | integer | You set it | `0` = not rendered, `1` = rendered & mandatory, `2` = rendered & optional. |
| `terms_<key>_text` | `template.lang` | string (HTML) | You set it | Checkbox label. Falls back to the default literal if omitted. |
| `terms_<key>_result` | `metadata.terms_data` | boolean | You set it / checkout writes it | If `true` at render time, the box starts checked. After payment, reflects whether the box was checked. |
| `terms_<key>_time` | `metadata.terms_data` | string | Checkout writes it | Moment of the last toggle, format `HH:mm:ss DD/MM/YY`. Only updated when the buyer interacts with the box. |

### `terms_<key>_required` values

| Value | Rendered | Mandatory to pay |
|---|---|---|
| `0` | No | — |
| `1` | Yes | Yes — Pay button disabled until checked. |
| `2` | Yes | No — buyer can pay with it checked or unchecked. |

---

## Notes

- The feature only applies to the **Telefonica checkout template**. On other templates the checkboxes are not rendered.
- A checkbox is rendered only if its `terms_<key>_required` is `1` or `2`. The `text` alone does not render anything.
- Mandatory checkboxes (`required: 1`) block the payment until checked. The result of an unchecked **optional** checkbox (`required: 2`) is persisted as `false`.
- `terms_<key>_time` is generated on the buyer's device at the exact moment the checkbox is toggled, not on the server. It is updated on both check and uncheck.
- `terms_<key>_text` is rendered as raw HTML. Only send trusted content (the field is set through the authenticated API).
- `PUT /2.0/orders/{id}` replaces `template.lang` entirely; to keep existing literals while changing a term text, send the full merged object. `metadata` is merged with the existing metadata.
- See the [Create order endpoint](/api-reference/create-order) and the [Update order endpoint](/api-reference/update-order) for the full request schema, and [Custom Literals](/guides/telefonica-checkout-literals) for the rest of the `template.lang` keys.
