# AI Coding Agent Instructions for autumn-dev

This project is a Next.js-based inventory and sales management system with Prisma ORM, Tailwind CSS, and NextAuth for authentication. Use these guidelines to be productive and follow project conventions.

## Key Build & Run Commands
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Lint:** `npm run lint`
- **Prisma Generate:** `npx prisma generate`
- **Prisma Migrate:** `npx prisma migrate dev`

## Project Structure
- **app/**: Next.js app directory (routes, layouts, API, auth)
- **components/**: UI, forms, dialogs, charts, tables, etc.
- **actions/**: Server actions for business logic
- **prisma/**: Prisma schema and migrations
- **lib/**: Utilities (db, axios, menu, etc.)
- **hooks/**: Custom React hooks
- **providers/**: React context providers
- **types/**: TypeScript types

## Conventions
- **TypeScript** is enforced throughout the codebase.
- **Zod** is used for schema validation in forms and APIs.
- **React Hook Form** for form state management.
- **NextAuth** for authentication, with roles (`ADMIN`, `USER`).
- **Tailwind CSS** for styling, with custom color variables in `tailwind.config.ts`.
- **ProtectedRoute** component restricts access by user role.
- **API routes** are colocated under `app/api/`.
- **Prisma models** are defined in `prisma/schema.prisma`.

## Documentation
- See [README.md](README.md) for getting started and deployment.
- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)
- Tailwind config: [tailwind.config.ts](tailwind.config.ts)

## Tips for Agents
- Always use TypeScript and follow strict typing.
- Use Zod for validation in new forms or APIs.
- Use the provided context providers for state/query management.
- When adding new features, follow the folder structure and naming conventions.
- For authentication/authorization, use NextAuth and the `ProtectedRoute` component.
- Link to existing documentation instead of duplicating content.

---

This file helps AI coding agents quickly understand the architecture, conventions, and key commands for this project. Update as the project evolves.