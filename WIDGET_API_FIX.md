# Widget API Fix - Summary

## ❌ Problem
When you embedded the widget on your website, it showed a hardcoded error message:
> "I apologize, but I'm having trouble connecting right now. Please try again in a moment."

Instead of connecting to your FastAPI backend and getting real responses.

## ✅ Solution
Updated the widget to use the **exact same API endpoint** as the chat interface in your dashboard.

## 🔧 Changes Made

### 1. **Updated `widget.html`** (client/public/widget.html)

**Before:**
```javascript
// Generic error handling with hardcoded message
const response = await fetch(`${apiUrl}/api/v1/rag/chat`, { ... });
const data = await response.json();
addMessage(data.answer || 'I apologize, but I encountered an error.', 'bot');
```

**After:**
```javascript
// Matches chat interface exactly
const response = await fetch(`${apiUrl}/api/v1/rag/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  },
  body: JSON.stringify({
    chatbot_id: chatbotId,
    query: message,
    session_id: sessionId || ''
  })
});

// Better error handling with console logging
console.log('Response data:', data);
const botResponse = data.answer || data.response || data.message || 'Error...';
addMessage(botResponse, 'bot');
```

### 2. **Updated Default API URL**

**Before:** `http://localhost:8006`  
**After:** `http://49.249.160.198:8006` (matches your backend from api-config.ts)

### 3. **Added Debug Logging**

Now the widget logs:
- Request URL
- Request payload
- Response status
- Response data
- Any errors with full details

This helps you see exactly what's happening!

### 4. **Updated Embed Code Generator**

The "Embed & Export" tab now generates code with the correct API URL (`http://49.249.160.198:8006`).

## 🧪 How to Test

### Option 1: Quick Test (Direct Widget)
1. Open: `http://localhost:3000/widget.html?id=YOUR_CHATBOT_ID&api=http://49.249.160.198:8006`
2. Type a message
3. Check browser console (F12) for API calls
4. Should see real responses from your backend!

### Option 2: Test Page (With Popup Button)
1. Open: `http://localhost:3000/test-widget.html`
2. Edit the file and replace `YOUR_CHATBOT_ID` with your actual chatbot ID
3. Click the floating chat button
4. Send a message
5. Check console for logs

### Option 3: Embed on Your Website
1. Go to your chatbot → "Embed & Export" tab
2. Copy the "Popup Widget" code
3. Paste before `</body>` tag on your website
4. The code now has the correct API URL!

## 📊 What the API Call Looks Like Now

**Endpoint:** `http://49.249.160.198:8006/api/v1/rag/chat`

**Request:**
```json
{
  "chatbot_id": "your_chatbot_id",
  "query": "Hello!",
  "session_id": ""
}
```

**Response (Expected):**
```json
{
  "answer": "Hi! How can I help you?",
  "session_id": "some_session_id"
}
```

## 🔍 Debugging

Open browser console (F12) and you'll now see:
```
Sending message to: http://49.249.160.198:8006/api/v1/rag/chat
Payload: {chatbot_id: "123", query: "test", session_id: ""}
Response status: 200
Response data: {answer: "...", session_id: "..."}
Session ID updated: abc123
```

If there's an error, you'll see:
```
API Error Response: {...}
Error details: {...}
```

## ⚙️ Make Sure Your Backend Has CORS Enabled

Add this to your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## ✅ Checklist

- [x] Widget uses same API endpoint as chat interface
- [x] Widget uses same request format (chatbot_id, query, session_id)
- [x] Widget handles same response format (data.answer)
- [x] Widget logs all API calls for debugging
- [x] API URL updated to match your backend (192.168.1.31:8006)
- [x] Embed code generator updated with correct URL
- [x] Test page created for easy testing

## 🎯 Next Steps

1. **Test it:** Open the test page or widget URL
2. **Check console:** Open F12 and see the API calls
3. **Send a message:** Type something and hit send
4. **Verify response:** You should get a real response from your backend!

If you still see errors:
- Check the console logs (they now show detailed error messages)
- Verify your FastAPI backend is running
- Check CORS settings
- Make sure the chatbot_id exists in your database

The widget should now work exactly like the chat interface in your dashboard! 🚀

