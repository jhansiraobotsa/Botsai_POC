import { Switch, Route, Redirect } from "wouter";
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
import FeaturesPage from "@/pages/features";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import DocumentationPage from "@/pages/documentation";
import PricingPage from "@/pages/pricing-page";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";

// Protected Route Component
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Landing} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/documentation" component={DocumentationPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Protected Pages */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/create">
        {() => <ProtectedRoute component={CreateChatbot} />}
      </Route>
      <Route path="/edit/:id">
        {(params) => <ProtectedRoute component={CreateChatbot} params={params} />}
      </Route>
      <Route path="/chatbots/:id">
        {(params) => <ProtectedRoute component={ChatbotDetail} params={params} />}
      </Route>
      <Route path="/chatbot/:id">
        {(params) => <ProtectedRoute component={ChatbotDetail} params={params} />}
      </Route>
      
      {/* 404 */}
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
