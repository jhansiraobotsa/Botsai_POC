import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FeaturesPage() {
  const features = [
    {
      icon: "fa-brain",
      title: "Advanced AI Technology",
      description: "Powered by state-of-the-art GPT models from OpenAI, Claude from Anthropic, and Google's Gemini for natural conversations.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: "fa-file-alt",
      title: "Document Intelligence",
      description: "Upload PDFs, Word docs, spreadsheets, and more. Our RAG (Retrieval Augmented Generation) technology extracts and understands your content.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: "fa-globe",
      title: "Multi-Language Support",
      description: "Communicate with customers in 95+ languages. Automatic translation ensures global reach without language barriers.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: "fa-palette",
      title: "Full Customization",
      description: "Match your brand with custom colors, avatars, welcome messages, and positioning. Make it truly yours.",
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    },
    {
      icon: "fa-chart-line",
      title: "Real-time Analytics",
      description: "Track conversations, user satisfaction, response times, and popular queries. Make data-driven decisions.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: "fa-code",
      title: "Easy Integration",
      description: "One-line embed code, WordPress plugin, Shopify app, React component, or REST API. Deploy anywhere in minutes.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      icon: "fa-lock",
      title: "Enterprise Security",
      description: "SOC 2 Type II compliant, GDPR ready, end-to-end encryption. Your data is always protected.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: "fa-bolt",
      title: "Lightning Fast",
      description: "Sub-second response times with CDN delivery and optimized infrastructure. Never keep customers waiting.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      icon: "fa-users",
      title: "Team Collaboration",
      description: "Multiple team members, role-based access, shared chatbots, and unified inbox for complex organizations.",
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    },
    {
      icon: "fa-robot",
      title: "AI Training",
      description: "Continuously learns from interactions. Fine-tune responses, add custom knowledge, and improve over time.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: "fa-calendar",
      title: "Smart Scheduling",
      description: "Integrated appointment booking, calendar sync, and automated reminders. Turn chats into bookings.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: "fa-mobile-alt",
      title: "Mobile Optimized",
      description: "Perfect experience on every device. Responsive design ensures great UX on phones, tablets, and desktops.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const integrations = [
    { name: "Slack", icon: "fab fa-slack", color: "text-purple-600" },
    { name: "Microsoft Teams", icon: "fab fa-microsoft", color: "text-blue-600" },
    { name: "Zapier", icon: "fas fa-bolt", color: "text-orange-600" },
    { name: "Salesforce", icon: "fab fa-salesforce", color: "text-blue-400" },
    { name: "HubSpot", icon: "fas fa-cog", color: "text-orange-500" },
    { name: "Google Workspace", icon: "fab fa-google", color: "text-red-600" },
    { name: "Shopify", icon: "fab fa-shopify", color: "text-green-600" },
    { name: "WordPress", icon: "fab fa-wordpress", color: "text-blue-700" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4">Powered by TechRAQ</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Features That Drive Results
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Everything you need to create intelligent, engaging chatbots that delight customers and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </Link>
            <Link to="/documentation">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features, Simple Interface
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Built for everyone, No coding required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <i className={`fas ${feature.icon} text-2xl ${feature.color}`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Seamless Integrations
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Connect with your favorite tools and platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <i className={`${integration.icon} text-4xl ${integration.color} mb-3`}></i>
                  <p className="font-medium text-slate-900 dark:text-white">{integration.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses using Vyoma.ai to enhance customer experience
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Your Chatbot Now
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

