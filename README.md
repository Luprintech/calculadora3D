# FilamentOS — Luprintech

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_OAuth-2.0-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/PWA-instalable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
</p>

<p align="center">
  <b>El sistema operativo de tus impresiones 3D</b>
</p>

FilamentOS es una aplicación web completa para gestionar tus impresiones 3D: calcula costes reales, lleva un inventario de bobinas, hace seguimiento de proyectos y genera presupuestos PDF profesionales. Creada y mantenida por Lupe ([@Luprintech](https://www.instagram.com/luprintech/)).

---

## Capturas de pantalla

<p align="center">
  <img src="docs/claro.png" width="700">
</p>

<p align="center">
  <img src="docs/oscuro.png" width="700">
</p>

---

## Características

- **Calculadora de costes** — filamento, electricidad, mano de obra, amortización de máquina y otros gastos, con wizard de 4 pasos
- **Importación de archivos 3MF** — importa proyectos de Bambu Studio / PrusaSlicer / OrcaSlicer; extrae placas, filamentos, tiempos y pesos
- **Análisis G-code con IA** — sube un archivo G-code y la IA (Gemini) extrae automáticamente tiempo de impresión y peso de filamento
- **Inventario de bobinas** — gestiona el stock: marca como activo/agotado, deduce gramos tras cada impresión, historial de consumos
- **Escáner de código de barras / QR** — escanea la etiqueta de una bobina con la cámara del móvil; busca y rellena datos automáticamente
- **Tracker de proyectos** — registra piezas, tiempo y material por proyecto; exporta informes en PDF
- **Estadísticas** — resumen de proyectos, kilómetros impresos, coste total y ahorro estimado
- **Exportación PDF personalizable** — logo, colores, datos de empresa y secciones configurables
- **Gestión de proyectos** — guarda, carga y elimina proyectos por cuenta de usuario
- **Login con Google** — autenticación OAuth 2.0, sin contraseñas
- **Internacionalización** — interfaz disponible en ES, EN, DE, FR, IT y PT
- **Instalable como PWA** — instálala en móvil o escritorio como app nativa
- **Tema claro / oscuro** — sigue la preferencia del sistema
- **Diseño responsive** — optimizado para móvil y escritorio
- **Privacidad y cookies** — aviso legal conforme a RGPD y LSSI (UE/España)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Express.js + Node.js |
| Base de datos | SQLite (archivo local `data.db`) |
| Autenticación | Passport.js + Google OAuth 2.0 |
| IA / G-code | Google Genkit + Google AI (Gemini) |
| UI | Tailwind CSS + shadcn/ui (Radix UI) |
| Formularios | React Hook Form + Zod |

---

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de Google Cloud (para el OAuth)
- Una API key de Google AI Studio (para el analizador G-code)

---

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/Luprintech/calculadora3D.git
cd calculadora3D

# 2. Instala todas las dependencias (frontend + backend)
npm install

# 3. Crea el archivo de variables de entorno
cp backend/.env.example backend/.env
```

---

## Configuración

### Variables de entorno (`backend/.env`)

```env
# Google OAuth 2.0
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# Clave de sesión (cadena aleatoria larga)
SESSION_SECRET=cadena-aleatoria-muy-larga

# URL del frontend (en desarrollo no cambies esto)
CLIENT_ORIGIN=http://localhost:9002

# Google AI Studio — para el analizador de G-code
GOOGLE_GENAI_API_KEY=AIzaSy...
```

### Generar SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth 2.0 Client ID** → tipo: **Web application**
3. En **Authorized redirect URIs** añade:
   ```
   http://localhost:9002/api/auth/google/callback
   ```
4. Copia el **Client ID** y **Client Secret** a `backend/.env`

### Obtener la API key de Google AI

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Cópiala en `GOOGLE_GENAI_API_KEY` de `backend/.env`

---

## Arrancar en desarrollo

```bash
npm run dev
```

Lanza en paralelo:
- **Frontend** (Vite): `http://localhost:9002`
- **Backend** (Express): `http://localhost:3001`

La base de datos SQLite (`backend/data.db`) se crea automáticamente al arrancar el servidor.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Arranca frontend + backend en modo desarrollo |
| `npm run build` | Compila el frontend para producción |
| `npm start` | Arranca el servidor Express (producción) |
| `npm run typecheck` | Comprueba tipos TypeScript |

---

## Estructura del proyecto

```
calculadora3D/
├── package.json               # Raíz: npm workspaces + scripts
├── frontend/                  # Todo el frontend (React + Vite)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts         # Proxy /api → :3001
│   ├── tailwind.config.ts
│   ├── index.html
│   ├── public/
│   │   ├── manifest.json      # Manifiesto PWA
│   │   └── sw.js              # Service worker (PWA)
│   └── src/
│       ├── components/
│       │   ├── ui/                          # Componentes shadcn/ui
│       │   ├── calculator-form.tsx          # Formulario calculadora (wizard 4 pasos)
│       │   ├── import-3mf-modal.tsx         # Modal de importación 3MF
│       │   ├── pdf-customizer.tsx           # Personalización de PDF
│       │   ├── about-modal.tsx              # Modal "Acerca de FilamentOS"
│       │   ├── buy-me-coffee-button.tsx     # Botón Buy Me a Coffee reutilizable
│       │   ├── cookie-banner.tsx            # Banner aviso de cookies
│       │   └── privacy-policy-modal.tsx     # Política de privacidad
│       ├── features/
│       │   ├── calculator/                  # Dominio calculadora
│       │   │   ├── api/                     # React Query hooks
│       │   │   ├── domain/                  # Lógica de cálculo de costes
│       │   │   └── model/                   # Acciones del formulario
│       │   ├── inventory/                   # Inventario de bobinas
│       │   │   ├── api/                     # React Query hooks
│       │   │   ├── types.ts
│       │   │   └── ui/
│       │   │       ├── inventory-dashboard.tsx
│       │   │       ├── spool-form.tsx
│       │   │       └── barcode-scanner-modal.tsx
│       │   ├── projects/                    # Proyectos guardados
│       │   └── tracker/                     # Tracker de piezas
│       ├── i18n/
│       │   └── locales/                     # Traducciones ES/EN/DE/FR/IT/PT
│       ├── context/
│       │   └── auth-context.tsx
│       ├── hooks/
│       ├── lib/
│       │   ├── schema.ts                    # Validación Zod
│       │   ├── defaults.ts                  # Valores por defecto del formulario
│       │   └── utils.ts
│       ├── App.tsx
│       └── main.tsx
└── backend/                   # Todo el backend (Express)
    ├── package.json
    ├── tsconfig.json
    ├── .env                   # Variables de entorno (no en git)
    ├── .env.example
    └── src/
        ├── index.ts           # Express: OAuth, proyectos, inventario, análisis IA
        └── pdf-generator.ts   # Generación de PDFs (presupuesto y tracker)
```

---

## API del servidor

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/auth/google` | — | Inicia el flujo OAuth con Google |
| GET | `/api/auth/google/callback` | — | Callback OAuth |
| GET | `/api/auth/logout` | — | Cierra la sesión |
| GET | `/api/auth/user` | — | Devuelve el usuario autenticado |

### Calculadora — Proyectos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/projects` | ✓ | Lista los proyectos del usuario |
| POST | `/api/projects` | ✓ | Guarda un nuevo proyecto |
| PUT | `/api/projects/:id` | ✓ | Actualiza un proyecto |
| DELETE | `/api/projects/:id` | ✓ | Elimina un proyecto |

### Análisis de archivos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/analyze-gcode` | — | Analiza un G-code con IA; devuelve tiempo, peso y materiales |
| POST | `/api/analyze-3mf` | — | Analiza un 3MF; devuelve placas con filamentos, tiempos y pesos |

### Inventario de bobinas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/inventory/spools` | ✓ | Lista todas las bobinas del usuario |
| POST | `/api/inventory/spools` | ✓ | Añade una nueva bobina |
| PUT | `/api/inventory/spools/:id` | ✓ | Actualiza datos de una bobina |
| DELETE | `/api/inventory/spools/:id` | ✓ | Elimina una bobina |
| PATCH | `/api/inventory/spools/:id/deduct` | ✓ | Deduce gramos tras una impresión |
| PATCH | `/api/inventory/spools/:id/finish` | ✓ | Marca una bobina como agotada |
| GET | `/api/inventory/:spoolId/consumos` | ✓ | Historial de consumos de una bobina |
| GET | `/api/inventory/custom-options` | ✓ | Marcas y materiales personalizados |

### Escáner de filamentos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/lookup-filament` | — | Busca datos por código de barras / QR |
| POST | `/api/filaments-community` | ✓ | Contribuye datos escaneados a la BD comunitaria |

### Tracker de proyectos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/tracker/projects` | ✓ | Lista proyectos del tracker |
| POST | `/api/tracker/projects` | ✓ | Crea un proyecto |
| PUT | `/api/tracker/projects/:id` | ✓ | Actualiza un proyecto |
| DELETE | `/api/tracker/projects/:id` | ✓ | Elimina un proyecto |
| GET | `/api/tracker/projects/:projectId/pieces` | ✓ | Lista las piezas de un proyecto |
| POST | `/api/tracker/projects/:projectId/pieces` | ✓ | Añade una pieza |
| PUT | `/api/tracker/projects/:projectId/pieces/:id` | ✓ | Actualiza una pieza |
| DELETE | `/api/tracker/projects/:projectId/pieces/:id` | ✓ | Elimina una pieza |
| POST | `/api/tracker/projects/:projectId/pieces/reorder` | ✓ | Reordena las piezas |

### PDF y estadísticas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/pdf/config` | ✓ | Obtiene la configuración del PDF |
| POST | `/api/pdf/config` | ✓ | Guarda la configuración del PDF |
| POST | `/api/pdf/upload-logo` | ✓ | Sube el logo para el PDF |
| POST | `/api/pdf/preview` | ✓ | Genera una vista previa del PDF |
| POST | `/api/pdf/generate` | ✓ | Genera el PDF final |
| POST | `/api/tracker/pdf/preview` | ✓ | Vista previa PDF del tracker |
| POST | `/api/tracker/pdf/generate` | ✓ | PDF final del tracker |
| GET | `/api/stats` | ✓ | Estadísticas globales del usuario |

---

## Cálculo de costes

```
Coste filamento  = (peso usado / peso bobina) × precio bobina
Coste eléctrico  = (vatios / 1000) × horas × coste kWh
Coste mano obra  = (tiempo prep / 60 × tarifa) + (tiempo post / 60 × tarifa)
Amortización     = coste impresora / (años × 365 × 8 h) × horas impresas + reparación

Subtotal         = filamento + electricidad + mano de obra + máquina + otros
Beneficio        = subtotal × (% beneficio / 100)
Base IVA         = subtotal + beneficio
IVA              = base IVA × (% IVA / 100)
Precio final     = base IVA + IVA
```

---

## PWA — Instalar como aplicación

FilamentOS es una **Progressive Web App (PWA)**. Al acceder desde Chrome o Edge (Android/escritorio), aparecerá el botón **"Instalar"** en la cabecera. En iOS/Safari: menú compartir → *Añadir a pantalla de inicio*.

---

## Apoya el proyecto

FilamentOS es un proyecto personal de código abierto. Si te resulta útil, puedes apoyar su desarrollo:

<a href="https://www.buymeacoffee.com/luprintech" target="_blank" rel="noopener noreferrer">
  <img
    src="https://img.buymeacoffee.com/button-api/?text=Alimenta%20filamentOS&emoji=🍔&slug=luprintech&button_colour=e694df&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"
    alt="Apoya FilamentOS en Buy Me a Coffee"
    height="45"
  />
</a>

---

## Privacidad y cookies

La aplicación utiliza únicamente **cookies técnicas** necesarias para la autenticación. No se emplean cookies de seguimiento ni publicidad.

La política de privacidad completa (conforme a RGPD y LSSI) está accesible desde el pie de página.

**Responsable:** Guadalupe Cano · luprintech@gmail.com  
**Autoridad de control:** [Agencia Española de Protección de Datos (AEPD)](https://www.aepd.es)

---

## Contacto

- YouTube: [@Luprintech](https://www.youtube.com/@Luprintech)
- Instagram: [@luprintech](https://www.instagram.com/luprintech/)
- TikTok: [@luprintech](https://www.tiktok.com/@luprintech)
- GitHub: [Luprintech/calculadora3D](https://github.com/Luprintech/calculadora3D)
- Email: luprintech@gmail.com

---

© 2026 Guadalupe Cano. Todos los derechos reservados.
