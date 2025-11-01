# Widget Authentication Fix Guide

## 🔴 Problem

Widget shows error: 
> "I'm having trouble connecting to the server. Error: API returned 401: {"detail":"Not authenticated"}"

## 🔍 Root Cause

Your FastAPI backend `/api/v1/rag/chat` endpoint **requires authentication**, but embedded widgets on external websites cannot authenticate (they don't have user tokens).

## ✅ Solution Options

### **Option 1: Make RAG Chat Endpoint Public (Recommended for Widgets)**

Make the `/rag/chat` endpoint accessible without authentication for public widgets.

#### Step 1: Update your FastAPI route

**Find your RAG chat route** (probably in `backend/app/api/routes/rag.py` or similar):

**BEFORE:**
```python
@router.post("/chat")
async def rag_chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)  # ❌ Requires authentication
):
    # Your chat logic
    ...
```

**AFTER:**
```python
@router.post("/chat")
async def rag_chat(
    request: ChatRequest
    # No authentication required! ✅
):
    # Your chat logic
    # You can still use chatbot_id to identify which bot to use
    ...
```

### **Option 2: Create Separate Public Widget Endpoint**

Keep the main endpoint protected, create a new public endpoint for widgets.

```python
@router.post("/chat")
async def rag_chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    # Protected endpoint for dashboard
    ...

@router.post("/widget/chat")
async def widget_chat(
    request: ChatRequest
    # Public endpoint for embedded widgets
):
    # Same logic, but no auth required
    # You might want to add rate limiting here
    ...
```

Then update widget to use `/api/v1/rag/widget/chat` instead.

### **Option 3: Use Widget-Specific Token**

Generate a special token for each chatbot that can be used publicly.

```python
@router.post("/chat")
async def rag_chat(
    request: ChatRequest,
    widget_token: Optional[str] = Header(None, alias="X-Widget-Token")
):
    if widget_token:
        # Validate widget token
        chatbot = verify_widget_token(widget_token)
    else:
        # Require user authentication
        current_user = await get_current_user()
    
    # Your chat logic
    ...
```

## 🚀 Quick Fix (Option 1 - Easiest)

### For FastAPI Backend:

1. **Find your RAG chat endpoint** (search for `@router.post("/chat")` or `@app.post("/api/v1/rag/chat")`)

2. **Remove authentication dependency:**

**Change this:**
```python
async def rag_chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
```

**To this:**
```python
async def rag_chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
```

3. **Restart your FastAPI server:**
```bash
# Stop the server (Ctrl+C)
# Then restart it
uvicorn main:app --reload --host 0.0.0.0 --port 8006
```

4. **Test the widget again** - It should now work!

## 🔒 Security Considerations

### If You Make the Endpoint Public:

1. **Rate Limiting:** Implement rate limiting to prevent abuse
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/chat")
@limiter.limit("10/minute")  # Max 10 requests per minute per IP
async def rag_chat(request: ChatRequest):
    ...
```

2. **CORS:** Make sure CORS is properly configured
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify allowed domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. **Usage Tracking:** Track usage per chatbot_id
```python
async def rag_chat(request: ChatRequest):
    # Track this request
    await log_widget_usage(
        chatbot_id=request.chatbot_id,
        ip_address=request.client.host,
        timestamp=datetime.now()
    )
    ...
```

4. **Chatbot Validation:** Verify the chatbot_id exists
```python
async def rag_chat(request: ChatRequest, db: Session = Depends(get_db)):
    # Verify chatbot exists
    chatbot = db.query(Chatbot).filter(Chatbot.id == request.chatbot_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    # Continue with chat logic
    ...
```

## 🧪 Testing After Fix

### Test 1: Direct Widget URL
```
http://localhost:3000/widget.html?id=YOUR_CHATBOT_ID&api=https://vyomai.techraq.com
```
- Should load without errors
- Should show chatbot name
- Should be able to send messages
- Should get real responses

### Test 2: Embedded Widget
```html
<!-- test.html -->
<!DOCTYPE html>
<html>
<body>
  <h1>Test Page</h1>
  <script
    src="https://vyomai.techraq.com/widget.js"
    data-chatbot-id="YOUR_CHATBOT_ID"
    data-api-url="https://vyomai.techraq.com"
    async
  ></script>
</body>
</html>
```
- Floating button should appear
- Click to open
- Should work without 401 error

### Test 3: Check Console
Open F12 console, you should see:
```
✅ Vyoma AI Widget initialized
✅ Chatbot ID: your_id
✅ API URL: https://vyomai.techraq.com
✅ Sending message to: https://vyomai.techraq.com/api/v1/rag/chat
✅ Response status: 200
✅ Response data: {answer: "...", session_id: "..."}
```

No more:
```
❌ API returned 401: {"detail":"Not authenticated"}
```

## 📝 Alternative: Keep Auth, Use Proxy

If you want to keep authentication for security, create a proxy:

```python
# Public endpoint that adds authentication internally
@router.post("/widget/chat")
async def widget_chat_proxy(request: ChatRequest, db: Session = Depends(get_db)):
    # Validate chatbot exists
    chatbot = get_chatbot(db, request.chatbot_id)
    if not chatbot:
        raise HTTPException(404, "Chatbot not found")
    
    # Use chatbot owner's context
    user_id = chatbot.user_id
    
    # Call your authenticated chat logic with chatbot owner's credentials
    return await internal_rag_chat(
        request=request,
        user_id=user_id,
        db=db
    )
```

## 🎯 Recommended Approach

**For Production:**
1. Create separate `/widget/chat` endpoint (public)
2. Keep `/chat` endpoint (authenticated, for dashboard)
3. Add rate limiting to public endpoint
4. Add usage tracking
5. Validate chatbot_id on every request

**For Development/Testing:**
1. Just remove auth from `/chat` endpoint temporarily
2. Test that widget works
3. Add proper authentication later

## 🔧 Files Modified (Widget Side)

✅ `client/public/widget.html` - Better error messages for 401
✅ `client/public/widget.js` - Close/minimize controls added
✅ Widget now shows clear error: "Authentication required. Please check your backend configuration"

## 📚 Next Steps

1. **Choose your approach** (Option 1, 2, or 3 above)
2. **Update your backend** accordingly
3. **Restart FastAPI server**
4. **Test the widget**
5. **Add rate limiting** (important for public endpoints)
6. **Monitor usage** to prevent abuse

## ❓ Still Having Issues?

### Check These:

1. **Is your backend running?**
   ```bash
   curl https://vyomai.techraq.com/api/v1/rag/chat
   ```

2. **Is CORS configured?**
   - Check browser console for CORS errors
   - Make sure your FastAPI has CORS middleware

3. **Is the endpoint path correct?**
   - Check your FastAPI routes
   - Make sure it's `/api/v1/rag/chat` not `/rag/chat`

4. **Is the request format correct?**
   ```json
   {
     "chatbot_id": "string",
     "query": "string",
     "session_id": "string"
   }
   ```

5. **Check FastAPI logs:**
   - Look for errors in your FastAPI console
   - Check what requests are coming in

## 💡 Pro Tip

To see exactly what's happening:

1. Open widget
2. Open browser console (F12)
3. Go to Network tab
4. Send a message
5. Click on the `/chat` request
6. See the full request/response

This will show you exactly what error you're getting!

---

**After applying the fix, your widget should work perfectly on any website without authentication errors!** 🎉

