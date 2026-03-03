# docs.truust.io

Documentación oficial de [Truust](https://truust.io), construida con [Mintlify](https://mintlify.com).

## Requisitos

- Node.js 18+
- Mintlify CLI instalado globalmente:

```bash
npm install -g mintlify
```

## Desarrollo local

```bash
npm run dev
```

Accede a `http://localhost:3000` para ver la documentación en local.

> Equivalente a ejecutar `mintlify dev` directamente desde la raíz del proyecto.

## Estructura del proyecto

```
.
├── mint.json              # Configuración principal de Mintlify (nav, colores, branding)
├── assets/                # Imágenes y recursos estáticos
├── index.md               # Página de inicio (/)
├── introduction.md        # /introduction
├── getting-started.md     # /getting-started
├── dashboard.md           # /dashboard
├── hosted-checkout.md     # /hosted-checkout
├── payment-methods.md     # /payment-methods
├── payment-flows.md       # /payment-flows
├── reporting.md           # /reporting
└── developers.md          # /developers
```

## Editar contenido

Cada archivo `.md` de la raíz corresponde a una página de la documentación. La URL de cada página coincide con el nombre del archivo:

| Archivo | URL |
|---|---|
| `index.md` | `https://docs.truust.io` |
| `introduction.md` | `https://docs.truust.io/introduction` |
| `getting-started.md` | `https://docs.truust.io/getting-started` |
| `dashboard.md` | `https://docs.truust.io/dashboard` |
| `hosted-checkout.md` | `https://docs.truust.io/hosted-checkout` |
| `payment-methods.md` | `https://docs.truust.io/payment-methods` |
| `payment-flows.md` | `https://docs.truust.io/payment-flows` |
| `reporting.md` | `https://docs.truust.io/reporting` |
| `developers.md` | `https://docs.truust.io/developers` |

## Configuración

Toda la configuración del sitio (navegación, colores, logo, links) se gestiona en `mint.json`.

Referencia completa: [mintlify.com/docs/settings/global](https://mintlify.com/docs/settings/global)

## Añadir una nueva página

1. Crea un archivo `.md` o `.mdx` en la raíz con el frontmatter mínimo:

```md
---
title: "Título de la página"
description: "Descripción breve para SEO"
---
```

2. Añade la ruta en la sección `navigation` de `mint.json`:

```json
{
  "group": "Nombre del grupo",
  "pages": ["nombre-del-archivo"]
}
```

## Imágenes

Coloca las imágenes en la carpeta `assets/` y referencíalas con rutas absolutas:

```md
![Descripción](/assets/nombre-imagen.png)
```

## Despliegue

El sitio se despliega automáticamente en [Mintlify Cloud](https://dashboard.mintlify.com) al hacer push a la rama principal.
