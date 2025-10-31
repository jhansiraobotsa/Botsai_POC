# Cloud Storage Integration Implementation Plan

## Overview
Enable users to authenticate with cloud storage providers and upload files directly from Google Drive, OneDrive, SharePoint, Dropbox, and other services to their AI agents.

## Architecture

### Frontend Components
1. **Cloud Service Connection UI** - Buttons to connect each service
2. **File Picker Modal** - Browse and select files from connected services
3. **OAuth Popup Handler** - Handle OAuth flow in popup window
4. **Connection Status** - Show connected services and disconnect option

### Backend Requirements
1. **OAuth Flow Handler** - Handle OAuth 2.0 authorization
2. **Token Management** - Securely store and refresh tokens
3. **File Fetcher** - Download files from cloud services
4. **Upload Pipeline** - Process and upload to RAG system

## Implementation Steps

### Phase 1: Backend OAuth Setup (FastAPI)

#### 1.1 Environment Variables
```env
# Google Drive
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8006/api/v1/oauth/google/callback

# Microsoft (OneDrive/SharePoint)
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_REDIRECT_URI=http://localhost:8006/api/v1/oauth/microsoft/callback

# Dropbox
DROPBOX_APP_KEY=your_dropbox_app_key
DROPBOX_APP_SECRET=your_dropbox_app_secret
DROPBOX_REDIRECT_URI=http://localhost:8006/api/v1/oauth/dropbox/callback
```

#### 1.2 Database Schema
```sql
CREATE TABLE cloud_storage_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    provider VARCHAR(50) NOT NULL, -- 'google_drive', 'onedrive', 'sharepoint', 'dropbox'
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    provider_user_id VARCHAR(255),
    provider_email VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

CREATE INDEX idx_cloud_storage_user ON cloud_storage_connections(user_id);
```

#### 1.3 FastAPI Routes Structure
```
POST   /api/v1/oauth/{provider}/authorize    # Initiate OAuth flow
GET    /api/v1/oauth/{provider}/callback     # OAuth callback handler
GET    /api/v1/oauth/{provider}/status       # Check connection status
DELETE /api/v1/oauth/{provider}/disconnect   # Disconnect service
GET    /api/v1/cloud-storage/{provider}/files # List files
POST   /api/v1/cloud-storage/{provider}/import # Import selected files
```

### Phase 2: OAuth Implementation by Provider

#### 2.1 Google Drive OAuth
```python
# Required Scopes
GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/userinfo.email'
]

# OAuth URL
https://accounts.google.com/o/oauth2/v2/auth?
  client_id={CLIENT_ID}&
  redirect_uri={REDIRECT_URI}&
  response_type=code&
  scope={SCOPES}&
  access_type=offline&
  prompt=consent

# API Endpoints
- List Files: https://www.googleapis.com/drive/v3/files
- Download: https://www.googleapis.com/drive/v3/files/{fileId}?alt=media
```

#### 2.2 Microsoft OneDrive/SharePoint OAuth
```python
# Required Scopes
MICROSOFT_SCOPES = [
    'Files.Read.All',
    'Sites.Read.All',
    'User.Read'
]

# OAuth URL
https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
  client_id={CLIENT_ID}&
  response_type=code&
  redirect_uri={REDIRECT_URI}&
  scope={SCOPES}&
  response_mode=query

# API Endpoints
- OneDrive: https://graph.microsoft.com/v1.0/me/drive/root/children
- SharePoint: https://graph.microsoft.com/v1.0/sites/{site-id}/drive/items
- Download: https://graph.microsoft.com/v1.0/me/drive/items/{item-id}/content
```

#### 2.3 Dropbox OAuth
```python
# Required Scopes
DROPBOX_SCOPES = [
    'files.metadata.read',
    'files.content.read'
]

# OAuth URL
https://www.dropbox.com/oauth2/authorize?
  client_id={CLIENT_ID}&
  redirect_uri={REDIRECT_URI}&
  response_type=code&
  token_access_type=offline

# API Endpoints
- List: https://api.dropboxapi.com/2/files/list_folder
- Download: https://content.dropboxapi.com/2/files/download
```

### Phase 3: Frontend Implementation

#### 3.1 OAuth Flow Handler
```typescript
// utils/oauth-handler.ts
export const initiateOAuth = async (
  provider: string,
  chatbotId: string
) => {
  // Open OAuth popup
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  
  const popup = window.open(
    `/api/v1/oauth/${provider}/authorize?chatbot_id=${chatbotId}`,
    'OAuth',
    `width=${width},height=${height},left=${left},top=${top}`
  );
  
  // Listen for callback
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        if (popup?.closed) {
          clearInterval(interval);
          resolve(true);
        }
      } catch (error) {
        // Ignore cross-origin errors
      }
    }, 500);
    
    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      popup?.close();
      reject(new Error('OAuth timeout'));
    }, 300000);
  });
};
```

