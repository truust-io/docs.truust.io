---
title: 'Telefonica Checkout: Custom Literals'
---

> Override the wording of the Telefonica checkout on a per-order basis using the `template.lang` field of `POST /2.0/orders` and `PUT /2.0/orders/{id}`.

---

## Overview

The Telefonica checkout template ships with a default set of literals (button labels, headings, error messages, etc.) translated into the locale of the buyer's browser. For some integrations you may need to replace specific phrases — for example to match a campaign tone, to use a brand-specific term, or to soften the wording of an error message.

The `template.lang` field lets you override any of the supported literals for a single order, without changing the global checkout configuration. Every key you do not send falls back to the default translation.

This feature applies **only to the Telefonica checkout template**. If your account uses a different template, `template.lang` is silently ignored.

---

## How It Works

The override is processed when the order is rendered with the Telefonica template (`template_folder = 'telefonica'`).

- **Partial overrides are supported.** Only the keys you send are overridden; all other keys keep their default translation.
- **Unknown keys are discarded.** Only the keys listed in the [reference table](#supported-keys) take effect. A key with a typo (`secure_payement` instead of `secure_payment`) is dropped silently — no error, no warning.
- **Only non-empty strings override.** Values that are `null`, an integer, an array, or an empty string `""` are ignored and the default translation is used. There is no way to "blank out" a literal — this is intentional to avoid breaking the UI by accident.
- **Persistent across screens.** The override is stored on the order and applies to the main checkout (`default`), the confirmation screen (`confirmed`), the denial screen (`denied`), and the server-side connection-error modal.
- **Updateable.** `PUT /2.0/orders/{id}` accepts `template.lang` and replaces the entire override stored on the order.

---

## Endpoints

The `template.lang` field is accepted on:

- `POST /2.0/orders` — create an order with custom literals.
- `PUT /2.0/orders/{id}` — replace the custom literals of an existing order.

`template.lang` lives next to other `template` sub-keys (such as `btn_submit_text` or `iframe_title`), which keep working as before.

---

## Payload Structure

```json
{
  "template": {
    "lang": {
      "<key>": "<custom string>",
      "...": "..."
    }
  }
}
```

`template.lang` is an object whose keys match the literals listed in the [reference table](#supported-keys), and whose values are the strings that will replace them in the rendered checkout.

---

## Example Request

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
        "secure_payment": "Movistar Secure Payment",
        "to_pay": "Pay my bill",
        "select_payment_method": "Choose a method",
        "summary_of_your_purchase": "Movistar purchase summary",
        "not_available_title": "Service temporarily unavailable",
        "retry": "Try again"
      }
    }
  }'
