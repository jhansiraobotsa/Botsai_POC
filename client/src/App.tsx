import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import CreateChatbot from "@/pages/create-chatbot";
import ChatbotDetail from "@/pages/chatbot-detail";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  // Remove auth gating for all routes
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create" component={CreateChatbot} />
      <Route path="/edit/:id" component={CreateChatbot} />
      <Route path="/chatbots/:id" component={ChatbotDetail} />
      <Route path="/chatbot/:id" component={ChatbotDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
