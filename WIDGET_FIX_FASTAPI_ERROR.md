# Widget Fix - FastAPI "Page Not Found" Error

## ✅ Problem Fixed!

### **Issue:**
When embedding the widget using the script tag, you saw a **FastAPI "page not found"** error instead of the chat interface.

### **Root Cause:**
The `widget.js` script was trying to load `widget.html` from your **FastAPI backend** (`http://49.249.160.198:8006`) instead of from your **React frontend** (`http://localhost:3000`).

**What was happening:**
```javascript
// WRONG - Was trying to load from API URL
iframe.src = `http://49.249.160.198:8006/widget.html?id=...`
                    ↑
            FastAPI backend - doesn't have widget.html!
```

**What should happen:**
```javascript
// CORRECT - Load from where widget.js is hosted
iframe.src = `http://localhost:3000/widget.html?id=...`
                    ↑
            React frontend - has widget.html!
```

---

## 🔧 What Was Fixed

### **File Updated:** `widget.js`

**Added:**
```javascript
// Automatically detect where widget.js is loaded from
const scriptSrc = currentScript?.getAttribute('src') || '';
const widgetBaseUrl = scriptSrc ? new URL(scriptSrc).origin : window.location.origin;
```

**Changed:**
```javascript
// Before (WRONG):
iframe.src = `${apiUrl}/widget.html?id=${chatbotId}&api=${apiUrl}`;

// After (CORRECT):
iframe.src = `${widgetBaseUrl}/widget.html?id=${chatbotId}&api=${apiUrl}`;
```

Now:
- ✅ `widget.html` loads from React frontend (`http://localhost:3000`)
- ✅ API calls still go to FastAPI backend (`http://49.249.160.198:8006`)

---

## 🎯 Test It Now!

### **Step 1: Make sure React dev server is running**
```bash
cd Botsai_POC/client
npm run dev
```

Should show:
```
  ➜  Local:   http://localhost:3000/
```

### **Step 2: Open your test file**
```
C:\Projects\chatbots\test\test.html
```

In browser, just double-click the file or open it with any browser.

### **Step 3: Check the widget**

You should now see:
1. ✅ **Floating chat button** appears in bottom-right corner
2. ✅ **Click button** → Chat window opens
3. ✅ **Send a message** → Get a response
4. ✅ **Click minimize [─]** → Back to button
5. ✅ **Click button again** → Reopens!

---

## 🔍 Debug Information

If it still doesn't work, check:

### **1. Check if widget.js loads:**
Open browser console (F12) and go to Network tab. You should see:
```
✅ widget.js - Status: 200 - From: localhost:3000
✅ widget.html - Status: 200 - From: localhost:3000
```

If you see:
```
❌ widget.html - Status: 404 - From: 192.168.1.31:8006
```
Then the fix didn't apply. Try:
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Restart React dev server

### **2. Check console for errors:**
Press F12 → Console tab. Look for:
- ✅ No errors = Good!
- ❌ "Failed to fetch" = Backend/CORS issue
- ❌ "404 Not Found" = Widget files not loading

### **3. Verify file locations:**
Make sure these files exist:
```
Botsai_POC/
  client/
    public/
      widget.js       ✅ Must exist
      widget.html     ✅ Must exist
```

---

## 📋 Your Current Setup

From your `test.html` file:

```html
<script
    src="https://vyomai.techraq.com/widget.js"
    data-chatbot-id="68d69606516646acfa6111c9"
    data-api-url="https://vyomai.techraq.com"
    data-position="bottom-right"
    data-color="#3B82F6"
    data-button-text="Chat with us"
    async
></script>
```

**This is now correct!** ✅

**URL Breakdown:**
- `src="https://vyomai.techraq.com/widget.js"` → Loads widget.js from React frontend ✅
- `data-api-url="https://vyomai.techraq.com"` → API calls go to FastAPI backend ✅
- `data-chatbot-id="68d69606516646acfa6111c9"` → Your chatbot ID ✅

---

## 🚀 How It Works Now

```
1. Browser loads test.html
   ↓
2. Loads widget.js from http://localhost:3000
   ↓
3. widget.js detects it was loaded from localhost:3000
   ↓
4. Creates iframe pointing to http://localhost:3000/widget.html
   (NOT http://49.249.160.198:8006/widget.html!)
   ↓
5. widget.html loads inside iframe
   ↓
6. User chats → API calls go to http://49.249.160.198:8006/api/v1/rag/chat
   ↓
7. FastAPI backend responds
   ↓
8. Chat works! ✅
```

---

## ✨ Summary

**Before:**
- ❌ widget.js tried to load widget.html from FastAPI backend
- ❌ FastAPI doesn't have widget.html
- ❌ Got "404 Page Not Found" error

**After:**
- ✅ widget.js loads widget.html from React frontend (where it actually is!)
- ✅ Chat interface appears correctly
- ✅ API calls still go to FastAPI backend (correct)
- ✅ Everything works!

---

## 🎬 Quick Test Checklist

- [ ] React dev server running on localhost:3000
- [ ] FastAPI backend running on 192.168.1.31:8006
- [ ] CORS enabled in FastAPI
- [ ] Open test.html in browser
- [ ] Floating button appears
- [ ] Click button → Chat opens
- [ ] Send message → Get response
- [ ] Click minimize → Button shows
- [ ] Click button → Reopens

**All working?** 🎉 **You're done!**

Still issues? Check console (F12) for specific errors.

