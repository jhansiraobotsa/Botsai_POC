import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Pricing() {
  const handleContactSales = () => {
    // Contact sales functionality placeholder
    console.log("Contact sales clicked");
  };

  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/14 days",
      description: "Essential AI agent for customer engagement",
      features: [
        "1 AI agent deployment",
        "100 intelligent interactions/month",
        "5 knowledge document uploads",
        "Basic white-label customization",
        "Email support"
      ],
      restrictedFeatures: [
        "Industry-specific agent frameworks",
        "Commerce platform integration",
        "Lead qualification automation",
        "Advanced intelligence analytics"
      ],
      cta: "Begin Trial",
      ctaLink: "/login",
      variant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Complete AI agent orchestration platform",
      features: [
        "5 AI agents (all industry verticals)",
        "1 MCP service per agent",
        "2,000 intelligent interactions/month",
        "20 knowledge base documents",
        "Advanced agent customization",
        "E-commerce platform integration",
        "Automated lead qualification",
        "Real-time analytics dashboard",
        "Priority technical support"
      ],
      cta: "Deploy Now",
      ctaLink: "/login",
      variant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "Enterprise-scale AI transformation solution",
      features: [
        "Unlimited AI agent deployments",
        "20,000 intelligent interactions/month",
        "3 MCP services per agent",
        "Unlimited knowledge base capacity",
        "Full white-label solution",
        "Custom API & system integrations",
        "Advanced intelligence & ROI analytics",
        "Multi-language agent capabilities",
        "24/7 dedicated success team"
      ],
      cta: "Contact Sales",
      ctaAction: handleContactSales,
      variant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Flexible Investment in AI Excellence
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">Scale your AI capabilities as your organization grows</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-800 rounded-2xl p-8 hover:shadow-lg transition-shadow relative ${
                plan.popular ? 'border-2 border-primary' : 'border border-slate-200 dark:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
                {plan.restrictedFeatures && (
                  <>
                    <li className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
                      <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Upgrade to Unlock</span>
                    </li>
                    {plan.restrictedFeatures.map((feature, featureIndex) => (
                      <li key={`restricted-${featureIndex}`} className="flex items-center opacity-50">
                        <i className="fas fa-times text-slate-400 mr-3"></i>
                        <span className="text-slate-400 line-through">{feature}</span>
                      </li>
                    ))}
                  </>
                )}
              </ul>
              
              {plan.ctaLink ? (
                <Link to={plan.ctaLink} className="w-full">
                  <Button 
                    variant={plan.variant}
                    className="w-full py-3"
                    data-testid={`button-${plan.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant={plan.variant}
                  className="w-full py-3"
                  onClick={plan.ctaAction}
                  data-testid={`button-${plan.name.toLowerCase().replace(' ', '-')}`}
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