```

### Response (truncated)

```json
{
  "data": {
    "id": 12345,
    "name": "Movistar Fibra Purchase",
    "value": 49.90,
    "template": {
      "lang": {
        "secure_payment": "Movistar Secure Payment",
        "to_pay": "Pay my bill",
        "select_payment_method": "Choose a method",
        "summary_of_your_purchase": "Movistar purchase summary",
        "not_available_title": "Service temporarily unavailable",
        "retry": "Try again"
      }
    },
    "buyer_link": "https://checkout.truust.io/abc123",
    "seller_link": "..."
  }
}
```

When the buyer opens `buyer_link`, the checkout renders the custom strings for those keys. Every other literal (e.g. `total_to_pay`, `payment_methods`) keeps its default translation in the buyer's locale.

---

## Supported Keys

Only the keys listed below have an effect. Any other key inside `template.lang` is ignored.

| Key | Default (EN) | Default (ES) | Description |
|---|---|---|---|
| `accept` | Accept | Aceptamos | Generic acceptance button / label. |
| `add_card_payment` | Add a card to make the payment | Añade una tarjeta para realizar el pago | CTA shown when the buyer has no saved cards. |
| `billing_address` | Billing address | Dirección de facturación | Label for the billing address block. |
| `check_order_detail_below` | You can check the details of your order below | Puedes consultar los detalles de tu pedido a continuación | Intro text above the order summary. |
| `close` | Close | Cerrar | Close button (modals, panels). |
| `continue` | Continue | Continuar | Generic CTA to advance to the next step. |
| `customer` | _(empty)_ | _(empty)_ | "Customer" label in the order summary. |
| `from` | From | Desde | Prefix for "from X €" prices. |
| `merchant` | Merchant | Comercio | "Merchant" label in the order summary. |
| `month` | month | mes | Suffix for monthly periodicity (instalments / subscriptions). |
| `no_rate_available` | No rate available | Ninguna tarifa disponible | Shown when no shipping / instalment rate applies. |
| `not_available_comment` | Please try again after a few minutes. | Inténtalo de nuevo pasados unos minutos. | Comment in the connection-error modal. |
| `not_available_title` | CONNECTION ERROR | ERROR DE CONEXIÓN | Title of the connection-error modal. |
| `not_available_sub_title` | We apologise, an error has occurred and we are unable to continue. | Te pedimos disculpas, ha ocurrido un fallo y no podemos continuar. | Subtitle of the connection-error modal. |
| `pay_bankwire` | Pay with bankwire | Pagar con transferencia bancaria | Payment method option: bank transfer. |
| `pay_bizum` | Pay with Bizum | Pagar con Bizum | Payment method option: Bizum. |
| `pay_credit_card` | Pay with card | Pagar con tarjeta | Payment method option: card. |
| `pay_installments` | Installments | Pagar a plazos | Payment method option: instalments / financing. |
| `pay_movistar` | Pay with my Movistar | Pagar con mi Movistar | Payment method option: Movistar. |
| `pay_with_new_card` | Pay with a new card | Pagar con una tarjeta nueva | CTA to enter a new card. |
| `payment_cannot_be_made` | Payment cannot be made | No se puede realizar el pago | Shown when the payment cannot be initiated. |
| `payment_correct` | The payment has been made correctly | El pago se ha realizado correctamente | Success message after payment. |
| `payment_methods` | Payment methods | Métodos de pago | Heading of the payment methods block. |
| `payment_methods_available` | AVAILABLE PAYMENT METHODS | MÉTODOS DE PAGO DISPONIBLES | Alternative emphasised heading. |
| `payment_not_completed` | The payment could not be completed | No se ha podido completar el pago | Payment failure message. |
| `phone_number` | Phone number | Número de teléfono | Phone label. |
| `product` | Purchase details | Concepto del pago | Label for the order concept. |
| `purchase_already_made` | This purchase has already been made | Esta compra ya ha sido realizada | Shown when the link has already been used. |
| `retry` | Retry | Reintentar | Retry button (error modal). |
| `save` | Save | Guardar | Generic save button. |
| `secure_payment` | Secure Payments | Pago Seguro | Label of the checkout's security seal. |
| `select_a_card_to_pay` | Select a card to pay | Selecciona una tarjeta para pagar | Instruction shown when there are saved cards. |
| `select_payment_method` | Select a payment method | Selecciona un método de pago | Initial instruction in the checkout. |
| `summary_of_your_purchase` | Summary of your purchase | Resumen de tu compra | Heading of the summary block. |
| `to_pay` | Pay | Pagar | Main "pay" CTA. |
| `total_to_pay` | Total to pay | Total a pagar | Total amount label. |
| `total_tax_included` | Total (tax included) | Total (impuestos incl.) | Total-with-tax label. |
| `to_pay_wallet` | Pay with wallet | Pagar con wallet | Payment method option: wallet. |
| `try_again_few_minutes` | You can try again in a few minutes | Puedes volver a intentarlo en unos minutos | Informational message on the error screen. |
| `waiting_confirm` | Waiting payment confirmation | Esperando la confirmación de pago | Intermediate state while the payment is confirmed. |
| `error_contact_title` | Payment could not be completed | No se pudo completar el pago | Title of the screen prompting the user to contact support. |
| `error_contact_sub_title` | Unfortunately, we are unable to fulfill your request… | Lamentablemente, no podemos completar su solicitud… | Subtitle of the contact-support screen. |
| `error_contact_comment` | Contact Support | Contactar soporte | CTA to contact support. |

---

## Notes

- The override applies to the buyer-facing checkout (`default`), the `confirmed` and `denied` result screens, and the server-side connection-error modal. Subsequent loads of the same order use the same overrides.
- Sending `template.lang` for an order rendered with a non-Telefonica template has no effect — the field is stored but ignored at render time.
- `PUT /2.0/orders/{id}` **replaces** the entire `template.lang` object. If you want to keep existing overrides and add a new key, send the full merged object.
- See the [Create order endpoint](/api-reference/create-order) and the [Update order endpoint](/api-reference/update-order) for the full request schema.
