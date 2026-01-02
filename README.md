# ProjectFlow

A modern SaaS project management application built with Next.js, featuring intuitive Kanban boards, real-time collaboration, and powerful task management tools.

## Features

- 🎯 **Kanban Boards** - Visualize your workflow with intuitive drag-and-drop kanban boards
- 👥 **Team Collaboration** - Work together seamlessly with real-time updates, comments, and @mentions
- 📅 **Due Date Tracking** - Never miss a deadline with smart reminders and calendar integrations
- 📊 **Analytics & Reports** - Get insights into team productivity with detailed analytics and custom reports
- ⚡ **Automations** - Save time with powerful automations that handle repetitive tasks
- 🔒 **Enterprise Security** - Bank-grade encryption and compliance certifications to keep your data safe

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with [Neon Database](https://neon.tech/)
- **Authentication**: Custom session-based authentication with bcrypt
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Neon Database account (or any PostgreSQL database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saas-project-management
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=your_database_connection_string
# Add other required environment variables
```

4. Set up the database:
Run the database migration scripts in the `scripts/` directory:
- `001-init-schema.sql` - Initial database schema
- `002-seed-data.sql` - Seed data (optional)
- `003-add-invitations.sql` - Invitations schema (optional)

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register, forgot-password)
│   ├── dashboard/         # Dashboard and main application pages
│   │   ├── projects/      # Project management pages
│   │   ├── team/          # Team management
│   │   └── settings/      # User settings
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── landing/           # Landing page components
│   └── ui/                # Reusable UI components
├── lib/                   # Core utilities and logic
│   ├── actions/           # Server actions
│   ├── auth/              # Authentication utilities
│   ├── db/                # Database configuration and schema
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
├── scripts/               # Database migration scripts
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.


