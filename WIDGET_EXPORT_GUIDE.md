# Widget Export & Embed Guide - Complete Solution

## ✅ Problem Solved!

**Issue:** When exporting the widget (iframe or script), the minimize button didn't show a way to reopen the chat.

**Solution:** Now ALL embed methods support the full flow:
```
Widget/Chat → Click Minimize [─] → Shows Button → Click Button → Reopens!
```

---

## 🎯 Test All Methods

### **Open this page to test:**
```
http://localhost:3000/test-all-embed-methods.html
```

This page lets you test all 3 embedding methods side-by-side!

---

## 📦 Three Embedding Methods

### **Method 1: Popup Widget (RECOMMENDED)** ⭐

**What it does:**
- Floating button appears in corner
- Click → Chat opens
- Minimize → Back to button
- Click button → Reopens

**Code:**
```html
<!-- Vyoma AI Popup Widget -->
<script
  src="http://localhost:3000/widget.js"
  data-chatbot-id="YOUR_CHATBOT_ID"
  data-api-url="http://192.168.1.31:8006"
  data-position="bottom-right"
  data-color="#6366f1"
  async
></script>
```

**When to use:**
- ✅ Most websites
- ✅ Non-intrusive
- ✅ Best user experience
- ✅ Most flexible

---

### **Method 2: Iframe Embed**

**What it does:**
- Chat is always visible (no initial button)
- Click minimize [─] → Chat hides, button appears
- Click button → Chat reopens

**Code:**
```html
<!-- Vyoma AI Iframe Embed -->
<iframe
  src="http://localhost:3000/widget.html?id=YOUR_CHATBOT_ID&api=http://192.168.1.31:8006"
  width="400"
  height="600"
  frameborder="0"
  style="position: fixed; bottom: 20px; right: 20px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 9999;"
></iframe>
```

**When to use:**
- ✅ Help centers
- ✅ Documentation pages
- ✅ When you want chat always visible
- ✅ Landing pages with prominent support

---

### **Method 3: Custom Script**

**What it does:**
- Same as iframe, but loaded via JavaScript
- Good for dynamic/programmatic loading

**Code:**
```html
<!-- Vyoma AI Custom Script -->
<script>
(function() {
  var iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000/widget.html?id=YOUR_CHATBOT_ID&api=http://192.168.1.31:8006';
  iframe.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 9999;';
  document.body.appendChild(iframe);
})();
</script>
```

**When to use:**
- ✅ A/B testing
- ✅ Conditional loading
- ✅ Dynamic injection
- ✅ Advanced use cases

---

## 🎬 How Each Method Works

### **Method 1 (Popup):**
```
Page loads
    ↓
Floating button appears (bottom-right)
    ↓
User clicks button
    ↓
Chat window slides up
    ↓
User clicks [─] minimize
    ↓
Chat slides down, button stays
    ↓
User clicks button again
    ↓
Chat slides up again!
```

### **Method 2 & 3 (Iframe/Script):**
```
Page loads
    ↓
Chat window visible immediately
    ↓
User clicks [─] minimize
    ↓
Chat disappears, small button appears
    ↓
User clicks button
    ↓
Chat reappears!
```

---

## 🔧 Setup Steps

### **Step 1: Get Your Chatbot ID**

1. Go to your dashboard
2. Open your chatbot
3. Go to "Embed & Export" tab
4. Copy the chatbot ID (or look in the URL)

### **Step 2: Choose Embedding Method**

**For most websites → Use Method 1 (Popup Widget)**

### **Step 3: Copy the Code**

From the "Embed & Export" tab in your dashboard, or use the codes above.

### **Step 4: Replace Placeholders**

Replace:
- `YOUR_CHATBOT_ID` → Your actual chatbot ID
- `http://localhost:3000` → Your production URL (when deploying)
- `http://192.168.1.31:8006` → Your production API URL

### **Step 5: Paste Before `</body>`**

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>My Website Content</h1>
  <p>Your content here...</p>

  <!-- PASTE WIDGET CODE HERE -->
  <script src="http://localhost:3000/widget.js" 
          data-chatbot-id="abc123" 
          data-api-url="http://192.168.1.31:8006" 
          async></script>
</body>
</html>
```

---

## 🎯 Complete Flow Demonstration

### **Example 1: Popup Widget on E-commerce Site**

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Store</title>
</head>
<body>
  <header>
    <h1>Welcome to My Store</h1>
  </header>
  
  <main>
    <h2>Products</h2>
    <!-- Your products here -->
  </main>

  <!-- Vyoma AI Widget - Floating Button -->
  <script src="http://localhost:3000/widget.js"
          data-chatbot-id="store123"
          data-api-url="http://192.168.1.31:8006"
          data-position="bottom-right"
          async></script>
</body>
</html>
```

**Result:**
- Small button in corner
- Customers can click to ask questions
- They can minimize when done
- Button stays for easy access

---

### **Example 2: Iframe on Help Center**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Help Center</title>
</head>
<body>
  <h1>How can we help?</h1>
  <p>Search our documentation or chat with our AI assistant!</p>

  <!-- Vyoma AI Widget - Always Visible -->
  <iframe 
    src="http://localhost:3000/widget.html?id=help123&api=http://192.168.1.31:8006"
    width="400"
    height="600"
    style="position: fixed; bottom: 20px; right: 20px; border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 9999;"
  ></iframe>
