export default function Features() {
  const features = [
    {
      icon: "fas fa-file-upload",
      title: "Document Intelligence",
      description: "Upload PDFs, docs, and text files. Our AI extracts knowledge to power your chatbot responses.",
      color: "bg-primary"
    },
    {
      icon: "fas fa-globe",
      title: "Website Crawling",
      description: "Automatically scrape and analyze your website content for comprehensive chatbot training.",
      color: "bg-secondary"
    },
    {
      icon: "fas fa-code",
      title: "Easy Embed",
      description: "Get iframe code and embed your chatbot anywhere. Works on any website or platform.",
      color: "bg-accent"
    },
    {
      icon: "fas fa-industry",
      title: "Industry Specific",
      description: "Optimized templates for healthcare, e-commerce, education, finance, and more.",
      color: "bg-green-500"
    },
    {
      icon: "fas fa-palette",
      title: "Custom Branding",
      description: "Match your brand with custom colors, logos, and messaging styles.",
      color: "bg-orange-500"
    },
    {
      icon: "fas fa-chart-line",
      title: "Analytics",
      description: "Track conversations, user satisfaction, and chatbot performance with detailed insights.",
      color: "bg-red-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to build intelligent chatbots
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From document analysis to custom branding, we've got you covered.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white border border-slate-200 p-8 rounded-2xl hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-lg`}>
                <i className={`${feature.icon} text-white text-xl group-hover:text-white`}></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-primary transition-all duration-300">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">{feature.description}</p>
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
