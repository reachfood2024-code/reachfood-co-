# Deploy ReachFood to Render

## Quick Deploy (Recommended)

### Step 1: Push to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Add backend and admin dashboard"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **New** > **Blueprint**
3. Connect your GitHub repository
4. Select your `REACHFOOD` repository
5. Render will detect the `render.yaml` and create:
   - PostgreSQL database (free tier)
   - Backend API service
   - Admin dashboard (static site)

### Step 3: Set Environment Variables

After deployment, go to each service and set:

**For `reachfood-api`:**
- `ADMIN_PASSWORD`: Set a secure password (e.g., `YourSecurePass123!`)

**For `reachfood-admin`:**
- `VITE_API_URL`: `https://reachfood-api.onrender.com/api`
  (Replace `reachfood-api` with your actual service name if different)

### Step 4: Run Database Migration

1. Go to your `reachfood-api` service on Render
2. Click **Shell** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

### Step 5: Access Your Apps

- **API**: `https://reachfood-api.onrender.com/api/health`
- **Admin**: `https://reachfood-admin.onrender.com`
- **Login**: `admin@reachfood.com` / (password you set)

---

## Manual Deploy (Alternative)

### 1. Create PostgreSQL Database

1. Render Dashboard > **New** > **PostgreSQL**
2. Name: `reachfood-db`
3. Plan: Free (or Starter $7/month for persistent)
4. Create and copy the **Internal Database URL**

### 2. Deploy Backend API

1. Render Dashboard > **New** > **Web Service**
2. Connect GitHub repo
3. Settings:
   - **Name**: `reachfood-api`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm run build && npm start`

4. Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=(paste from step 1)
   JWT_ACCESS_SECRET=(generate random 32+ chars)
   JWT_REFRESH_SECRET=(generate random 32+ chars)
   ADMIN_EMAIL=admin@reachfood.com
   ADMIN_PASSWORD=YourSecurePass123!
   ```

### 3. Deploy Admin Dashboard

1. Render Dashboard > **New** > **Static Site**
2. Connect same GitHub repo
3. Settings:
   - **Name**: `reachfood-admin`
   - **Root Directory**: `admin`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Environment Variables:
   ```
   VITE_API_URL=https://reachfood-api.onrender.com/api
   ```

5. Add Rewrite Rule:
   - Source: `/*`
   - Destination: `/index.html`

---

## Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| PostgreSQL | 256MB, expires 90 days | $7/month (Starter) |
| Backend API | 750 hrs/month, sleeps after 15min | $7/month (always on) |
| Admin Static | Unlimited | Free |

**Free Tier Total**: $0/month (with limitations)
**Recommended Paid**: $14/month (API + DB always on)

---

## Connect Your Frontend

Update your main frontend to use the API:

1. In Vercel (or wherever frontend is hosted), add:
   ```
   VITE_API_URL=https://reachfood-api.onrender.com/api
   ```

2. Or update `src/lib/api.ts` if hardcoding:
   ```typescript
   const API_BASE = 'https://reachfood-api.onrender.com/api';
   ```

---

## Troubleshooting

### API returns 500 error
- Check Render logs for the API service
- Verify DATABASE_URL is correct
- Run `npx prisma migrate deploy` in Shell

### Admin can't login
- Verify VITE_API_URL is set correctly (with `/api` at end)
- Check if database was seeded: run `npm run db:seed` in API shell
- Check browser console for CORS errors

### Database connection failed
- Free tier databases expire after 90 days
- Upgrade to Starter ($7/month) for persistent database

### Cold starts (slow first request)
- Free tier services sleep after 15min of inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to Starter ($7/month) for always-on
