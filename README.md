# Cloud Device Manager

A modern, responsive, full-stack web application for organizing cloud hardware, virtual nodes, edge devices, and services into custom categories with real-time status orchestration, built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase**.

---

## Features

- **Categorized Device Fleets**: Create unlimited categories (e.g., *Genplay*, *CC Cloud*, *Edge Nodes*) and organize devices within them.
- **Device Management**:
  - Device Name (required)
  - Device ID (optional — devices can be created without entering an ID)
  - Real-time Status Dropdown: `Empty`, `In Progress`, `Active`, `Completed`, `Error`
  - Notes field for port assignments, locations, or hardware specs
  - Inline 1-click status switcher directly on device cards
- **Global Search & Filter**:
  - Global search by category name, device name, device ID, or notes (with `/` keyboard shortcut)
  - Filter pills by status (`All`, `Empty`, `In Progress`, `Active`, `Completed`, `Error`) with live counts
- **Multi-Tenant Security & Isolation**:
  - Supabase Authentication (Sign up, Sign in, Password Reset, Persistent Sessions)
  - PostgreSQL Row Level Security (RLS) policies guaranteeing each user can only read, create, update, and delete their own categories and devices.
- **Realtime Synchronization**:
  - Supabase Realtime channel subscription keeps multiple tabs or devices in sync instantaneously.
- **Responsive & Modern Dark UI**:
  - Dark mode by default (`#090d16` canvas)
  - Fleet KPI quick statistics bar
  - Smooth collapsible category cards with "Expand All" / "Collapse All" toggle
  - Floating Action Button (FAB) on mobile
  - Accessible confirmation modals before deleting categories or devices
  - Toast notification system with auto-dismiss

---

## Project Structure

```text
├── supabase/
│   └── schema.sql                # Complete PostgreSQL schema, triggers & RLS policies
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx # Route guard for authenticated pages
│   │   ├── category/
│   │   │   ├── AddCategoryDialog.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── EditCategoryDialog.tsx
│   │   ├── common/
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── StatusFilter.tsx
│   │   │   └── SupabaseConfigBanner.tsx
│   │   └── device/
│   │       ├── AddDeviceDialog.tsx
│   │       ├── DeviceCard.tsx
│   │       ├── EditDeviceDialog.tsx
│   │       └── StatusBadge.tsx
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication & persistent session state
│   │   └── ToastContext.tsx       # Toast notifications
│   ├── hooks/
│   │   └── useDeviceManager.ts    # Centralized data hook, realtime subscriptions, optimistic updates
│   ├── layouts/
│   │   └── AuthLayout.tsx         # Layout for login, register, and password recovery
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client with fallback & config detection
│   │   └── utils.ts               # Status styles, color palettes, formatters
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main dashboard view
│   │   ├── ForgotPassword.tsx     # Password recovery view
│   │   ├── Login.tsx              # User login
│   │   ├── NotFound.tsx           # 404 page
│   │   └── Register.tsx           # User registration
│   ├── services/
│   │   ├── categoryService.ts     # Supabase category CRUD service
│   │   └── deviceService.ts       # Supabase device CRUD service
│   ├── types/
│   │   └── index.ts               # Complete TypeScript interfaces and types
│   ├── App.tsx                    # Routing configuration
│   ├── index.css                  # Tailwind styles and base theme
│   ├── main.tsx                   # React root entry
│   └── vite-env.d.ts              # Vite environment typings
├── .env.example                   # Environment variable template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript bundler configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## Getting Started

### 1. Install Dependencies

Ensure you have **Node.js 18+** installed. In the project directory, run:

```bash
npm install
```

---

### 2. Create a Supabase Project

1. Visit [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**.
3. Choose an organization, enter a project name (e.g. `cloud-device-manager`), and set a strong database password.
4. Select your preferred region and click **Create new project**.

---

### 3. Run the SQL Schema & Enable RLS

1. In your Supabase Dashboard, navigate to the **SQL Editor** tab from the left sidebar.
2. Click **New query**.
3. Open [`supabase/schema.sql`](supabase/schema.sql) from this project, copy all its contents, paste them into the SQL editor, and click **Run**.
4. This will automatically:
   - Create the `profiles`, `categories`, and `devices` tables with foreign key cascades.
   - Configure timestamps, updated_at triggers, and automatic user profile generation.
   - Enable **Row Level Security (RLS)** on all tables with strict policies ensuring users can only read, insert, update, or delete their own data.
   - Add `categories` and `devices` to the `supabase_realtime` publication with full replica identity for instant real-time sync across clients.

---

### 4. Configure Environment Variables

1. In your Supabase Dashboard, navigate to **Project Settings > API**.
2. Copy the **Project URL** and the public **anon key** (`sb_publishable_...` or JWT anon key).
3. Create or edit your local `.env` file (copying from `.env.example`):

```bash
# On Linux / macOS:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

4. Populate your keys in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Security Note**: Never place the `service_role` secret key in the frontend. Only the public `anon` key is used in client-side code. RLS policies protect all database access.

---

### 5. Start the Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

### 6. Build for Production

To compile TypeScript and produce an optimized production bundle:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## Database Design Reference

### `profiles` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, References `auth.users(id)` ON DELETE CASCADE | Matches Supabase Auth user ID |
| `email` | `TEXT` | Nullable | User's registered email |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Account creation time |

### `categories` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, DEFAULT `gen_random_uuid()` | Unique category identifier |
| `user_id` | `UUID` | References `auth.users(id)` ON DELETE CASCADE | Owner of the category |
| `name` | `TEXT` | NOT NULL | Category/service name |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Created timestamp |

### `devices` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, DEFAULT `gen_random_uuid()` | Unique device identifier |
| `category_id` | `UUID` | References `categories(id)` ON DELETE CASCADE | Parent category |
| `user_id` | `UUID` | References `auth.users(id)` ON DELETE CASCADE | Owner of the device |
| `name` | `TEXT` | NOT NULL | Device name |
| `device_id` | `TEXT` | Nullable | Optional hardware ID or address |
| `status` | `TEXT` | NOT NULL, DEFAULT `'Empty'` | One of `'Empty'`, `'In Progress'`, `'Active'`, `'Completed'`, `'Error'` |
| `notes` | `TEXT` | Nullable | Optional notes and specifications |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Created timestamp |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Auto-updated on row change |

---

## Authentication Flow & Error Handling

- **Sign In**: Direct credential authentication with user-friendly error banners for incorrect passwords or unverified accounts.
- **Account Registration**: Validates password length (min. 6 characters), password confirmation match, and gracefully handles duplicate emails.
- **Password Reset**: Sends secure email reset links with user feedback.
- **Session Persistence**: Sessions persist automatically in browser storage; route transitions preserve authenticated state across refreshes.
- **Offline / Network Handling**: Detects network failure and missing Supabase credentials with non-crashing banners and actionable steps.
