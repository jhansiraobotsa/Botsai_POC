# Complete Widget Fix Guide

## 🎯 What You Want

**Perfect Widget Flow:**
```
1. Page loads → Floating chat button appears (bottom-right)
2. User clicks button → Chat window opens
3. User clicks [─] minimize → Chat closes, button remains
4. User clicks button again → Chat reopens!
```

## 🔴 Current Issues

### Issue 1: "Failed to fetch" Error
**Error:** `I'm having trouble connecting to the server. Error: Failed to fetch`

**Causes:**
- Backend not running
- CORS not enabled
- Wrong API URL
- Network/firewall blocking

### Issue 2: Minimize Not Working
**Problem:** Widget doesn't close properly when minimize is clicked

## ✅ Complete Solution

### Step 1: Use the Correct Widget Type

There are 2 ways to embed the widget:

#### **Option A: Popup Widget (RECOMMENDED - This is what you want!)**
```html
<!-- Floating button that opens/closes -->
<script
  src="https://vyomai.techraq.com/widget.js"
  data-chatbot-id="YOUR_CHATBOT_ID"
  data-api-url="https://vyomai.techraq.com"
  data-position="bottom-right"
  async
></script>
```

**This gives you:**
- ✅ Floating button
- ✅ Click to open
- ✅ Click minimize to close
- ✅ Button stays on page

#### **Option B: Direct Iframe (Always visible)**
```html
<!-- Chat always visible, no button -->
<iframe src="http://localhost:3000/widget.html?id=YOUR_ID&api=https://vyomai.techraq.com"
        width="400" height="600"></iframe>
```

**This gives you:**
- Always visible chat window
- No open/close button
- Not what you want!

**USE OPTION A (widget.js)!**

---

### Step 2: Fix Backend CORS (Required!)

The "Failed to fetch" error is because your backend doesn't allow requests from your frontend.

**Add this to your FastAPI backend:**

```python
# In your main FastAPI file (main.py or app.py)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware BEFORE your routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify: ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Your routes here...
@app.get("/")
async def root():
    return {"message": "Hello World"}
```

**Then restart your backend:**
```bash
# Stop FastAPI (Ctrl+C)
# Start again
uvicorn main:app --reload --host 0.0.0.0 --port 8006
```

---

### Step 3: Fix Authentication (If needed)

If you still get 401 errors, remove authentication from the chat endpoint:

```python
# Change this:
@router.post("/chat")
async def rag_chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),  # ❌ Remove this!
    db: Session = Depends(get_db)
):

# To this:
@router.post("/chat")
async def rag_chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
```

---

### Step 4: Test the Widget

**Use the test page I created:**

1. **Open:** `http://localhost:3000/test-popup-widget.html`

2. **First, update the chatbot ID:**
   - Open the file
   - Find `data-chatbot-id="YOUR_CHATBOT_ID"`
   - Replace with your actual chatbot ID

3. **Check the flow:**
   ```
   ✅ Floating button appears (bottom-right)
   ✅ Click button → Chat opens
   ✅ Click [─] minimize → Chat closes
   ✅ Button still visible
   ✅ Click button again → Chat reopens!
   ```

---

## 🔍 Debugging Guide

### Check 1: Is the floating button visible?

**Look at bottom-right corner of page.**

- ✅ **YES:** Button is working! Try clicking it.
- ❌ **NO:** Check browser console (F12) for errors.

### Check 2: Does clicking button open chat?

**Click the floating button.**

- ✅ **YES:** Chat opens! Now try the minimize button.
- ❌ **NO:** Check console for errors. Widget.js might not be loading.

### Check 3: Are minimize/close buttons visible?

**When chat is open, look at top-right of chat header.**

- ✅ **YES:** You should see [─] and [×] buttons.
- ❌ **NO:** You might be using old version. Clear cache.

### Check 4: Does minimize work?

**Click the [─] minimize button in chat header.**

- ✅ **YES:** Chat closes, button stays visible.
- ❌ **NO:** Check console for postMessage errors.

### Check 5: Can you reopen?

**Click the floating button again.**

- ✅ **YES:** Perfect! Everything works!
- ❌ **NO:** Check if button is still there. Try refreshing page.

---

## 🐛 Common Errors & Fixes

### Error: "Failed to fetch"

**Console shows:**
```
Error: Failed to fetch
```

**Solutions:**
1. ✅ Check if backend is running: `curl https://vyomai.techraq.com`
2. ✅ Enable CORS in FastAPI (see Step 2 above)
3. ✅ Check API URL in widget code
4. ✅ Check firewall/network

**Test backend:**
```bash
curl https://vyomai.techraq.com/api/v1/rag/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"chatbot_id":"test","query":"hello","session_id":""}'
```

---

### Error: "401 Not authenticated"

