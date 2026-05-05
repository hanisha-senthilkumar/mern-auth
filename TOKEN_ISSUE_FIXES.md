# 🔐 Invalid Token Fix Guide

## ✅ Issues Fixed

### **1. .env File Format Issue - FIXED**
The `.env` file had quotes around values which can cause JWT_SECRET to include the quotes.

**Before:**
```dotenv
JWT_SECRET='secret#text'
MONGODB_URI='mongodb+srv://...'
```

**After:**
```dotenv
JWT_SECRET=secret#text
MONGODB_URI=mongodb+srv://...
PORT=4000
```

✅ Removed all unnecessary quotes from `.env` variables

### **2. Middleware Error Handling - IMPROVED**
Updated `userAuth.js` middleware with better error messages:

- ✅ Better error messages for debugging
- ✅ Distinguishes between token expired vs token invalid
- ✅ Console logging for server-side debugging
- ✅ Proper token flow

---

## 🔍 Troubleshooting Checklist

### **If you still get "Invalid Token" error:**

1. **Restart Backend Server**
   ```bash
   cd server
   npm install  # Install dependencies
   node server.js  # Restart
   ```
   - Changes to `.env` require server restart!
   - Node.js caches environment variables

2. **Clear Browser Cookies & Restart Frontend**
   - Open DevTools → Application → Cookies → Delete all localhost cookies
   - Clear browser cache (Ctrl+Shift+Delete)
   - Restart frontend: `npm run dev`

3. **Verify JWT_SECRET**
   - Open browser DevTools → Network tab
   - Make a login request and check the response
   - If you see "Invalid token", the JWT_SECRET might still be wrong

4. **Check Backend Logs**
   - Look for error messages in terminal where backend is running
   - The new middleware will log: `Token verification error: ...`

### **Debug Flow:**

```
User Logs In (Login.jsx)
    ↓
Send credentials to /api/auth/login
    ↓
Backend creates JWT token with JWT_SECRET
    ↓
Backend sets cookie with token
    ↓
Frontend receives success response
    ↓
Browser stores token in cookies
    ↓
On next page load, AppContext calls /api/auth/is-auth
    ↓
Middleware reads token from cookie
    ↓
Middleware verifies token with JWT_SECRET
    ↓
If JWT_SECRET doesn't match → "Invalid Token" error
```

---

## 🚀 Correct Setup Steps

### **Step 1: Update .env (CRITICAL)**
Edit `server/.env` - Remove ALL quotes:
```dotenv
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SENDER_EMAIL=your_sender_email
PORT=4000
```

### **Step 2: Restart Backend**
```bash
# Kill old process (Ctrl+C in terminal)
# Then restart:
cd server
node server.js
```

### **Step 3: Clear Frontend Cache**
- DevTools → Application → Clear all cookies/storage
- Or open in Incognito/Private window

### **Step 4: Test Login Flow**
1. Go to login page (http://localhost:5173/login)
2. Register or login with credentials
3. Check console for any errors
4. Should redirect to home page

---

## 📋 Files Modified

1. **server/.env** - Removed quotes from all variables
2. **server/middleware/userAuth.js** - Enhanced error handling and logging

---

## 🔧 If Problem Persists:

### **Check these in order:**

1. **Verify PORT is correct**
   - Backend running on port 4000? → Check terminal output
   - Frontend ENV has: `VITE_BACKEND_URL='http://localhost:4000'`

2. **Check CORS cookies setting**
   - In `server/server.js`:
   ```javascript
   app.use(cors({
     origin: allowedOrigins,
     credentials: true,  // ✅ Must be true
   }));
   ```

3. **Verify Axios withCredentials**
   - In `client/src/context/AppContext.jsx`:
   ```javascript
   axios.defaults.withCredentials = true;
   ```

4. **Test Manual API Call**
   - Open terminal and run:
   ```bash
   curl -X GET http://localhost:4000/api/auth/is-auth -H "Cookie: token=YOUR_TOKEN"
   ```

---

## 💡 Additional Tips

- **Keep JWT_SECRET simple** - avoid special characters for now
- **Use same NODE_ENV** across requests (should be 'development')
- **Check MongoDB connection** - if that fails, auth might fail too
- **Enable CORS with credentials** - required for cookies to work

**If still stuck:** Check server terminal logs for exact error message! 🔍
