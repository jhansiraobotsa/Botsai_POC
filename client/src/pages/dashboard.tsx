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

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const { data: chatbots, isLoading: isChatbotsLoading } = useQuery<Chatbot[]>({
    queryKey: ["/api/chatbots"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/chatbots", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch chatbots");
      return res.json();
    },
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Goodbye!",
      description: "You have been logged out successfully.",
    });
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