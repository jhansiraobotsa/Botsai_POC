// FastAPI Backend Configuration
export const FASTAPI_BASE_URL = "http://49.249.160.198:8006";

// Helper function to get authentication headers
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Helper function to make authenticated API calls
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  return response;
}

// API Endpoints
export const API_ENDPOINTS = {
  // Chatbot endpoints
  CHATBOT_UPSERT: `${FASTAPI_BASE_URL}/api/v1/chatbot/upsert`,
  CHATBOT_BY_ID: (id: string) => `${FASTAPI_BASE_URL}/api/v1/chatbot/${id}`,
  CHATBOT_BY_USER: (userId: string | number) => `${FASTAPI_BASE_URL}/api/v1/chatbot/user/${userId}`,
  CHATBOT_DELETE: (id: string) => `${FASTAPI_BASE_URL}/api/v1/chatbot/${id}`,
  CHATBOT_DELETE_BY_USER: (userId: string | number) => `${FASTAPI_BASE_URL}/api/v1/chatbot/user/${userId}`,
  CHATBOT_USER_UPSERT: `${FASTAPI_BASE_URL}/api/v1/chatbot/user/upsert`,
  
  // RAG endpoints
  RAG_UPLOAD: (chatbotId: string) => `${FASTAPI_BASE_URL}/api/v1/rag/upload-chatbot?chatbot_id=${encodeURIComponent(chatbotId)}`,
  RAG_CHAT: `${FASTAPI_BASE_URL}/api/v1/rag/chat`,
  
  // Auth endpoints
  AUTH_CREATE_CHATBOT: `${FASTAPI_BASE_URL}/api/v1/auth/create-chatbot`,
  AUTH_ME: `${FASTAPI_BASE_URL}/api/v1/auth/me`,
};

// Helper function to transform chatbot data from FastAPI to frontend format
export interface FastAPIChatbot {
  id?: string;
  chatbot_name: string;
  user_id: string | number;
  user_steps_details: {
    name: string;
    industry: string;
    purpose: string;
    tone: string;
    brandColor: string;
    businessGoal: string;
    targetAudience: string;
    keyFeatures: string;
    widgetPosition: string;
    plan: string;
  };
}

export interface FrontendChatbot {
  id: string;
  name: string;
  industry: string;
  purpose: string;
  tone: string;
  brandColor: string;
  businessGoal: string;
  targetAudience: string;
  keyFeatures: string;
  widgetPosition: string;
  plan: string;
  userId: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function transformFastAPIToFrontend(data: any): FrontendChatbot {
  return {
    id: data.id || data._id,
    name: data.chatbot_name || data.user_steps_details?.name || data.name,
    industry: data.user_steps_details?.industry || data.industry,
    purpose: data.user_steps_details?.purpose || data.purpose,
    tone: data.user_steps_details?.tone || data.tone,
    brandColor: data.user_steps_details?.brandColor || data.brandColor || "#3B82F6",
    businessGoal: data.user_steps_details?.businessGoal || data.businessGoal,
    targetAudience: data.user_steps_details?.targetAudience || data.targetAudience,
    keyFeatures: data.user_steps_details?.keyFeatures || data.keyFeatures,
    widgetPosition: data.user_steps_details?.widgetPosition || data.widgetPosition || "bottom-right",
    plan: data.user_steps_details?.plan || data.plan || "basic",
    userId: String(data.user_id),
    status: "active",
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
  };
}

export function transformFrontendToFastAPI(data: any): FastAPIChatbot {
  // Handle user_id conversion - try to get numeric ID if possible
  let userId: string | number = data.userId || data.user_id;
  if (typeof userId === 'string') {
    const numericId = parseInt(userId.replace(/[^0-9]/g, ''));
    if (!isNaN(numericId) && numericId > 0) {
      userId = numericId;
    }
  }
  
  return {
    id: data.id,
    chatbot_name: data.name,
    user_id: userId,
    user_steps_details: {
      name: data.name,
      industry: data.industry,
      purpose: data.purpose,
      tone: data.tone,
      brandColor: data.brandColor || "#3B82F6",
      businessGoal: data.businessGoal,
      targetAudience: data.targetAudience,
      keyFeatures: data.keyFeatures,
      widgetPosition: data.widgetPosition || "bottom-right",
      plan: data.plan || "basic",
    },
  };
}

