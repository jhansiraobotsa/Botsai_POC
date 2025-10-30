import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/dashboard-layout";

export default function SelectAgent() {
  const [, setLocation] = useLocation();

  const agentTypes = [
    {
      id: "document",
      title: "Document Agent",
      description: "Create AI chatbots powered by your documents and website content",
      icon: "fa-file-alt",
      features: [
        "Upload PDFs, DOCX, TXT files",
        "Web scraping capabilities",
        "RAG-based responses",
        "Embed anywhere",
      ],
      available: true,
      badge: "Popular",
      badgeColor: "bg-blue-500",
      route: "/create",
    },
    {
      id: "database",
      title: "Database Agent",
      description: "Connect to databases and create intelligent query assistants",
      icon: "fa-database",
      features: [
        "Multiple database integrations",
        "Natural language to SQL",
        "Real-time data queries",
        "Secure connections",
      ],
      available: true,
      badge: "New",
      badgeColor: "bg-green-500",
      route: "/database-agent/create",
    },
    {
      id: "orchestration",
      title: "Agentic Orchestration",
      description: "Advanced multi-agent workflows and task automation",
      icon: "fa-project-diagram",
      features: [
        "Multi-agent coordination",
        "Complex workflow automation",
        "Custom tool integration",
        "Enterprise-grade security",
      ],
      available: false,
      badge: "Coming Soon",
      badgeColor: "bg-amber-500",
      route: null,
    },
  ];

  const handleSelectAgent = (agent: typeof agentTypes[0]) => {
    if (!agent.available) {
      // Show contact sales modal or redirect
      window.open("mailto:sales@techraq.com?subject=Agentic%20Orchestration%20Inquiry", "_blank");
      return;
    }
    if (agent.route) {
      setLocation(agent.route);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Choose Your Agent Type
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Select the type of AI agent you want to create
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {agentTypes.map((agent) => (
            <Card
              key={agent.id}
              className={`relative transition-all duration-300 ${
                agent.available
                  ? "hover:shadow-xl hover:scale-105 cursor-pointer border-2 hover:border-primary dark:hover:border-primary"
                  : "opacity-75"
              } dark:bg-slate-800 dark:border-slate-700`}
              onClick={() => handleSelectAgent(agent)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${
                    agent.id === "document" ? "from-blue-500 to-blue-600" :
                    agent.id === "database" ? "from-green-500 to-green-600" :
                    "from-amber-500 to-amber-600"
                  } flex items-center justify-center`}>
                    <i className={`fas ${agent.icon} text-2xl text-white`}></i>
                  </div>
                  <Badge className={`${agent.badgeColor} text-white border-0`}>
                    {agent.badge}
                  </Badge>
                </div>
                <CardTitle className="text-slate-900 dark:text-white mb-2">
                  {agent.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {agent.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                      <i className="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={agent.available ? "default" : "outline"}
                  disabled={!agent.available}
                >
                  {agent.available ? (
                    <>
                      <i className="fas fa-arrow-right mr-2"></i>
                      Get Started
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope mr-2"></i>
                      Contact Sales
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

