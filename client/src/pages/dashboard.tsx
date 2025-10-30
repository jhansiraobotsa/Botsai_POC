import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Chatbot } from "@shared/schema";
import DashboardLayout from "@/components/dashboard-layout";
import { useTheme } from "@/components/theme-provider";
import { API_ENDPOINTS, transformFastAPIToFrontend, authenticatedFetch } from "@/lib/api-config";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const { data: chatbots, isLoading: isChatbotsLoading } = useQuery<Chatbot[]>({
    queryKey: ["chatbots", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const userId = user.id;
      console.log("Fetching chatbots for user:", userId);
      const res = await authenticatedFetch(API_ENDPOINTS.CHATBOT_BY_USER(userId));
      if (!res.ok) {
        console.error("Failed to fetch chatbots:", res.status, res.statusText);
        throw new Error("Failed to fetch chatbots");
      }
      const data = await res.json();
      console.log("Chatbots fetched:", data);
      // Transform each chatbot from FastAPI format to frontend format
      return Array.isArray(data) ? data.map(transformFastAPIToFrontend) : [];
    },
    enabled: !!user?.id,
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Goodbye!",
      description: "You have been logged out successfully.",
    });
    setLocation("/login");
  };

  if (isLoading || isChatbotsLoading) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-primary' : 'text-slate-900'}`}>My Chatbots</h3>
        <p className={`text-slate-600 ${theme === 'dark' ? 'text-secondary' : ''}`}>Manage and monitor your deployed chatbots</p>
      </div>

      {!chatbots || chatbots.length === 0 ? (
        <Card className="text-center py-12 dark:bg-slate-800 dark:border-slate-700">
          <CardContent>
            <i className="fas fa-robot text-4xl text-slate-400 mb-4"></i>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No agents yet</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Create your first AI agent to get started</p>
            <Link to="/select-agent">
              <Button data-testid="button-create-first-chatbot">
                <i className="fas fa-plus mr-2"></i>
                Create Your First Agent
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
                    variant={chatbot.status === "active" ? "default" : "secondary"}
                    data-testid={`status-${chatbot.id}`}
                  >
                    {chatbot.status === "active" ? "Active" : "Inactive"}
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
    </DashboardLayout>
  );
}