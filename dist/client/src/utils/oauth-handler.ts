// OAuth Handler for Cloud Storage Integrations

export type CloudProvider = 'google_drive' | 'onedrive' | 'sharepoint' | 'dropbox' | 'box';

export interface OAuthConfig {
  provider: CloudProvider;
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export interface CloudConnection {
  provider: CloudProvider;
  connected: boolean;
  email?: string;
  connectedAt?: string;
}

/**
 * Initiates OAuth flow in a popup window
 */
export const initiateOAuth = async (
  provider: CloudProvider,
  userId: string
): Promise<boolean> => {
  try {
    // Open OAuth popup
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const authUrl = `${process.env.VITE_API_URL || 'http://localhost:8006'}/api/v1/oauth/${provider}/authorize?user_id=${userId}`;
    
    const popup = window.open(
      authUrl,
      'OAuth Authorization',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no`
    );

    if (!popup) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // Wait for popup to close or receive message
    return new Promise((resolve, reject) => {
      // Listen for messages from popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'oauth_success') {
          window.removeEventListener('message', messageHandler);
          clearInterval(checkInterval);
          popup.close();
          resolve(true);
        } else if (event.data.type === 'oauth_error') {
          window.removeEventListener('message', messageHandler);
          clearInterval(checkInterval);
          popup.close();
          reject(new Error(event.data.error || 'OAuth failed'));
        }
      };

      window.addEventListener('message', messageHandler);

      // Also check if popup is closed manually
      const checkInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkInterval);
          window.removeEventListener('message', messageHandler);
          // Check if authentication was successful
          checkConnectionStatus(provider, userId)
            .then(connected => resolve(connected))
            .catch(() => reject(new Error('OAuth cancelled by user')));
        }
      }, 500);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        window.removeEventListener('message', messageHandler);
        if (!popup.closed) {
          popup.close();
        }
        reject(new Error('OAuth timeout'));
      }, 300000);
    });
  } catch (error) {
    console.error('OAuth error:', error);
    throw error;
  }
};

/**
 * Check connection status for a provider
 */
export const checkConnectionStatus = async (
  provider: CloudProvider,
  userId: string
): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const response = await fetch(
      `${process.env.VITE_API_URL || 'http://localhost:8006'}/api/v1/oauth/${provider}/status`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.connected || false;
  } catch (error) {
    console.error('Status check error:', error);
    return false;
  }
};

/**
 * Disconnect a cloud storage provider
 */
export const disconnectProvider = async (
  provider: CloudProvider,
  userId: string
): Promise<void> => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  const response = await fetch(
    `${process.env.VITE_API_URL || 'http://localhost:8006'}/api/v1/oauth/${provider}/disconnect`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to disconnect provider');
  }
};

/**
 * Get all cloud storage connections for a user
 */
export const getAllConnections = async (userId: string): Promise<CloudConnection[]> => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  const response = await fetch(
    `${process.env.VITE_API_URL || 'http://localhost:8006'}/api/v1/oauth/connections`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch connections');
  }
  
  return response.json();
};

/**
 * Get provider display information
 */
export const getProviderInfo = (provider: CloudProvider) => {
  const providerMap = {
    google_drive: {
      name: 'Google Drive',
      icon: 'fab fa-google-drive',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      description: 'Access files from your Google Drive'
    },
    onedrive: {
      name: 'OneDrive',
      icon: 'fab fa-microsoft',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      description: 'Access files from Microsoft OneDrive'
    },
    sharepoint: {
      name: 'SharePoint',
      icon: 'fab fa-microsoft',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Access files from SharePoint sites'
    },
    dropbox: {
      name: 'Dropbox',
      icon: 'fab fa-dropbox',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Access files from your Dropbox'
    },
    box: {
      name: 'Box',
      icon: 'fas fa-cube',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: 'Access files from Box'
    }
  };
  
  return providerMap[provider] || {
    name: provider,
    icon: 'fas fa-cloud',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    description: 'Cloud storage provider'
  };
};

