import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Pricing() {
  const handleContactSales = () => {
    // Contact sales functionality placeholder
    console.log("Contact sales clicked");
  };

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "/14 days",
      description: "Limited to Customer Support & FAQ chatbots only",
      features: [
        "1 Customer Support/FAQ chatbot only",
        "100 conversations/month",
        "5 document uploads",
        "Basic customization",
        "Email support"
      ],
      restrictedFeatures: [
        "Industry-specific chatbots",
        "E-commerce integration",
        "Lead generation bots",
        "Advanced analytics"
      ],
      cta: "Start Free Trial",
      ctaLink: "/login",
      variant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Full access to all chatbot types & features",
      features: [
        "5 chatbots (all industry types)",
        "1 MCP services for each chatbot",
        "2,000 conversations/month",
        "20 document uploads",
        "Advanced customization",
        "E-commerce integration",
        "Lead generation bots",
        "Analytics dashboard",
        "Priority support"
      ],
      cta: "Get Started",
      ctaLink: "/login",
      variant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited chatbots (all types)",
        "20,000 conversations/month",
        "3 MCP services for each chatbot",
        "Unlimited uploads",
        "White-label solution",
        "Custom integrations",
        "Advanced analytics & reporting",
        "Multi-language support",
        "24/7 dedicated support"
      ],
      cta: "Contact Sales",
      ctaAction: handleContactSales,
      variant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600">Choose the plan that fits your business needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow relative ${
                plan.popular ? 'border-2 border-primary' : 'border border-slate-200'
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
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-600">{plan.period}</span>
                </div>
                <p className="text-slate-600 mb-6">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
                {plan.restrictedFeatures && (
                  <>
                    <li className="border-t border-slate-200 pt-3 mt-3">
                      <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Not Available in Free Trial</span>
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
