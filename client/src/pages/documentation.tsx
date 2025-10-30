import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "wouter";

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      title: "Getting Started",
      icon: "fa-rocket",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      articles: [
        { title: "Quick Start Guide", time: "5 min read", popular: true },
        { title: "Create Your First Chatbot", time: "10 min read", popular: true },
        { title: "Understanding the Dashboard", time: "8 min read" },
        { title: "Basic Configuration", time: "7 min read" }
      ]
    },
    {
      title: "Features & Capabilities",
      icon: "fa-star",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      articles: [
        { title: "Document Upload & Processing", time: "12 min read", popular: true },
        { title: "Multi-Language Support", time: "6 min read" },
        { title: "Custom Branding", time: "8 min read" },
        { title: "Analytics & Insights", time: "10 min read" }
      ]
    },
    {
      title: "Integration",
      icon: "fa-puzzle-piece",
      color: "text-green-600",
      bgColor: "bg-green-100",
      articles: [
        { title: "Website Embed Code", time: "5 min read", popular: true },
        { title: "WordPress Plugin", time: "7 min read" },
        { title: "Shopify App Integration", time: "8 min read" },
        { title: "React Component", time: "10 min read" }
      ]
    },
    {
      title: "API Reference",
      icon: "fa-code",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      articles: [
        { title: "Authentication", time: "8 min read", popular: true },
        { title: "REST API Overview", time: "15 min read" },
        { title: "WebSocket API", time: "12 min read" },
        { title: "Rate Limits & Quotas", time: "5 min read" }
      ]
    },
    {
      title: "Advanced Topics",
      icon: "fa-graduation-cap",
      color: "text-red-600",
      bgColor: "bg-red-100",
      articles: [
        { title: "AI Training & Fine-tuning", time: "20 min read" },
        { title: "Custom Integrations", time: "18 min read" },
        { title: "Security Best Practices", time: "15 min read" },
        { title: "Performance Optimization", time: "12 min read" }
      ]
    },
    {
      title: "Troubleshooting",
      icon: "fa-tools",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      articles: [
        { title: "Common Issues & Solutions", time: "10 min read", popular: true },
        { title: "Debugging Chat Responses", time: "8 min read" },
        { title: "Integration Problems", time: "12 min read" },
        { title: "Performance Issues", time: "10 min read" }
      ]
    }
  ];

  const quickLinks = [
    { icon: "fa-play-circle", title: "Video Tutorials", description: "Step-by-step video guides" },
    { icon: "fa-book", title: "API Docs", description: "Complete API reference" },
    { icon: "fa-question-circle", title: "FAQ", description: "Frequently asked questions" },
    { icon: "fa-comments", title: "Community", description: "Join our Discord" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Documentation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Everything you need to build amazing chatbots with Vyoma.ai
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <Input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${link.icon} text-2xl text-primary`}></i>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {link.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 ${section.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`fas ${section.icon} text-2xl ${section.color}`}></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {section.articles.map((article, articleIndex) => (
                      <a
                        key={articleIndex}
                        href="#"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <i className="fas fa-file-alt text-slate-400 group-hover:text-primary"></i>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-900 dark:text-white font-medium group-hover:text-primary">
                                {article.title}
                              </span>
                              {article.popular && (
                                <Badge variant="secondary" className="text-xs">Popular</Badge>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{article.time}</span>
                          </div>
                        </div>
                        <i className="fas fa-arrow-right text-slate-400 group-hover:text-primary"></i>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Example Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Developer Friendly</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Powerful API & SDKs
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Integrate Vyoma.ai into your applications with our RESTful API. 
                We provide SDKs for popular languages and frameworks.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">RESTful API with JSON responses</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">WebSocket support for real-time</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">SDKs for JavaScript, Python, PHP</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Comprehensive documentation</span>
                </li>
              </ul>
              <Link to="/register">
                <a className="inline-flex items-center text-primary font-semibold hover:underline">
                  Get API Keys <i className="fas fa-arrow-right ml-2"></i>
                </a>
              </Link>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-slate-400 text-sm">API Example</span>
                  </div>
                  <div className="p-6 text-green-400 font-mono text-sm overflow-x-auto">
                    <pre>{`// Initialize Vyoma.ai
const vyoma = require('@vyoma/sdk');

vyoma.init({
  apiKey: 'YOUR_API_KEY'
});

// Send a message
const response = await vyoma.chat({
  chatbotId: 'chatbot_123',
  message: 'Hello, how can I help?',
  sessionId: 'session_456'
});

console.log(response.answer);`}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our support team is here to help you succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <a className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-slate-100 transition-colors">
                Contact Support
              </a>
            </Link>
            <a href="#" className="inline-block px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
              Join Community
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

