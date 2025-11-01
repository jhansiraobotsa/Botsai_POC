# FastAPI Backend Migration Guide

## Overview
This document outlines the migration from Express.js backend APIs to FastAPI backend APIs for the chatbot application.

## What Was Changed

### 1. Created New API Configuration File
**File:** `client/src/lib/api-config.ts`

This new file contains:
- Base URL configuration for FastAPI backend (`https://vyomai.techraq.com`)
- All API endpoint definitions
- Data transformation functions to convert between FastAPI and frontend formats
- TypeScript interfaces for type safety

### 2. Updated Components

#### a. **chatbot-detail.tsx**
- Updated chatbot fetching to use `API_ENDPOINTS.CHATBOT_BY_ID(id)`
- Updated document upload to use `API_ENDPOINTS.RAG_UPLOAD(chatbotId)`
- Updated chat interface to use `API_ENDPOINTS.RAG_CHAT`
- All data is transformed using `transformFastAPIToFrontend()` function

#### b. **create-chatbot.tsx**
- Updated to use `API_ENDPOINTS.CHATBOT_UPSERT` for creating/updating chatbots
- Updated chatbot edit fetching to use `API_ENDPOINTS.CHATBOT_BY_ID()`
- Removed Express.js memory storage calls
- All chatbot creation now goes directly to FastAPI

#### c. **dashboard.tsx**
- Updated to use `API_ENDPOINTS.CHATBOT_BY_USER(userId)` to fetch chatbots by user
- Added data transformation for all fetched chatbots
- Query key changed from `["/api/chatbots"]` to `["chatbots", user?.id]`

#### d. **chat-interface.tsx**
- Updated to use `API_ENDPOINTS.RAG_CHAT` for chat functionality
- Updated request/response format to match FastAPI RAG endpoint
- Added session ID management

### 3. API Endpoint Mapping

| Old Express.js Endpoint | New FastAPI Endpoint | Purpose |
|------------------------|---------------------|---------|
| `GET /api/chatbots/:id` | `GET /api/v1/chatbot/{chatbot_id}` | Get single chatbot |
| `GET /api/chatbots` | `GET /api/v1/chatbot/user/{user_id}` | Get all chatbots for user |
| `POST /api/chatbots` | `POST /api/v1/chatbot/upsert` | Create/update chatbot |
| `DELETE /api/chatbots/:id` | `DELETE /api/v1/chatbot/{chatbot_id}` | Delete chatbot |
| N/A (new) | `DELETE /api/v1/chatbot/user/{user_id}` | Delete all chatbots for user |
| N/A (new) | `POST /api/v1/chatbot/user/upsert` | Upsert by user_id |
| N/A | `POST /api/v1/rag/upload-chatbot` | Upload documents (already used) |
| N/A | `POST /api/v1/rag/chat` | Chat with bot (already used) |

## Data Transformation

### FastAPI to Frontend Format
```typescript
FastAPI Response:
{
  "_id": "abc123",
  "chatbot_name": "My Bot",
  "user_id": 1,
  "user_steps_details": {
    "name": "My Bot",
    "industry": "Technology",
    ...
  }
}

↓ Transformed to ↓

Frontend Format:
{
  "id": "abc123",
  "name": "My Bot",
  "userId": "1",
  "industry": "Technology",
  "status": "active",
  "createdAt": Date,
  "updatedAt": Date,
  ...
}
```

### Frontend to FastAPI Format
```typescript
Frontend Data:
{
  "name": "My Bot",
  "industry": "Technology",
  "purpose": "support",
  ...
}

↓ Transformed to ↓

FastAPI Request:
{
  "chatbot_name": "My Bot",
  "user_id": 1,
  "user_steps_details": {
    "name": "My Bot",
    "industry": "Technology",
    "purpose": "support",
    ...
  }
}
```

## Configuration

### Base URL
The FastAPI base URL is configured in `client/src/lib/api-config.ts`:
```typescript
export const FASTAPI_BASE_URL = "https://vyomai.techraq.com";
```

**To change the backend URL:** Update this constant in `api-config.ts`.

## Key Features

### Type Safety
- All API endpoints are strongly typed
- Data transformation functions ensure type consistency
- TypeScript interfaces for both FastAPI and frontend formats

### Centralized Configuration
- All API endpoints defined in one place (`api-config.ts`)
- Easy to update or change endpoints
- Consistent error handling across all API calls

### Data Transformation
- Automatic conversion between FastAPI and frontend data formats
- Handles field name mapping (e.g., `chatbot_name` ↔ `name`)
- Ensures all required fields are present

## Testing the Migration

### 1. Test Chatbot Creation
- Go to "Create New" chatbot
- Fill in all required fields
- Submit the form
- Verify chatbot is created in FastAPI backend

### 2. Test Chatbot List
- Go to dashboard
- Verify all chatbots are displayed
- Check that all data fields are correctly mapped

### 3. Test Chatbot Detail
- Click on a chatbot from the dashboard
- Verify all tabs load correctly
- Test document upload
- Test chat interface

### 4. Test Editing
- Go to chatbot detail page
- Click "Edit Settings"
- Modify fields and save
- Verify changes are saved in FastAPI backend

## Next Steps

### Recommended Actions
1. **Remove Express.js Server**: The Express.js server is no longer needed and can be removed
2. **Update Environment Variables**: Consider moving the FastAPI URL to an environment variable
3. **Add Error Handling**: Enhance error handling for API failures
4. **Add Loading States**: Improve UX with better loading indicators

### Files That Can Be Removed
- `server/routes.ts` (Express.js routes)
- `server/storage.ts` (In-memory storage)
- `server/index.ts` (Express.js server setup)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure FastAPI backend has CORS enabled
   - Check that the FastAPI URL is correct

2. **User ID Format Errors**
   - The frontend converts user IDs to numbers for FastAPI
   - Ensure user IDs are properly formatted

3. **Missing Fields**
   - Check data transformation functions
   - Verify FastAPI response includes all expected fields

4. **Authentication Issues**
   - Ensure JWT tokens are properly passed in headers
   - Check token expiration

## Support

For issues or questions:
1. Check the FastAPI backend logs
2. Check browser console for errors
3. Verify API endpoint URLs in `api-config.ts`
4. Test API endpoints directly using tools like Postman

## Version History

- **v1.0** - Initial migration from Express.js to FastAPI (Current)

