import { useState, useRef, useContext, createContext, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Chatbot, ChatMessage } from "@shared/schema";
import DashboardLayout from "@/components/dashboard-layout";
import { useTheme } from "@/components/theme-provider";
import { Progress } from "@/components/ui/progress";
import { API_ENDPOINTS, transformFastAPIToFrontend, authenticatedFetch } from "@/lib/api-config";

// Create a context for tab management
const TabContext = createContext<((tab: string) => void) | null>(null);

// Dashboard Components
function DashboardHeader({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div className="bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <i className="fas fa-robot text-primary text-xl"></i>
          <span className="text-white font-semibold">Vyoma.ai Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-300 text-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} data-testid="button-logout">
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        <Link to="/" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg">
          <i className="fas fa-robot"></i>
          <span>My Chatbots</span>
        </Link>
        <Link to="/create" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg">
          <i className="fas fa-plus"></i>
          <span>Create New</span>
        </Link>
        <button className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg w-full text-left">
          <i className="fas fa-chart-bar"></i>
          <span>Analytics</span>
        </button>
        <button className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg w-full text-left">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default function ChatbotDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  
  // Provide the setActiveTab function through context
  const handleTabChange = (tab: string) => setActiveTab(tab);
  
  const { data: chatbot, isLoading } = useQuery<Chatbot>({
    queryKey: ["chatbot", id],
    queryFn: async () => {
      if (!id) throw new Error("No chatbot ID provided");
      const response = await authenticatedFetch(API_ENDPOINTS.CHATBOT_BY_ID(id));
      if (!response.ok) throw new Error("Failed to fetch chatbot");
      const data = await response.json();
      return transformFastAPIToFrontend(data);
    },
    enabled: !!id,
  });

  if (isLoading || !chatbot) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TabContext.Provider value={handleTabChange}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-primary' : 'text-slate-900'}`}>{chatbot.name}</h1>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-secondary' : 'text-slate-600'}`}>{chatbot.industry} • {chatbot.purpose}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                  {chatbot.status}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setLocation(`/edit/${chatbot.id}`, { state: { chatbot } })}>
                  <i className="fas fa-edit mr-2"></i>
                  Edit Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="chat">Chat Interface</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="embed">Embed & Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentsTab chatbotId={chatbot.id} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterfaceTab chatbot={chatbot} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab chatbotId={chatbot.id} />
          </TabsContent>

          <TabsContent value="embed" className="space-y-6">
            <EmbedExportTab chatbot={chatbot} />
          </TabsContent>
        </Tabs>
      </div>
      </TabContext.Provider>
    </DashboardLayout>
  );
}

function OverviewTab({ chatbot }: { chatbot: Chatbot }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Industry</Label>
                <p className="text-slate-600">{chatbot.industry}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Purpose</Label>
                <p className="text-slate-600">{chatbot.purpose}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Tone</Label>
                <p className="text-slate-600">{chatbot.tone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Brand Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: chatbot.brandColor }}
                  ></div>
                  <span className="text-slate-600">{chatbot.brandColor}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium text-slate-700">Business Goal</Label>
              <p className="text-slate-600 mt-1">{chatbot.businessGoal}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Target Audience</Label>
              <p className="text-slate-600 mt-1">{chatbot.targetAudience}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Key Features</Label>
              <p className="text-slate-600 mt-1">{chatbot.keyFeatures}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Conversations</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Documents Uploaded</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Avg Response Time</span>
              <span className="font-semibold">1.2s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Satisfaction Score</span>
              <span className="font-semibold">98%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Widget Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-32">
              <div className="absolute bottom-4 right-4">
                <div 
                  className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: chatbot.brandColor }}
                >
                  <i className="fas fa-comment text-white"></i>
                </div>
              </div>
              <p className="text-xs text-slate-500">Widget preview - {chatbot.widgetPosition}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DocumentsTab({ chatbotId }: { chatbotId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const progressTimerRef = useRef<number | null>(null);
  const setActiveTab = useContext(TabContext);
  
  // Cloud storage states
  const [showCloudPicker, setShowCloudPicker] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [cloudConnections, setCloudConnections] = useState<Record<string, boolean>>({
    google_drive: false,
    onedrive: false,
    sharepoint: false,
    dropbox: false,
    box: false
  });

  // Uploaded files for current session only (not persisted)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; timestamp: string }[]>([]);
  
  // Load cloud storage connections status
  useEffect(() => {
    loadConnectionsStatus();
  }, []);

  const loadConnectionsStatus = async () => {
    // TODO: Replace with actual API call when backend is ready
    // For now, check localStorage for demo purposes
    const connections = {
      google_drive: localStorage.getItem('connected_google_drive') === 'true',
      onedrive: localStorage.getItem('connected_onedrive') === 'true',
      sharepoint: localStorage.getItem('connected_sharepoint') === 'true',
      dropbox: localStorage.getItem('connected_dropbox') === 'true',
      box: localStorage.getItem('connected_box') === 'true'
    };
    setCloudConnections(connections);
  };

  const handleCloudStorageConnect = async (provider: string) => {
    try {
      toast({
        title: "Connecting...",
        description: `Opening ${provider} authentication window...`,
      });
      
      // For demo: simulate OAuth flow
      // TODO: Replace with actual OAuth implementation using oauth-handler.ts
      setTimeout(() => {
        localStorage.setItem(`connected_${provider}`, 'true');
        setCloudConnections(prev => ({ ...prev, [provider]: true }));
        toast({
          title: "Connected Successfully",
          description: `Your ${provider} account has been connected!`,
        });
      }, 1500);
      
      // Actual implementation would be:
      // const { initiateOAuth } = await import('@/utils/oauth-handler');
      // await initiateOAuth(provider as CloudProvider, user?.id || '');
      // await loadConnectionsStatus();
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect cloud storage",
        variant: "destructive",
      });
    }
  };

  const handleCloudStorageBrowse = (provider: string) => {
    if (!cloudConnections[provider as keyof typeof cloudConnections]) {
      handleCloudStorageConnect(provider);
    } else {
      setSelectedProvider(provider);
      setShowCloudPicker(true);
    }
  };
  
  const handleDisconnect = async (provider: string) => {
    localStorage.removeItem(`connected_${provider}`);
    setCloudConnections(prev => ({ ...prev, [provider]: false }));
    toast({
      title: "Disconnected",
      description: `${provider} has been disconnected`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const startProgress = () => {
    if (progressTimerRef.current) return;
    setStatusText("Preparing documents for upload...");
    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 5 + 2); // Slower +2 to +7
        const clamped = Math.min(next, 90);
        
        // More detailed status messages
        if (clamped < 20) setStatusText("Analyzing document structure...");
        else if (clamped < 35) setStatusText("Extracting text content...");
        else if (clamped < 50) setStatusText("Processing document sections...");
        else if (clamped < 65) setStatusText("Optimizing for knowledge base...");
        else if (clamped < 80) setStatusText("Generating semantic embeddings...");
        else setStatusText("Finalizing knowledge base integration...");
        
        return clamped;
      });
    }, 600); // Slower updates
  };

  const stopProgress = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }
      const url = API_ENDPOINTS.RAG_UPLOAD(chatbotId);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const response = await fetch(url, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      if (!response.ok) throw new Error((await response.text()) || 'Upload failed');
      return { data: await response.json(), files };
    },
    onSuccess: ({ data, files }) => {
      stopProgress();
      setProgress(100);
      setStatusText("✨ Knowledge base successfully updated!");
      
      // Add uploaded files to the list with string timestamp for localStorage compatibility
      const newFiles = files.map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        timestamp: new Date().toISOString()
      }));
      setUploadedFiles(prev => [...newFiles, ...prev]);

      toast({
        title: "Documents Processed Successfully",
        description: data?.message || "Your documents have been analyzed and added to the knowledge base.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/documents", chatbotId] });
      
      // Reset upload state but DON'T switch tabs - keep user on documents tab
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setStatusText("");
      }, 2000);
    },
    onError: (error: any) => {
      stopProgress();
      toast({
        title: "Upload Failed",
        description: error?.message || "Failed to process documents. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
      setProgress(0);
      setStatusText("");
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      setUploading(true);
      setProgress(1);
      setStatusText("Initializing upload...");
      startProgress();
      uploadMutation.mutate(files);
      event.currentTarget.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Direct File Upload Section - First Priority */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload files directly to build your chatbot's knowledge base
          </p>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-cloud-upload-alt text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Upload Documents</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supported formats: PDF, DOC, DOCX, TXT, PPTX, CSV, XLS, XLSX
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                data-testid="button-upload-document"
              >
                {uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Scanning...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Choose Files
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.pptx,.csv,.xls,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploading && (
                <div className="mt-6 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{statusText || 'Processing...'}</p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                  <div className="flex items-center gap-2 mt-3 text-slate-500 dark:text-slate-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> 
                    <span>Simulating scan steps while documents are being indexed...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uploaded Documents</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Current session uploads • {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''}
              </p>
            </div>
            {uploadedFiles.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUploadedFiles([]);
                  toast({
                    title: "All Documents Cleared",
                    description: "Upload list has been cleared for this session",
                  });
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => {
                const uploadTime = new Date(file.timestamp);
                const now = new Date();
                const diffMinutes = Math.floor((now.getTime() - uploadTime.getTime()) / 60000);
                const timeAgo = diffMinutes < 1 ? 'Just now' : 
                               diffMinutes < 60 ? `${diffMinutes}m ago` : 
                               diffMinutes < 1440 ? `${Math.floor(diffMinutes / 60)}h ago` : 
                               `${Math.floor(diffMinutes / 1440)}d ago`;

                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                        <i className={`fas ${
                          file.name.toLowerCase().endsWith('.pdf') ? 'fa-file-pdf text-red-600' : 
                          file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx') ? 'fa-file-word text-blue-600' :
                          file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx') ? 'fa-file-excel text-green-600' :
                          file.name.toLowerCase().endsWith('.ppt') || file.name.toLowerCase().endsWith('.pptx') ? 'fa-file-powerpoint text-orange-600' :
                          'fa-file-alt text-blue-600'
                        } text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {timeAgo} • {file.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <i className="fas fa-check-circle mr-1"></i>
                        Processed
                      </Badge>
                      <button 
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        onClick={() => {
                          setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                          toast({
                            title: "Document Removed",
                            description: "Document removed from current session list",
                          });
                        }}
                        title="Remove from list"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <i className="fas fa-folder-open text-3xl mb-3"></i>
                <p className="font-medium">No documents uploaded yet</p>
                <p className="text-sm mt-1">Upload documents to train your AI agent</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Ingestion Sources - Coming Soon */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg mb-2">
              <i className="fas fa-rocket mr-2"></i>
              <span className="font-semibold">Coming Soon</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Advanced integrations are on the way!</p>
          </div>
        </div>
        <CardHeader>
          <CardTitle>Document Ingestion Sources</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Connect multiple sources to build your chatbot's knowledge base
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cloud Storage Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
              <span className="flex items-center">
                <i className="fas fa-cloud text-blue-500 mr-2"></i>
                Cloud Storage
              </span>
              <span className="text-xs text-slate-500">
                {Object.values(cloudConnections).filter(Boolean).length} connected
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Google Drive */}
              <div className="relative group">
                <button 
                  onClick={() => handleCloudStorageBrowse('google_drive')}
                  className={`w-full flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    cloudConnections.google_drive 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <i className="fab fa-google-drive text-3xl text-green-500 mb-2 group-hover:scale-110 transition-transform"></i>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Google Drive</span>
                  {cloudConnections.google_drive && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                  )}
                </button>
                {cloudConnections.google_drive && (
                  <button
                    onClick={() => handleDisconnect('google_drive')}
                    className="absolute -bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Disconnect"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              {/* OneDrive */}
              <div className="relative group">
                <button 
                  onClick={() => handleCloudStorageBrowse('onedrive')}
                  className={`w-full flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    cloudConnections.onedrive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <i className="fab fa-microsoft text-3xl text-blue-500 mb-2 group-hover:scale-110 transition-transform"></i>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">OneDrive</span>
                  {cloudConnections.onedrive && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                  )}
                </button>
                {cloudConnections.onedrive && (
                  <button
                    onClick={() => handleDisconnect('onedrive')}
                    className="absolute -bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Disconnect"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              {/* SharePoint */}
              <div className="relative group">
                <button 
                  onClick={() => handleCloudStorageBrowse('sharepoint')}
                  className={`w-full flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    cloudConnections.sharepoint 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <i className="fab fa-microsoft text-3xl text-indigo-600 mb-2 group-hover:scale-110 transition-transform"></i>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">SharePoint</span>
                  {cloudConnections.sharepoint && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                  )}
                </button>
                {cloudConnections.sharepoint && (
                  <button
                    onClick={() => handleDisconnect('sharepoint')}
                    className="absolute -bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Disconnect"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              {/* Dropbox */}
              <div className="relative group">
                <button 
                  onClick={() => handleCloudStorageBrowse('dropbox')}
                  className={`w-full flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    cloudConnections.dropbox 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <i className="fab fa-dropbox text-3xl text-blue-600 mb-2 group-hover:scale-110 transition-transform"></i>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Dropbox</span>
                  {cloudConnections.dropbox && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                  )}
                </button>
                {cloudConnections.dropbox && (
                  <button
                    onClick={() => handleDisconnect('dropbox')}
                    className="absolute -bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Disconnect"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {/* Box */}
              <div className="relative group">
                <button 
                  onClick={() => handleCloudStorageBrowse('box')}
                  className={`w-full flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    cloudConnections.box 
                      ? 'border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <i className="fas fa-cube text-3xl text-blue-700 mb-2 group-hover:scale-110 transition-transform"></i>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Box</span>
                  {cloudConnections.box && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                  )}
                </button>
                {cloudConnections.box && (
                  <button
                    onClick={() => handleDisconnect('box')}
                    className="absolute -bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Disconnect"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Productivity Tools Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
              <i className="fas fa-briefcase text-purple-500 mr-2"></i>
              Productivity & Knowledge Tools
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fas fa-book text-3xl text-slate-800 dark:text-slate-300 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Notion</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fab fa-confluence text-3xl text-blue-600 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Confluence</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fab fa-slack text-3xl text-purple-600 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Slack</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fas fa-envelope text-3xl text-red-500 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Gmail</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fab fa-microsoft text-3xl text-blue-500 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Outlook</span>
              </button>
            </div>
          </div>

          {/* Other Sources Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
              <i className="fas fa-database text-orange-500 mr-2"></i>
              Other Sources
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fab fa-aws text-3xl text-orange-500 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">AWS S3</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fab fa-google text-3xl text-blue-500 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Google Cloud</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fab fa-microsoft text-3xl text-blue-600 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Azure Blob</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fas fa-server text-3xl text-slate-600 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">FTP/SFTP</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
                <i className="fas fa-file-archive text-3xl text-yellow-600 mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Zip Upload</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloud File Picker Dialog */}
      <Dialog open={showCloudPicker} onOpenChange={setShowCloudPicker}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <i className={`${getProviderIcon(selectedProvider)} text-2xl`}></i>
              <span>Browse {getProviderName(selectedProvider)} Files</span>
            </DialogTitle>
            <DialogDescription>
              Select files to import into your AI agent's knowledge base
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <i className="fas fa-folder"></i>
              <span>/</span>
              <span className="font-medium">Root</span>
            </div>

            {/* File List */}
            <ScrollArea className="h-[400px] border rounded-lg">
              <div className="p-4 space-y-2">
                {/* Demo files - Replace with actual API call */}
                {[
                  { name: 'Product Documentation.pdf', size: '2.4 MB', type: 'pdf', modified: '2 days ago' },
                  { name: 'Sales Report Q4.docx', size: '1.1 MB', type: 'doc', modified: '5 days ago' },
                  { name: 'Customer Data.xlsx', size: '856 KB', type: 'xls', modified: '1 week ago' },
                  { name: 'Marketing Presentation.pptx', size: '4.2 MB', type: 'ppt', modified: '2 weeks ago' },
                  { name: 'Meeting Notes.txt', size: '24 KB', type: 'txt', modified: '3 days ago' },
                ].map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                        <i className={`${getFileIcon(file.type)} text-xl`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size} • {file.modified}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <i className="fas fa-external-link-alt"></i>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <i className="fas fa-info-circle mr-1"></i>
                Select files to import (Max 10 files at once)
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowCloudPicker(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Importing Files",
                      description: "Your selected files are being imported...",
                    });
                    setShowCloudPicker(false);
                    // TODO: Implement actual file import
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Import Selected
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Helper functions for cloud picker
  function getProviderName(provider: string) {
    const names: Record<string, string> = {
      google_drive: 'Google Drive',
      onedrive: 'OneDrive',
      sharepoint: 'SharePoint',
      dropbox: 'Dropbox',
      box: 'Box'
    };
    return names[provider] || provider;
  }

  function getProviderIcon(provider: string) {
    const icons: Record<string, string> = {
      google_drive: 'fab fa-google-drive text-green-500',
      onedrive: 'fab fa-microsoft text-blue-500',
      sharepoint: 'fab fa-microsoft text-indigo-600',
      dropbox: 'fab fa-dropbox text-blue-600',
      box: 'fas fa-cube text-blue-700'
    };
    return icons[provider] || 'fas fa-cloud';
  }

  function getFileIcon(type: string) {
    const icons: Record<string, string> = {
      pdf: 'fas fa-file-pdf text-red-500',
      doc: 'fas fa-file-word text-blue-600',
      xls: 'fas fa-file-excel text-green-600',
      ppt: 'fas fa-file-powerpoint text-orange-600',
      txt: 'fas fa-file-alt text-slate-500'
    };
    return icons[type] || 'fas fa-file';
  }
}

function ChatInterfaceTab({ chatbot }: { chatbot: Chatbot }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  
  // Customization states
  const [welcomeMessage, setWelcomeMessage] = useState(
    `Hello! I'm ${chatbot.name}, your AI assistant. How can I help you today?`
  );
  const [chatName, setChatName] = useState(chatbot.name);
  const [placeholderText, setPlaceholderText] = useState('Type your message...');
  const [headerColor, setHeaderColor] = useState(chatbot.brandColor);
  const [userBubbleColor, setUserBubbleColor] = useState('#6366f1');
  const [botBubbleColor, setBotBubbleColor] = useState('#f1f5f9');
  const [fontSize, setFontSize] = useState('14');
  const [borderRadius, setBorderRadius] = useState('8');
  const [widgetPosition, setWidgetPosition] = useState(chatbot.widgetPosition || 'bottom-right');
  const [showAvatar, setShowAvatar] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(true);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Tell me more',
    'How does this work?',
    'Contact support'
  ]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'What are your business hours?',
    'How can I contact you?',
    'Tell me about your services'
  ]);
  
  const { toast } = useToast();

  // Set initial welcome message when component mounts
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      content: welcomeMessage,
      sender: 'bot',
      timestamp: new Date(),
    }]);
  }, [welcomeMessage]);

  const sendMessage = async (messageText: string, isInitial = false) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    if (!isInitial) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: trimmedMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
    }
    
    setIsTyping(true);

    try {
      const response = await authenticatedFetch(API_ENDPOINTS.RAG_CHAT, {
        method: 'POST',
        body: JSON.stringify({
          chatbot_id: chatbot.id,
          query: trimmedMessage,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Update session ID if this is first message
      if (!sessionId) {
        setSessionId(data.session_id);
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.answer,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get response from the chatbot. Please try again.",
        variant: "destructive"
      });
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Chat Preview</CardTitle>
            <p className="text-sm text-slate-600">
              Test your chatbot here to see how users will interact with it
            </p>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              {/* Chat Header */}
              <div 
                className="p-4 border-b flex items-center space-x-3 transition-colors duration-300"
                style={{ backgroundColor: headerColor }}
              >
                {showAvatar && (
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-robot text-slate-600 text-lg"></i>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{chatName}</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-white/90">Online • Typically replies instantly</p>
                  </div>
                </div>
                <button className="text-white/80 hover:text-white">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2.5 transition-all duration-300 ${
                          message.sender === 'user'
                            ? 'text-white shadow-md'
                            : 'text-slate-900 shadow-sm'
                        }`}
                        style={{
                          backgroundColor: message.sender === 'user' ? userBubbleColor : botBubbleColor,
                          borderRadius: `${borderRadius}px`,
                          fontSize: `${fontSize}px`
                        }}
                      >
                        <div className="text-sm chat-message">
                          {message.sender === 'bot' ? (
                            <div className="prose prose-sm dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                              <ReactMarkdown
                                components={{
                                  strong: ({...props}) => <span className="font-bold text-primary-600" {...props} />,
                                  em: ({...props}) => <span className="italic text-primary-500" {...props} />,
                                  ul: ({...props}) => <ul className="list-disc ml-4 mt-2" {...props} />,
                                  ol: ({...props}) => <ol className="list-decimal ml-4 mt-2" {...props} />,
                                  li: ({...props}) => <li className="mt-1" {...props} />,
                                  p: ({...props}) => <p className="mb-2" {...props} />,
                                  code: ({...props}) => (
                                    <code className="bg-primary-100 dark:bg-primary-900 px-1 py-0.5 rounded" {...props} />
                                  )
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            message.content
                          )}
                        </div>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && typingIndicator && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                      <div className="px-4 py-3 shadow-sm" style={{ backgroundColor: botBubbleColor, borderRadius: `${borderRadius}px` }}>
                        <div className="flex space-x-1.5">
                          <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                          <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Suggested Questions - Show when chat is empty */}
                  {messages.length === 1 && suggestedQuestions.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-xs text-slate-500 font-medium">Suggested questions:</p>
                      {suggestedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(question)}
                          className="block w-full text-left px-4 py-2 bg-white border border-slate-200 hover:border-primary hover:bg-primary/5 rounded-lg text-sm text-slate-700 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Replies */}
              {quickReplies.length > 0 && messages.length > 1 && (
                <div className="px-4 py-2 border-t bg-slate-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(reply)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary hover:bg-primary/5 rounded-full text-xs whitespace-nowrap transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <button className="text-slate-400 hover:text-slate-600">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={placeholderText}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                    data-testid="input-chat-message"
                    className="flex-1"
                  />
                  <button className="text-slate-400 hover:text-slate-600">
                    <i className="fas fa-smile"></i>
                  </button>
                  <Button 
                    onClick={() => sendMessage(inputMessage)} 
                    data-testid="button-send-message"
                    style={{ backgroundColor: headerColor }}
                    className="hover:opacity-90"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  Powered by Vyoma.ai
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Agent Customization</span>
              <Badge className="bg-blue-100 text-blue-800">Live Preview</Badge>
            </CardTitle>
            <p className="text-sm text-slate-600">
              Customize your AI agent's appearance and behavior in real-time
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appearance">
                  <i className="fas fa-palette mr-2"></i>
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <i className="fas fa-comment-dots mr-2"></i>
                  Messages
                </TabsTrigger>
                <TabsTrigger value="behavior">
                  <i className="fas fa-cog mr-2"></i>
                  Behavior
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <i className="fas fa-sliders-h mr-2"></i>
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Agent Name</Label>
                  <Input
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    className="mt-1.5"
                    placeholder="My AI Assistant"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Header Color</Label>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <input
                        type="color"
                        value={headerColor}
                        onChange={(e) => setHeaderColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={headerColor}
                        onChange={(e) => setHeaderColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">User Bubble Color</Label>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <input
                        type="color"
                        value={userBubbleColor}
                        onChange={(e) => setUserBubbleColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={userBubbleColor}
                        onChange={(e) => setUserBubbleColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Font Size: {fontSize}px</Label>
                    <input
                      type="range"
                      min="12"
                      max="18"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full mt-1.5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Border Radius: {borderRadius}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(e.target.value)}
                      className="w-full mt-1.5"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Show Avatar</Label>
                    <p className="text-xs text-slate-500">Display agent icon in chat header</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showAvatar}
                    onChange={(e) => setShowAvatar(e.target.checked)}
                    className="w-5 h-5"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Widget Position</Label>
                  <select
                    value={widgetPosition}
                    onChange={(e) => setWidgetPosition(e.target.value)}
                    className="w-full mt-1.5 p-2 border rounded-md"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </div>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Welcome Message</Label>
                  <Textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="mt-1.5"
                    rows={3}
                    placeholder="Hello! How can I help you today?"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    First message users see when opening the chat
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Input Placeholder</Label>
                  <Input
                    value={placeholderText}
                    onChange={(e) => setPlaceholderText(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Suggested Questions</Label>
                  <p className="text-xs text-slate-500 mb-2">
                    Show these questions when chat opens
                  </p>
                  {suggestedQuestions.map((question, idx) => (
                    <div key={idx} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={question}
                        onChange={(e) => {
                          const newQuestions = [...suggestedQuestions];
                          newQuestions[idx] = e.target.value;
                          setSuggestedQuestions(newQuestions);
                        }}
                        className="flex-1"
                      />
                      <button
                        onClick={() => {
                          setSuggestedQuestions(suggestedQuestions.filter((_, i) => i !== idx));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSuggestedQuestions([...suggestedQuestions, 'New question'])}
                    className="w-full"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Question
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Quick Replies</Label>
                  <p className="text-xs text-slate-500 mb-2">
                    Quick action buttons during conversation
                  </p>
                  {quickReplies.map((reply, idx) => (
                    <div key={idx} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={reply}
                        onChange={(e) => {
                          const newReplies = [...quickReplies];
                          newReplies[idx] = e.target.value;
                          setQuickReplies(newReplies);
                        }}
                        className="flex-1"
                      />
                      <button
                        onClick={() => {
                          setQuickReplies(quickReplies.filter((_, i) => i !== idx));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickReplies([...quickReplies, 'Quick reply'])}
                    className="w-full"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Reply
                  </Button>
                </div>
              </TabsContent>

              {/* Behavior Tab */}
              <TabsContent value="behavior" className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Typing Indicator</Label>
                    <p className="text-xs text-slate-500">Show "..." when agent is responding</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={typingIndicator}
                    onChange={(e) => setTypingIndicator(e.target.checked)}
                    className="w-5 h-5"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Response Style</Label>
                  <select className="w-full mt-1.5 p-2 border rounded-md">
                    <option>Professional & Formal</option>
                    <option>Friendly & Conversational</option>
                    <option>Concise & Direct</option>
                    <option>Detailed & Educational</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Response Tone</Label>
                  <select className="w-full mt-1.5 p-2 border rounded-md">
                    <option>Helpful & Supportive</option>
                    <option>Enthusiastic & Energetic</option>
                    <option>Calm & Reassuring</option>
                    <option>Expert & Authoritative</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Max Response Length (words)</Label>
                  <Input
                    type="number"
                    defaultValue="150"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Keep responses concise and focused
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Fallback Message</Label>
                  <Textarea
                    defaultValue="I'm not sure I understand. Could you please rephrase your question?"
                    className="mt-1.5"
                    rows={2}
                  />
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Enable File Upload</Label>
                    <p className="text-xs text-slate-500">Let users upload documents</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Enable Voice Input</Label>
                    <p className="text-xs text-slate-500">Speech-to-text functionality</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Show Powered By Badge</Label>
                    <p className="text-xs text-slate-500">Display "Powered by Vyoma.ai"</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Operating Hours</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <Input type="time" defaultValue="09:00" />
                    <Input type="time" defaultValue="17:00" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Show offline message outside these hours
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Offline Message</Label>
                  <Textarea
                    defaultValue="We're currently offline. Leave a message and we'll get back to you!"
                    className="mt-1.5"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Chat Language</Label>
                  <select className="w-full mt-1.5 p-2 border rounded-md">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Portuguese</option>
                    <option>Japanese</option>
                    <option>Chinese</option>
                  </select>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="flex space-x-2">
              <Button 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Customizations Saved",
                    description: "Your AI agent settings have been updated successfully.",
                  });
                }}
              >
                <i className="fas fa-save mr-2"></i>
                Save All Changes
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Reset to defaults
                  setChatName(chatbot.name);
                  setHeaderColor(chatbot.brandColor);
                  setUserBubbleColor('#6366f1');
                  setBotBubbleColor('#f1f5f9');
                  setFontSize('14');
                  setBorderRadius('8');
                  toast({
                    title: "Reset to Defaults",
                    description: "All customizations have been reset.",
                  });
                }}
              >
                <i className="fas fa-undo mr-2"></i>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsTab({ chatbotId }: { chatbotId: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Conversations</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-comments text-blue-600"></i>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">
              <i className="fas fa-arrow-up mr-1"></i>
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                <p className="text-2xl font-bold">1.2s</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-green-600"></i>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">
              <i className="fas fa-arrow-down mr-1"></i>
              -0.3s from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">User Satisfaction</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-yellow-600"></i>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">
              <i className="fas fa-arrow-up mr-1"></i>
              +2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Resolution Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-purple-600"></i>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">
              <i className="fas fa-arrow-up mr-1"></i>
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-slate-500">
                <i className="fas fa-chart-line text-2xl mb-2"></i>
                <p>Chart visualization would go here</p>
                <p className="text-sm">Showing conversation trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">How do I reset my password?</span>
                <Badge variant="secondary">23 asks</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">What are your business hours?</span>
                <Badge variant="secondary">18 asks</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">How can I contact support?</span>
                <Badge variant="secondary">15 asks</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">What payment methods do you accept?</span>
                <Badge variant="secondary">12 asks</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">How do I track my order?</span>
                <Badge variant="secondary">10 asks</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
          <p className="text-sm text-slate-600">
            Download detailed reports and conversation logs
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <i className="fas fa-download mr-2"></i>
              Export CSV
            </Button>
            <Button variant="outline">
              <i className="fas fa-file-pdf mr-2"></i>
              Export PDF Report
            </Button>
            <Button variant="outline">
              <i className="fas fa-database mr-2"></i>
              Export Raw Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmbedExportTab({ chatbot }: { chatbot: Chatbot }) {
  const [copied, setCopied] = useState('');
  const [embedType, setEmbedType] = useState<'iframe' | 'script' | 'popup'>('popup');
  const [widgetSize, setWidgetSize] = useState({ width: '400', height: '600' });
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const apiUrl = 'http://49.249.160.198:8006'; // Updated to match your backend from api-config.ts
  
  // Popup Widget (Recommended)
  const popupWidgetCode = `<!-- Vyoma AI Chat Widget -->
<script
  src="${baseUrl}/widget.js"
  data-chatbot-id="${chatbot.id}"
  data-api-url="${apiUrl}"
  data-position="${chatbot.widgetPosition || 'bottom-right'}"
  data-color="${chatbot.brandColor || '#6366f1'}"
  data-button-text="Chat with us"
  async
></script>`;

  // Direct Iframe Code  
  const iframeCode = `<!-- Vyoma AI Chat Widget (Iframe) -->
<iframe
  src="${baseUrl}/widget.html?id=${chatbot.id}&api=${apiUrl}"
  width="${widgetSize.width}"
  height="${widgetSize.height}"
  frameborder="0"
  allow="microphone"
  style="position: fixed; ${chatbot.widgetPosition?.includes('bottom') ? 'bottom' : 'top'}: 20px; ${chatbot.widgetPosition?.includes('right') ? 'right' : 'left'}: 20px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 9999;"
></iframe>`;

  // JavaScript Snippet
  const jsCode = `<!-- Vyoma AI Chat Widget (Custom JS) -->
<script>
(function() {
  var iframe = document.createElement('iframe');
  iframe.src = '${baseUrl}/widget.html?id=${chatbot.id}&api=${apiUrl}';
  iframe.style.cssText = 'position: fixed; ${chatbot.widgetPosition?.includes('bottom') ? 'bottom' : 'top'}: 20px; ${chatbot.widgetPosition?.includes('right') ? 'right' : 'left'}: 20px; width: ${widgetSize.width}px; height: ${widgetSize.height}px; border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 9999;';
  iframe.setAttribute('allow', 'microphone');
  document.body.appendChild(iframe);
})();
</script>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "Copied to clipboard!",
      description: "Paste this code into your website's HTML.",
    });
    setTimeout(() => setCopied(''), 3000);
  };

  const openPreview = () => {
    window.open(`${baseUrl}/widget.html?id=${chatbot.id}&api=${apiUrl}`, 'Widget Preview', 'width=400,height=700');
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Embed & Share</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Add your AI agent to any website in minutes
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={openPreview}>
            <i className="fas fa-external-link-alt mr-2"></i>
            Test Widget
          </Button>
          <Button onClick={() => {
            const code = embedType === 'popup' ? popupWidgetCode : embedType === 'iframe' ? iframeCode : jsCode;
            copyToClipboard(code, embedType);
          }}>
            <i className="fas fa-download mr-2"></i>
            Get Code
          </Button>
        </div>
      </div>

      {/* Embed Options */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Integration Method</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select how you want to add the chatbot to your website
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={embedType} onValueChange={(v) => setEmbedType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="popup" className="flex items-center gap-2">
                <i className="fas fa-comments"></i>
                <span>Popup Widget</span>
                <Badge className="ml-1 bg-green-100 text-green-800 text-[10px] px-1.5 py-0">Recommended</Badge>
              </TabsTrigger>
              <TabsTrigger value="iframe" className="flex items-center gap-2">
                <i className="fas fa-window-maximize"></i>
                <span>Iframe Embed</span>
              </TabsTrigger>
              <TabsTrigger value="script" className="flex items-center gap-2">
                <i className="fas fa-code"></i>
                <span>Custom Script</span>
              </TabsTrigger>
            </TabsList>

            {/* Popup Widget */}
            <TabsContent value="popup" className="space-y-4 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-star text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Best Choice</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      A floating chat button appears in the corner. Visitors can click to open/close the chat. Perfect for all websites.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-sm font-semibold">Installation Code</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(popupWidgetCode, 'popup')}
                  >
                    {copied === 'popup' ? (
                      <>
                        <i className="fas fa-check mr-2 text-green-600"></i>
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy mr-2"></i>
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-slate-900 dark:bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-700">
                  <pre>{popupWidgetCode}</pre>
                </div>
                <div className="mt-3 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <i className="fas fa-info-circle mt-0.5"></i>
                  <p>Paste this code before the closing <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag in your HTML</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label className="text-sm">Features</Label>
                  <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Floating chat button
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Open/close animation
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Mobile responsive
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Customizable position & color
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Compatible With</Label>
                  <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <i className="fab fa-wordpress text-blue-600"></i>
                      WordPress
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fab fa-shopify text-green-600"></i>
                      Shopify
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fab fa-wix text-slate-700"></i>
                      Wix, Squarespace
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-code text-purple-600"></i>
                      Any HTML website
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Iframe Embed */}
            <TabsContent value="iframe" className="space-y-4 mt-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-info-circle text-amber-600 dark:text-amber-400"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">Fixed Position</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Chat window is always visible in a fixed position. Good for dedicated support pages or dashboards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Width (px)</Label>
                  <Input
                    type="number"
                    value={widgetSize.width}
                    onChange={(e) => setWidgetSize({ ...widgetSize, width: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm">Height (px)</Label>
                  <Input
                    type="number"
                    value={widgetSize.height}
                    onChange={(e) => setWidgetSize({ ...widgetSize, height: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-sm font-semibold">Iframe Code</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(iframeCode, 'iframe')}
                  >
                    {copied === 'iframe' ? (
                      <>
                        <i className="fas fa-check mr-2 text-green-600"></i>
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy mr-2"></i>
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-slate-900 dark:bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-700">
                  <pre>{iframeCode}</pre>
                </div>
              </div>
            </TabsContent>

            {/* Custom Script */}
            <TabsContent value="script" className="space-y-4 mt-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-code text-purple-600 dark:text-purple-400"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">For Developers</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Programmatically add the chat widget. Full control over loading and initialization.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-sm font-semibold">JavaScript Snippet</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(jsCode, 'script')}
                  >
                    {copied === 'script' ? (
                      <>
                        <i className="fas fa-check mr-2 text-green-600"></i>
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy mr-2"></i>
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-slate-900 dark:bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-700">
                  <pre>{jsCode}</pre>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Programmatic Control</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  When using the popup widget, you can control it programmatically:
                </p>
                <div className="bg-slate-900 dark:bg-slate-950 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto border border-slate-700">
                  <pre>{`// Open the widget
window.VyomaWidget.open();

// Close the widget
window.VyomaWidget.close();

// Toggle the widget
window.VyomaWidget.toggle();

// Check if widget is open
window.VyomaWidget.isOpen();`}</pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Start Guide & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fas fa-rocket text-blue-500"></i>
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Copy the embed code</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Choose your integration method above and click "Copy Code"
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Paste into your website</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Add the code before the <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag in your HTML
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Test it out</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Visit your website and see your AI agent in action!
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Current Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Position:</span>
                  <span className="font-medium">{chatbot.widgetPosition || 'bottom-right'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Brand Color:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-slate-300" 
                      style={{ background: chatbot.brandColor || '#6366f1' }}
                    ></div>
                    <span className="font-medium">{chatbot.brandColor || '#6366f1'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Status:</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <i className="fas fa-circle text-[8px] mr-1"></i>
                    Active
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/chatbot/${chatbot.id}?tab=chat`}>
                  <i className="fas fa-cog mr-2"></i>
                  Customize Appearance
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fas fa-plug text-purple-500"></i>
              Platform Integrations
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              One-click installations for popular platforms
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <i className="fab fa-wordpress mr-3 text-blue-600 text-xl"></i>
                <div className="text-left">
                  <div className="font-semibold">WordPress</div>
                  <div className="text-xs text-slate-500">Install via plugin</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <i className="fab fa-shopify mr-3 text-green-600 text-xl"></i>
                <div className="text-left">
                  <div className="font-semibold">Shopify</div>
                  <div className="text-xs text-slate-500">Add to your store</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <i className="fab fa-wix mr-3 text-slate-700 text-xl"></i>
                <div className="text-left">
                  <div className="font-semibold">Wix & Squarespace</div>
                  <div className="text-xs text-slate-500">Embed widget</div>
                </div>
              </div>
              <i className="fas fa-external-link-alt text-slate-400"></i>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <i className="fab fa-react mr-3 text-blue-400 text-xl"></i>
                <div className="text-left">
                  <div className="font-semibold">React/Next.js</div>
                  <div className="text-xs text-slate-500">Component library</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
            </Button>

            <Separator className="my-4" />

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-book text-blue-500 text-lg"></i>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    Check our documentation for detailed integration guides
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs" asChild>
                    <Link href="/documentation">
                      View Documentation <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domain Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-shield-alt text-green-500"></i>
            Security & Domain Settings
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Control which domains can embed your AI agent for enhanced security
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Allowed Domains</Label>
              <Textarea
                placeholder="example.com&#10;app.example.com&#10;*.mydomain.com"
                defaultValue={chatbot.name ? `${chatbot.name.toLowerCase().replace(/\s+/g, '')}.com` : ''}
                className="mt-2 font-mono text-sm dark:bg-slate-800"
                rows={4}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-2">
                <i className="fas fa-info-circle mt-0.5"></i>
                <span>Enter one domain per line. Use * for wildcards. Leave empty to allow all domains.</span>
              </p>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <i className="fas fa-exclamation-triangle text-amber-600 dark:text-amber-400 mt-0.5"></i>
              <div className="flex-1">
                <input type="checkbox" id="allowAll" className="rounded mr-2" />
                <Label htmlFor="allowAll" className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Allow embedding on any domain
                </Label>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Not recommended for production. Anyone can embed your chatbot on their website.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1">
                <i className="fas fa-save mr-2"></i>
                Save Domain Settings
              </Button>
              <Button variant="outline">
                <i className="fas fa-undo mr-2"></i>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-chart-line text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Track Your Widget Performance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Monitor conversations, response times, and user satisfaction in real-time. See detailed analytics in the Analytics tab.
              </p>
              <Button variant="default" asChild>
                <Link href={`/chatbot/${chatbot.id}?tab=analytics`}>
                  <i className="fas fa-chart-bar mr-2"></i>
                  View Analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}