**Console shows:**
```
API returned 401: {"detail":"Not authenticated"}
```

**Solution:**
Remove authentication from `/api/v1/rag/chat` endpoint (see Step 3 above)

---

### Error: Widget button not appearing

**Console shows:**
```
(Nothing, or "script not found")
```

**Solutions:**
1. ✅ Check if using `widget.js` (not `widget.html`)
2. ✅ Verify script src URL: `http://localhost:3000/widget.js`
3. ✅ Make sure React dev server is running
4. ✅ Check if file exists: Open `http://localhost:3000/widget.js` in browser

---

### Error: Minimize button doesn't work

**Click minimize, nothing happens:**

**Solutions:**
1. ✅ Clear browser cache
2. ✅ Make sure using updated `widget.html` and `widget.js`
3. ✅ Check console for postMessage errors
4. ✅ Try the test page: `test-popup-widget.html`

---

### Error: CORS policy error

**Console shows:**
```
Access to fetch at 'https://vyomai.techraq.com/api/v1/rag/chat' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
Add CORS middleware to FastAPI (see Step 2 above)

---

## 📋 Complete Checklist

Before embedding on your website, verify:

### Backend:
- [ ] FastAPI is running on https://vyomai.techraq.com
- [ ] CORS middleware is added
- [ ] `/api/v1/rag/chat` endpoint works without auth
- [ ] Can access backend from browser: `https://vyomai.techraq.com`

### Frontend:
- [ ] React dev server is running on http://localhost:3000
- [ ] `widget.js` file exists and is accessible
- [ ] `widget.html` file exists and is accessible
- [ ] Test page works: `http://localhost:3000/test-popup-widget.html`

### Widget:
- [ ] Floating button appears
- [ ] Clicking button opens chat
- [ ] [─] minimize button visible in chat header
- [ ] Clicking minimize closes chat
- [ ] Button remains visible after minimize
- [ ] Clicking button again reopens chat
- [ ] Can send messages and get responses

---

## 🎬 Step-by-Step Test

1. **Start backend:**
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8006
   ```

2. **Start frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Open test page:**
   ```
   http://localhost:3000/test-popup-widget.html
   ```

4. **Update chatbot ID in the page**

5. **Test the flow:**
   - See floating button? ✅
   - Click button → Opens? ✅
   - See [─] button in header? ✅
   - Click minimize → Closes? ✅
   - Button still visible? ✅
   - Click button → Reopens? ✅
   - Send message → Get response? ✅

---

## 🚀 Embed on Your Website

Once everything works on the test page:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>My Website Content</h1>
  <p>Your content here...</p>

  <!-- Add this before </body> tag -->
  <script
    src="https://vyomai.techraq.com/widget.js"
    data-chatbot-id="YOUR_ACTUAL_CHATBOT_ID"
    data-api-url="https://vyomai.techraq.com"
    data-position="bottom-right"
    data-color="#6366f1"
    data-button-text="Chat with us"
    async
  ></script>
</body>
</html>
```

**Replace:**
- `YOUR_ACTUAL_CHATBOT_ID` → Your chatbot ID from database
- `http://localhost:3000` → Your production frontend URL
- `https://vyomai.techraq.com` → Your production backend URL

---

## 💻 Control Widget from JavaScript

```javascript
// Open widget
window.VyomaWidget.open();

// Close widget
window.VyomaWidget.close();

// Toggle widget
window.VyomaWidget.toggle();

// Check if open
if (window.VyomaWidget.isOpen()) {
  console.log('Widget is open!');
}
```

---

## 📞 Still Having Issues?

### Open Browser Console (F12)

Look for these specific errors:

1. **"Failed to fetch"** → Backend/CORS issue
2. **"401"** → Authentication issue
3. **"404"** → Wrong URL/endpoint
4. **"script not found"** → Widget.js path wrong
5. **CORS error** → Add CORS middleware

### Check Network Tab

1. Open F12 → Network tab
2. Click widget button
3. Send a message
4. Look for `/rag/chat` request
5. Check:
   - Status code (should be 200)
   - Response (should have "answer")
   - Headers (CORS headers present?)

---

## ✨ Summary

**Use this embed code (widget.js for popup behavior):**
```html
<script src="https://vyomai.techraq.com/widget.js"
        data-chatbot-id="YOUR_ID"
        data-api-url="https://vyomai.techraq.com"
        async></script>
```

**NOT this (widget.html for always visible):**
```html
<iframe src="http://localhost:3000/widget.html?id=YOUR_ID"></iframe>
```

**Add CORS to FastAPI:**
```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```

**Test here:**
```
http://localhost:3000/test-popup-widget.html
```

**You should get:**
```
Button → Click → Opens → Minimize → Closes → Button → Click → Reopens! ✅
```

That's the correct flow! 🎉