#### 3.2 File Picker Component
```typescript
interface CloudFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  modifiedTime: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

const CloudFilePicker = ({ provider, onSelect }) => {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadFiles();
  }, [provider]);
  
  const loadFiles = async () => {
    const response = await fetch(
      `/api/v1/cloud-storage/${provider}/files`
    );
    const data = await response.json();
    setFiles(data.files);
    setLoading(false);
  };
  
  const handleImport = async () => {
    await fetch(`/api/v1/cloud-storage/${provider}/import`, {
      method: 'POST',
      body: JSON.stringify({
        fileIds: Array.from(selectedFiles)
      })
    });
    onSelect();
  };
  
  return (
    // File picker UI
  );
};
```

### Phase 4: Security Considerations

#### 4.1 Token Storage
- **Encrypt tokens** at rest using AES-256
- **Store refresh tokens** separately from access tokens
- **Set token expiration** and implement automatic refresh
- **Use secure HTTP-only cookies** for session management

#### 4.2 Access Control
- Verify user owns the chatbot before allowing uploads
- Implement rate limiting on OAuth endpoints
- Log all cloud storage access attempts
- Validate file types and sizes before download

#### 4.3 Data Privacy
- **Never log tokens** or sensitive OAuth data
- Implement token rotation
- Allow users to revoke access at any time
- Clear tokens immediately on disconnect

### Phase 5: User Experience Flow

#### 5.1 Connection Flow
```
1. User clicks "Connect Google Drive" button
2. Popup opens with Google OAuth consent screen
3. User grants permissions
4. Callback redirects to backend
5. Backend stores tokens
6. Popup closes, frontend refreshes connection status
7. "Connected" badge appears on the service button
```

#### 5.2 File Import Flow
```
1. User clicks "Browse Files" on connected service
2. Modal opens showing their files/folders
3. User navigates folders (breadcrumb navigation)
4. User selects one or multiple files (checkbox)
5. User clicks "Import Selected Files"
6. Backend downloads files from cloud service
7. Backend uploads to RAG system
8. Progress indicator shows upload status
9. Success message confirms import
10. Files appear in "Uploaded Documents" list
```

### Phase 6: API Implementation Details

#### 6.1 Google Drive API
```python
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

async def list_google_drive_files(access_token: str, folder_id: str = 'root'):
    creds = Credentials(token=access_token)
    service = build('drive', 'v3', credentials=creds)
    
    results = service.files().list(
        q=f"'{folder_id}' in parents and trashed=false",
        pageSize=50,
        fields="files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink)"
    ).execute()
    
    return results.get('files', [])

async def download_google_drive_file(access_token: str, file_id: str):
    creds = Credentials(token=access_token)
    service = build('drive', 'v3', credentials=creds)
    
    request = service.files().get_media(fileId=file_id)
    file_content = io.BytesIO()
    downloader = MediaIoBaseDownload(file_content, request)
    
    done = False
    while not done:
        status, done = downloader.next_chunk()
    
    return file_content.getvalue()
```

#### 6.2 Microsoft Graph API
```python
import msal
import requests

async def list_onedrive_files(access_token: str, folder_path: str = '/'):
    headers = {'Authorization': f'Bearer {access_token}'}
    
    if folder_path == '/':
        url = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
    else:
        url = f'https://graph.microsoft.com/v1.0/me/drive/root:{folder_path}:/children'
    
    response = requests.get(url, headers=headers)
    return response.json().get('value', [])

async def download_onedrive_file(access_token: str, item_id: str):
    headers = {'Authorization': f'Bearer {access_token}'}
    url = f'https://graph.microsoft.com/v1.0/me/drive/items/{item_id}/content'
    
    response = requests.get(url, headers=headers)
    return response.content
```

#### 6.3 Dropbox API
```python
import dropbox

async def list_dropbox_files(access_token: str, folder_path: str = ''):
    dbx = dropbox.Dropbox(access_token)
    
    result = dbx.files_list_folder(folder_path)
    return result.entries

async def download_dropbox_file(access_token: str, file_path: str):
    dbx = dropbox.Dropbox(access_token)
    
    metadata, response = dbx.files_download(file_path)
    return response.content
```

### Phase 7: Error Handling

#### 7.1 Common OAuth Errors
```python
ERROR_CODES = {
    'invalid_grant': 'Refresh token expired or revoked. Please reconnect.',
    'insufficient_permissions': 'Additional permissions required.',
    'rate_limit_exceeded': 'Too many requests. Please try again later.',
    'file_not_found': 'File no longer exists or access denied.',
    'quota_exceeded': 'Storage quota exceeded.',
}
```

