# 🚀 MERN Auth Deployment Guide

I have refactored the project and pushed it to your GitHub repository: [mern-auth](https://github.com/hanisha-senthilkumar/mern-auth).

The project is now optimized for a **One-Server Deployment**, where the backend serves the frontend. This is the most efficient way to deploy a MERN app.

## 📦 Deployment on Render

I recommend using [Render](https://render.com/) for deployment. It's free and supports MERN apps out of the box.

### **Step 1: Create a Web Service**
1. Sign in to **Render**.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `hanisha-senthilkumar/mern-auth`.

### **Step 2: Configure Build Settings**
- **Runtime**: `Node`
- **Build Command**: `npm run render-build` (This is defined in the root `package.json`)
- **Start Command**: `npm start`

### **Step 3: Set Environment Variables**
Go to the **Environment** tab in Render and add the following variables:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | *Your MongoDB Connection String* |
| `JWT_SECRET` | *A random secret string* |
| `SMTP_USER` | *Your SMTP Username (e.g. Brevo)* |
| `SMTP_PASSWORD` | *Your SMTP Password* |
| `SENDER_EMAIL` | *The email address to send from* |

### **Step 4: Deploy**
Click **Create Web Service**. Render will now build and deploy your application.

---

## 🛠️ Local Development

To run the project locally, use the following commands from the root directory:

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Run both Frontend and Backend**:
   ```bash
   npm run dev
   ```

---

## ✅ Changes Made
- **Code Cleanup**: Removed redundant `backend` folder and tracked `node_modules`.
- **Git History**: Cleaned the git history to remove sensitive info (SMTP passwords) that were blocking the push.
- **Root package.json**: Added a root configuration to manage both client and server easily.
- **Production Ready**: Updated `server.js` to serve the frontend build automatically in production.
- **Dynamic API**: Updated the frontend to automatically detect the backend URL, making it compatible with any hosting provider.
