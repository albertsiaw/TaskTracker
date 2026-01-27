# Nuxt 4 Todo Application with Better Auth

A high-performance, full-stack Todo application built with Nuxt 4, featuring robust authentication, real-time database management, and automated email reminders.

## 🚀 Tech Stack

- **Frontend & Backend**: [Nuxt 4](https://nuxt.com/) (Full-stack Framework)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (Drizzle Adapter)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS & Nuxt UI
- **Queue System**: [BullMQ](https://docs.bullmq.io/) with Redis
- **Emails**: [Maileroo](https://maileroo.com/)

---

## 🏗️ Project Structure

```text
├── app/                  # Frontend Application
│   ├── components/       # Reusable UI components
│   ├── composables/      # Shared logic (e.g., useAuth)
│   ├── pages/            # App routes (Home, Login, Register, Todos)
│   └── middleware/       # Auth guards
├── server/               # Backend Logic (Nitro)
│   ├── api/              # API Endpoints (Auth, Todos)
│   ├── database/         # Database schema and connection
│   ├── queues/           # BullMQ queue definitions
│   └── utils/            # Helpers (Better Auth, Reminders, Mail)
├── drizzle/              # Database migrations
└── drizzle.config.ts     # Drizzle configuration
```

---

## 🔑 Key Features

### 1. Advanced Authentication

Managed by **Better Auth**.

- Secure Email/Password registration and login.
- Session Management (Stored in Postgres).
- Protected API routes and client-side middleware.
- **Welcome emails** sent automatically on registration.
- Password reset functionality with email notifications.

### 2. Dual-Mode Todos

- **Public Todos**: Visible to all users on the public feed.
- **Private Todos**: Securely tied to your user ID, only accessible when logged in.
- **Ownership Controls**: Only todo owners can edit, delete, or complete their tasks.
- **Creator Display**: Public todos show the creator's name and avatar.

### 3. Automated Reminders

- Built with **BullMQ** and **Redis**.
- When a todo is created with a deadline, the system automatically schedules reminders.
- Reminders are sent at specific intervals (3 days, 1 day, 1 hour before the deadline).
- Emails are delivered via **Maileroo**.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js installed
- Docker (optional, but recommended for Postgres/Redis)
- A Maileroo API key ([Get one here](https://maileroo.com))

### 1. Environment Setup

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5433/todo_app

# Redis
REDIS_URL=redis://localhost:6379

# Better Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Maileroo Email
MAILEROO_API_KEY=your_api_key_here
MAIL_FROM_EMAIL=noreply@yourdomain.maileroo.org
MAIL_FROM_NAME=TODO_APP
```

### 2. Database Sync

```bash
npm run db:push
```

### 3. Run the App

```bash
npm run dev
```

---

## 📧 Email System

### Testing Email Configuration

Run this command to verify your Maileroo setup:

```bash
node test-email.mjs
```

This will send a test email to your configured address.

### Testing Deadline Reminders

To test the reminder system:

```bash
node test-reminders.mjs
```

This schedules a test reminder that will send in 5 seconds.

### Email Features

1. **Welcome Email**: Sent automatically when a user registers
2. **Password Reset**: Sent when user requests password reset
3. **Deadline Reminders**: Sent at 3 days, 1 day, and 1 hour before a task deadline

---

## 🔍 Database Management (pgAdmin)

To view your users and todos in pgAdmin:

1.  Connect to your server (default is `localhost:5433`).
2.  Open the `todo_app` database.
3.  Navigate to **Schemas > public > Tables**.
4.  Right-click the `"user"` table and select **View/Edit Data > All Rows**.
    - _Note: Use double quotes `SELECT _ FROM "user";` as "user" is a reserved keyword.\*

---

## 📜 Development Commands

- `npm run dev`: Start Nuxt development server.
- `npm run db:push`: Sync Drizzle schema with the database.
- `npm run db:studio`: Open Drizzle's visual table editor.
- `node test-email.mjs`: Test email configuration.
- `node test-reminders.mjs`: Test reminder system.

---

## 🎨 UI Features

- **Responsive Navigation**: Desktop menu with mobile hamburger dropdown
- **User Avatar**: Shows logged-in user with email in dropdown
- **Dark Mode**: Full dark mode support
- **Real-time Updates**: Public todos refresh automatically
- **Permission Controls**: Only owners can modify their public tasks