#### 7.2 Token Refresh Logic
```python
async def refresh_access_token(user_id: str, provider: str):
    connection = get_connection(user_id, provider)
    
    if not connection.refresh_token:
        raise Exception('No refresh token available')
    
    if provider == 'google_drive':
        token_url = 'https://oauth2.googleapis.com/token'
        data = {
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'refresh_token': connection.refresh_token,
            'grant_type': 'refresh_token'
        }
    elif provider == 'microsoft':
        token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
        data = {
            'client_id': MICROSOFT_CLIENT_ID,
            'client_secret': MICROSOFT_CLIENT_SECRET,
            'refresh_token': connection.refresh_token,
            'grant_type': 'refresh_token',
            'scope': ' '.join(MICROSOFT_SCOPES)
        }
    
    response = requests.post(token_url, data=data)
    tokens = response.json()
    
    # Update stored tokens
    update_connection_tokens(
        user_id,
        provider,
        tokens['access_token'],
        tokens.get('refresh_token', connection.refresh_token),
        datetime.now() + timedelta(seconds=tokens['expires_in'])
    )
    
    return tokens['access_token']
```

### Phase 8: Testing Strategy

#### 8.1 Unit Tests
- OAuth flow initiation
- Token refresh logic
- File listing with pagination
- File download and upload
- Error handling

#### 8.2 Integration Tests
- End-to-end OAuth flow
- File import from each provider
- Token expiration handling
- Multiple concurrent uploads

#### 8.3 Manual Testing Checklist
- [ ] Google Drive connection
- [ ] OneDrive connection
- [ ] SharePoint connection
- [ ] Dropbox connection
- [ ] Box connection
- [ ] File browsing with folders
- [ ] File search functionality
- [ ] Multiple file selection
- [ ] Large file handling (>100MB)
- [ ] Token refresh on expiration
- [ ] Disconnect functionality
- [ ] Reconnection after disconnect
- [ ] Error messages display correctly
- [ ] Progress indicators work
- [ ] Mobile responsive UI

## Implementation Priority

### Sprint 1 (Week 1-2): Core Infrastructure
- Database schema
- OAuth endpoints structure
- Token encryption/storage
- Basic UI components

### Sprint 2 (Week 3-4): Google Drive Integration
- Full Google Drive OAuth
- File browsing
- File import
- Testing

### Sprint 3 (Week 5-6): Microsoft Integration
- OneDrive OAuth
- SharePoint OAuth
- File operations
- Testing

### Sprint 4 (Week 7-8): Additional Providers
- Dropbox integration
- Box integration
- UI polish
- Comprehensive testing

## Required Packages

### Backend (Python)
```txt
google-auth==2.23.0
google-auth-oauthlib==1.1.0
google-auth-httplib2==0.1.1
google-api-python-client==2.100.0
msal==1.24.0
dropbox==11.36.2
cryptography==41.0.5  # For token encryption
```

### Frontend (React)
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0"  // For OAuth state management
  }
}
```

## Cost Considerations

### OAuth API Limits (Free Tier)
- **Google Drive**: 10,000 requests/day
- **Microsoft Graph**: Varies by resource
- **Dropbox**: 500 requests/hour per user

### Recommendations
- Implement caching for file listings
- Use pagination for large folders
- Rate limit user requests
- Monitor API usage

## Security Best Practices

1. **Never expose client secrets** in frontend code
2. **Validate redirect URIs** strictly
3. **Implement CSRF protection** in OAuth flow
4. **Use state parameter** to prevent CSRF
5. **Set short token lifetimes** where possible
6. **Log all OAuth activities** for audit
7. **Implement automatic token cleanup** for inactive connections
8. **Use HTTPS only** for all OAuth communications
9. **Validate file types** before download
10. **Scan files for viruses** before uploading to RAG system

## Rollout Plan

### Beta Testing (2 weeks)
- Release to 10 pilot users
- Collect feedback on UX
- Monitor for errors and edge cases

### Soft Launch (1 month)
- Gradually increase user access
- Monitor API usage and costs
- Optimize based on real usage patterns

### Full Launch
- Enable for all users
- Marketing announcement
- Documentation and tutorials

## Documentation Needs

1. **User Guide**: How to connect cloud storage
2. **API Documentation**: For backend developers
3. **Security Guide**: Token management best practices
4. **Troubleshooting**: Common issues and solutions
5. **Video Tutorials**: Connecting each service

## Success Metrics

- **Adoption Rate**: % of users who connect at least one service
- **Import Volume**: Number of files imported per week
- **Error Rate**: % of failed imports
- **User Satisfaction**: NPS score for this feature
- **Support Tickets**: Number of support requests related to integrations

## Future Enhancements

1. **Two-way sync**: Auto-update when cloud files change
2. **Folder watching**: Monitor specific folders
3. **Selective sync**: Choose which file types to import
4. **Bulk operations**: Import entire folders at once
5. **Preview before import**: Show file preview in picker
6. **Version control**: Track file versions
7. **Collaborative sharing**: Share cloud files with team
8. **Advanced search**: Search across all connected services