</body>
</html>
```

**Result:**
- Chat always visible
- Users can get help immediately
- Can minimize if they want
- Button appears when minimized

---

## 🎨 Customization Options

### **Position:**
```html
data-position="bottom-right"  <!-- Default -->
data-position="bottom-left"
data-position="top-right"
data-position="top-left"
```

### **Color:**
```html
data-color="#6366f1"  <!-- Purple (default) -->
data-color="#10b981"  <!-- Green -->
data-color="#3b82f6"  <!-- Blue -->
data-color="#ef4444"  <!-- Red -->
```

### **Button Text:**
```html
data-button-text="Chat with us"
data-button-text="Need help?"
data-button-text="Ask a question"
```

### **Size (for iframe):**
```html
width="400" height="600"  <!-- Default -->
width="350" height="500"  <!-- Smaller -->
width="450" height="700"  <!-- Larger -->
```

---

## ✅ What's Fixed

### **Before (Broken):**
```
Iframe/Script embed:
- Chat visible
- Click minimize [─]
- Chat disappears
- NO WAY TO REOPEN! ❌
```

### **After (Fixed):**
```
Iframe/Script embed:
- Chat visible
- Click minimize [─]
- Chat disappears
- Button appears! ✅
- Click button
- Chat reopens! ✅
```

---

## 🧪 Testing Checklist

### **Test Popup Widget (Method 1):**
- [ ] Open test page: `http://localhost:3000/test-all-embed-methods.html`
- [ ] Update `YOUR_CHATBOT_ID` in the code
- [ ] Click "Test Now" for Method 1
- [ ] See floating button? ✅
- [ ] Click button → Chat opens? ✅
- [ ] Send a message → Get response? ✅
- [ ] Click [─] minimize → Button appears? ✅
- [ ] Click button → Chat reopens? ✅

### **Test Iframe Embed (Method 2):**
- [ ] Click "Test Now" for Method 2
- [ ] Chat appears immediately? ✅
- [ ] Send a message → Get response? ✅
- [ ] Click [─] minimize → Chat hides? ✅
- [ ] Small button appears? ✅
- [ ] Click button → Chat reopens? ✅

### **Test Custom Script (Method 3):**
- [ ] Click "Test Now" for Method 3
- [ ] Same behavior as Method 2? ✅

---

## 📋 Dashboard Embed & Export Tab

In your dashboard's "Embed & Export" tab, you'll see:

### **Tab 1: Popup Widget (Recommended)**
- Shows the widget.js script code
- ✅ Has minimize → button flow
- Copy and paste to your website

### **Tab 2: Iframe Embed**
- Shows the iframe code
- ✅ Now has minimize → button flow (FIXED!)
- Good for always-visible chat

### **Tab 3: Custom Script**
- Shows the JavaScript injection code
- ✅ Now has minimize → button flow (FIXED!)
- Good for dynamic loading

**All three methods now work perfectly!**

---

## 🐛 Troubleshooting

### **Widget not appearing?**

**Check:**
1. ✅ React dev server running? `npm run dev`
2. ✅ Updated `YOUR_CHATBOT_ID`?
3. ✅ Check browser console (F12) for errors
4. ✅ Try: `http://localhost:3000/widget.js` in browser

### **Minimize button not working?**

**Check:**
1. ✅ Using updated `widget.html`? (Clear browser cache)
2. ✅ See [─] button in header?
3. ✅ Check console for errors
4. ✅ Test on demo page first

### **Button doesn't appear after minimize?**

**Check:**
1. ✅ Clear browser cache
2. ✅ Make sure using updated widget.html
3. ✅ Try the test page: `test-all-embed-methods.html`
4. ✅ Check for JavaScript errors in console

### **Failed to fetch error?**

**Fix:**
1. ✅ Start FastAPI backend
2. ✅ Enable CORS in FastAPI:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
3. ✅ Restart backend

---

## 🚀 Production Deployment

### **Before deploying:**

1. **Replace localhost URLs:**
```html
<!-- Development -->
src="http://localhost:3000/widget.js"
data-api-url="http://192.168.1.31:8006"

<!-- Production -->
src="https://yourdomain.com/widget.js"
data-api-url="https://api.yourdomain.com"
```

2. **Enable CORS for your domain:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. **Test on production:**
- Verify widget loads
- Test minimize/reopen flow
- Check API calls work
- Test on mobile

---

## 📊 Comparison Table

| Feature | Popup Widget | Iframe Embed | Custom Script |
|---------|--------------|--------------|---------------|
| Initial state | Button only | Chat visible | Chat visible |
| Minimize flow | ✅ Yes | ✅ Yes (NEW!) | ✅ Yes (NEW!) |
| Reopen ability | ✅ Yes | ✅ Yes (NEW!) | ✅ Yes (NEW!) |
| User friendly | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Best for | Most sites | Help centers | Advanced |
| Setup difficulty | Easy | Easy | Medium |

---

## ✨ Summary

**What you can do now:**

1. ✅ Export widget from dashboard
2. ✅ Choose ANY of the 3 methods
3. ✅ Paste code on ANY website
4. ✅ Users can minimize chat
5. ✅ Button appears after minimize
6. ✅ Users can click to reopen
7. ✅ Full flow works perfectly!

**Test it:**
```
http://localhost:3000/test-all-embed-methods.html
```

**Use it:**
```html
<script src="http://localhost:3000/widget.js"
        data-chatbot-id="YOUR_ID"
        data-api-url="http://192.168.1.31:8006"
        async></script>
```

**That's it!** 🎉

