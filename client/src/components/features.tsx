export default function Features() {
  const features = [
    {
      icon: "fas fa-file-upload",
      title: "Enterprise Knowledge Base",
      description: "Transform your documents, policies, and institutional knowledge into an intelligent AI agent that delivers instant, accurate responses.",
      color: "bg-primary"
    },
    {
      icon: "fas fa-globe",
      title: "Automated Knowledge Extraction",
      description: "Intelligently crawl and synthesize your digital assets to create a comprehensive, self-learning knowledge ecosystem.",
      color: "bg-secondary"
    },
    {
      icon: "fas fa-code",
      title: "Seamless Integration",
      description: "Deploy AI agents across your entire digital infrastructure with enterprise-grade APIs and embeddable components.",
      color: "bg-accent"
    },
    {
      icon: "fas fa-industry",
      title: "Industry-Tailored Solutions",
      description: "Pre-configured agent frameworks optimized for healthcare, financial services, retail, education, and enterprise sectors.",
      color: "bg-green-500"
    },
    {
      icon: "fas fa-palette",
      title: "White-Label Customization",
      description: "Fully branded AI experiences that align with your corporate identity and customer touchpoints.",
      color: "bg-orange-500"
    },
    {
      icon: "fas fa-chart-line",
      title: "Advanced Analytics & Insights",
      description: "Real-time intelligence on agent performance, user engagement patterns, and ROI metrics with actionable business insights.",
      color: "bg-red-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Enterprise-Grade AI Agent Orchestration Platform
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            From intelligent knowledge extraction to seamless deployment—everything your organization needs to lead with AI.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-lg`}>
                <i className={`${feature.icon} text-white text-xl group-hover:text-white`}></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-all duration-300">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">{feature.description}</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
