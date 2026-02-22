# Vercel Deployment Guide

Deploying Kaiseki OS to Vercel is highly recommended for optimal performance and integration.

1. **Push to GitHub**
   Ensure your codebase is pushed to a GitHub repository.

2. **Connect to Vercel**
   - Import the repository in the Vercel dashboard.
   - Framework preset: Next.js

3. **Database Configuration**
   - Navigate to the Storage tab in your Vercel project setting.
   - Provision a "Vercel Postgres" database.
   - Vercel will automatically inject `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` into your Environment Variables.

4. **Deploy**
   - Click deploy! Vercel will run `npm run build` and Prisma client will be generated automatically if configured.
   - *Note:* Make sure to add `prisma generate && prisma migrate deploy` to your build script in `package.json` for automated migrations:

   ```json
   "build": "prisma generate && prisma migrate deploy && next build"
   ```

5. **Post-Deployment**
   - Obtain your initial Project Key from the database.
   - Provide the key to users to integrate the `sdk.js` into their sites.
