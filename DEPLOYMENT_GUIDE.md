# Yassah Accounting Firm - Deployment Guide

This guide will help you deploy the complete system to production hosting platforms.

## System Architecture

- **Backend API**: Node.js/Express server (Render.com)
- **Client Website**: Static HTML/CSS/JS (Netlify)
- **Admin Dashboard**: Static HTML/CSS/JS (Netlify)

## Prerequisites

1. GitHub account (for Render deployment)
2. Netlify account (for frontend hosting)
3. All code prepared in the `yassah Folder` directory

## Step 1: Deploy Backend to Render.com

### 1.1 Create GitHub Repository
1. Go to https://github.com and sign in
2. Click "New repository"
3. Name it: `yassah-server`
4. Make it public or private (your choice)
5. Click "Create repository"

### 1.2 Push Backend Code to GitHub
```bash
cd "c:\Users\Abass\Documents\yassah Folder\yassah-server"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yassah-server.git
git push -u origin main
```

### 1.3 Deploy to Render
1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub account
4. Select the `yassah-server` repository
5. Configure deployment:
   - **Name**: yassah-server
   - **Branch**: main
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `node server-json.js`
   - **Instance Type**: Free
6. Click "Create Web Service"
7. Wait for deployment (2-3 minutes)
8. Copy the URL (e.g., `https://yassah-server.onrender.com`)

### 1.4 Update CORS Origins (if needed)
If your Netlify URLs are different, update `server-json.js`:
```javascript
app.use(cors({
  origin: ['YOUR_CLIENT_URL', 'YOUR_ADMIN_URL', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

## Step 2: Deploy Client Website to Netlify

### 2.1 Prepare Client Files
```bash
cd "c:\Users\Abass\Documents\yassah Folder\yassah"
# Remove unnecessary files for deployment
rm -rf node_modules dist .gitignore package.json package-lock.json vite.config.js tailwind.config.js postcss.config.js
```

### 2.2 Deploy via Netlify Drag & Drop
1. Go to https://netlify.com and sign up
2. Click "Add new site" → "Deploy manually"
3. Drag the `yassah` folder into the upload area
4. Wait for deployment
5. Copy the URL (e.g., `https://yassah-accounting.netlify.app`)

### 2.3 Update API URL (if needed)
The client website already has dynamic API URL configuration, but if your Render URL is different, update `script.js`:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'YOUR_RENDER_URL/api';
```

## Step 3: Deploy Admin Dashboard to Netlify

### 3.1 Deploy via Netlify Drag & Drop
1. In Netlify, click "Add new site" → "Deploy manually"
2. Drag the `yassah-admin` folder into the upload area
3. Wait for deployment
4. Copy the URL (e.g., `https://yassah-admin.netlify.app`)

### 3.2 Update API URL (if needed)
The admin dashboard already has dynamic API URL configuration, but if your Render URL is different, update `admin.js`:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'YOUR_RENDER_URL/api';
```

## Step 4: Test Production Deployment

### 4.1 Test Backend
- Visit your Render URL: `https://yassah-server.onrender.com/api/health`
- Should return: `{"status":"OK","message":"Server is running","storage":"JSON files"}`

### 4.2 Test Client Website
- Visit your Netlify client URL
- Try submitting a newsletter subscription
- Check browser console for errors

### 4.3 Test Admin Dashboard
- Visit your Netlify admin URL
- Login with: `admin` / `admin123`
- Check if data appears in the dashboard

## Important Notes

### Free Tier Limitations
- **Render Free Tier**: Spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)
- **Netlify Free Tier**: No limitations for static sites
- **JSON File Storage**: Data persists but may be lost if Render rebuilds the container

### Production Recommendations
1. **Use MongoDB Atlas** instead of JSON files for reliable data storage
2. **Implement proper authentication** with JWT tokens
3. **Add rate limiting** to prevent API abuse
4. **Use environment variables** for sensitive data
5. **Set up monitoring** with tools like Sentry or LogRocket

### Custom Domain (Optional)
1. Purchase a domain (e.g., yassah-accounting.com)
2. Add custom domain in Netlify for both sites
3. Add custom domain in Render for the API
4. Update DNS records as instructed by the platforms

## Troubleshooting

### CORS Errors
- Ensure your Render URL is in the CORS origins list
- Check that the frontend URLs are correct in server-json.js

### API Not Responding
- Check Render dashboard for deployment status
- View logs in Render to see error messages
- Ensure the server is using the correct port (process.env.PORT)

### Data Not Saving
- JSON file storage may not persist across deployments
- Consider upgrading to MongoDB Atlas for production
- Check Render logs for file system errors

## Next Steps

1. **Deploy to production** using this guide
2. **Test all functionality** in the live environment
3. **Set up custom domains** if needed
4. **Monitor performance** and user feedback
5. **Plan for scaling** as the user base grows

## Support

- Render Documentation: https://render.com/docs
- Netlify Documentation: https://docs.netlify.com
- Node.js Documentation: https://nodejs.org/docs
