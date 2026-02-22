# Local Setup Guide

1. **Prerequisites**
   - Node.js 18+
   - npm or pnpm
   - PostgreSQL database (Local or managed like Supabase)

2. **Installation**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   POSTGRES_PRISMA_URL="postgresql://user:pass@localhost:5432/kaiseki?schema=public"
   POSTGRES_URL_NON_POOLING="postgresql://user:pass@localhost:5432/kaiseki?schema=public"
   ```

4. **Database Initialization**
   Run Prisma migrations to set up the tables:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Access the dashboard at `http://localhost:3000`.

> **Note:** For MVP testing, the `/overview` dashboard will show mocked data if no project or sessions exist.
