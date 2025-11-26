# Nep Stay - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Option 1: Deploy Frontend and Backend Separately (Recommended)

#### Deploy Backend (Railway/Render)

**Railway:**
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
ADMIN_EMAIL=admin@nepstay.com
ADMIN_PASSWORD=your_password
CLIENT_URL=https://your-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```
6. Deploy!

**Render:**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your repository
4. Root directory: `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add the same environment variables as above

#### Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework Preset: **Vite**
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variable:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```
8. Deploy!

### Option 2: Monorepo on Vercel (Current Setup)

The `vercel.json` is configured for monorepo deployment, but Vercel's free tier has limitations with Node.js backends.

**Steps:**
1. Push code to GitHub
2. Import to Vercel
3. Set environment variables in Vercel dashboard:

**Frontend Environment Variables:**
```env
VITE_API_URL=/api
```

**Backend Environment Variables:**
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
ADMIN_EMAIL=admin@nepstay.com
ADMIN_PASSWORD=your_password
CLIENT_URL=https://your-project.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

## ⚠️ Important Security Steps

1. **Never commit `.env` files**
```bash
git rm --cached backend/.env frontend/.env
git commit -m "Remove .env files from git"
```

2. **Use `.env.example` as templates** (already created)

3. **Update CORS** - Already configured to accept your Vercel domain

## 🔍 Pre-Deployment Checklist

- ✅ `.gitignore` includes `.env` files
- ✅ CORS configured for production
- ✅ Build scripts added
- ✅ Vercel configuration created
- ✅ Environment example files created
- ⚠️ Remove actual `.env` files from git
- ⚠️ Set production environment variables
- ⚠️ Update `CLIENT_URL` in backend to match frontend URL

## 📝 Post-Deployment

1. Test all API endpoints
2. Verify admin login works
3. Test hostel CRUD operations
4. Check Google Maps integration
5. Monitor logs for errors

## 🆘 Troubleshooting

**CORS errors?**
- Add your Vercel domain to `allowedOrigins` in `backend/src/server.js`

**API not connecting?**
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend URL is accessible

**Database connection failed?**
- Verify MongoDB Atlas whitelist includes `0.0.0.0/0` for cloud deployments
- Check `MONGODB_URI` is correct

## 🌐 Recommended: Separate Deployments

For production, deploy:
- **Frontend**: Vercel
- **Backend**: Railway or Render (better for Node.js)

This avoids Vercel's serverless limitations and provides better performance.
