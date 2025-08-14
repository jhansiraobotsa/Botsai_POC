import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Chatbot } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: chatbots, isLoading } = useQuery<Chatbot[]>({
    queryKey: ["/api/chatbots"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Logout Failed",
        description: error.message || "Unable to log out",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6">
            <div className="mb-6">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">My Chatbots</h3>
            <p className="text-slate-600">Manage and monitor your deployed chatbots</p>
          </div>

          {!chatbots || chatbots.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <i className="fas fa-robot text-4xl text-slate-400 mb-4"></i>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">No chatbots yet</h4>
                <p className="text-slate-600 mb-6">Create your first chatbot to get started</p>
                <Link to="/create">
                  <Button data-testid="button-create-first-chatbot">
                    <i className="fas fa-plus mr-2"></i>
                    Create Your First Chatbot
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {chatbots.map((chatbot) => (
                <Card key={chatbot.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900" data-testid={`text-chatbot-name-${chatbot.id}`}>
                          {chatbot.name}
                        </h4>
                        <p className="text-sm text-slate-600">{chatbot.industry}</p>
                      </div>
                      <Badge 
                        variant={chatbot.isActive ? "default" : "secondary"}
                        data-testid={`status-${chatbot.id}`}
                      >
                        {chatbot.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                      <span>0 conversations</span>
                      <span>N/A satisfaction</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/chatbots/${chatbot.id}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-${chatbot.id}`}>
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" data-testid={`button-embed-${chatbot.id}`}>
                        Embed Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardHeader({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div className="bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <i className="fas fa-robot text-primary text-xl"></i>
          <span className="text-white font-semibold">ChatBot Builder Dashboard</span>
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
        <Link to="/" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg bg-slate-100">
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
