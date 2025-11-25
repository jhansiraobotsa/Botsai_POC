// import Navigation from "@/components/navigation";
// import Footer from "@/components/footer";
// import Pricing from "@/components/pricing";
// import { Card, CardContent } from "@/components/ui/card";
// import { useState } from "react";

// export default function PricingPage() {
//   const [isAnnual, setIsAnnual] = useState(false);
  
//   const faqs = [
//     {
//       question: "Can I switch plans anytime?",
//       answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
//     },
//     {
//       question: "What happens after my free trial?",
//       answer: "Your chatbot remains active but with limited features. Upgrade to Professional for full access."
//     },
//     {
//       question: "Do you offer refunds?",
//       answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied."
//     },
//     {
//       question: "Can I add more chatbots to my plan?",
//       answer: "Yes! You can purchase additional chatbot slots at $10/month per chatbot."
//     },
//     {
//       question: "What payment methods do you accept?",
//       answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers."
//     },
//     {
//       question: "Is there a long-term contract?",
//       answer: "No contracts required. Pay monthly or annually (save 20% with annual billing)."
//     }
//   ];

//   const features = [
//     {
//       icon: "fa-shield-alt",
//       title: "Enterprise Security",
//       description: "SOC 2 Type II compliant with end-to-end encryption"
//     },
//     {
//       icon: "fa-headset",
//       title: "24/7 Support",
//       description: "Round-the-clock assistance for all paid plans"
//     },
//     {
//       icon: "fa-sync",
//       title: "No Lock-In",
//       description: "Cancel anytime, no questions asked"
//     },
//     {
//       icon: "fa-chart-line",
//       title: "Scalable",
//       description: "Grows with your business needs"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
//       <Navigation />
      
//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/10 py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
//             Choose the perfect plan for your business. Start with our free trial and upgrade as you grow.
//           </p>
//           <div className="flex items-center justify-center">
//             <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg">
//               <button
//                 onClick={() => setIsAnnual(false)}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
//                   !isAnnual
//                     ? 'bg-primary text-white shadow-md'
//                     : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
//                 }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setIsAnnual(true)}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
//                   isAnnual
//                     ? 'bg-primary text-white shadow-md'
//                     : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
//                 }`}
//               >
//                 Annual
//                 <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold">
//                   Save 20%
//                 </span>
//               </button>
//             </div>
//           </div>
//           {isAnnual && (
//             <p className="text-center mt-4 text-sm text-green-600 dark:text-green-400 font-medium animate-fadeIn">
//               💰 You'll save ${Math.round(49 * 12 * 0.2)} per year with annual billing!
//             </p>
//           )}
//         </div>
//       </section>

//       {/* Pricing Component */}
//       <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//             {/* Free Trial */}
//             <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
//               <CardContent className="p-8">
//                 <div className="text-center mb-6">
//                   <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Free Trial</h3>
//                   <div className="mb-4">
//                     <span className="text-4xl font-bold text-slate-900 dark:text-white">**</span>
//                     <span className="text-slate-600 dark:text-slate-400">/14 days</span>
//                   </div>
//                   <p className="text-slate-600 dark:text-slate-300 text-sm">Limited to Customer Support & FAQ chatbots only</p>
//                 </div>
//                 <ul className="space-y-3 mb-8">
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">1 Customer Support/FAQ chatbot only</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">100 conversations/month</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">5 document uploads</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">Basic customization</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">Email support</span>
//                   </li>
//                 </ul>
//                 <button className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
//                   Start Free Trial
//                 </button>
//               </CardContent>
//             </Card>

//             {/* Professional */}
//             <Card className="border-2 border-primary hover:shadow-xl transition-shadow relative">
//               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                 <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
//                   Most Popular
//                 </span>
//               </div>
//               <CardContent className="p-8">
//                 <div className="text-center mb-6">
//                   <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Professional</h3>
//                   <div className="mb-4">
//                     <span className="text-4xl font-bold text-slate-900 dark:text-white">
//                       {/* ${isAnnual ? Math.round(49 * 0.8) : 49} */}
//                       ***
//                     </span>
//                     <span className="text-slate-600 dark:text-slate-400">/{isAnnual ? 'month' : 'month'}</span>
//                     {isAnnual && (
//                       <div className="text-xs text-green-600 dark:text-green-400 mt-1">
//                         Billed ${Math.round(49 * 0.8 * 12)} annually
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-slate-600 dark:text-slate-300 text-sm">Full access to all chatbot types & features</p>
//                 </div>
//                 <ul className="space-y-3 mb-8">
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">5 chatbots (all industry types)</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">1 MCP services for each chatbot</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">2,000 conversations/month</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">20 document uploads</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">Advanced customization</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">Priority support</span>
//                   </li>
//                 </ul>
//                 <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
//                   Get Started
//                 </button>
//               </CardContent>
//             </Card>

//             {/* Enterprise */}
//             <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
//               <CardContent className="p-8">
//                 <div className="text-center mb-6">
//                   <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Enterprise</h3>
//                   <div className="mb-4">
//                     <span className="text-2xl font-bold text-slate-900 dark:text-white">
//                       {/* ${isAnnual ? Math.round(199 * 0.8) : 199} */}
//                       _____
//                     </span>
//                     <span className="text-slate-600 dark:text-slate-400">/{isAnnual ? 'month' : 'month'}</span>
//                     {isAnnual && (
//                       <div className="text-xs text-green-600 dark:text-green-400 mt-1">
//                         Billed ${Math.round(199 * 0.8 * 12)} annually
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-slate-600 dark:text-slate-300 text-sm">For large organizations with custom needs</p>
//                 </div>
//                 <ul className="space-y-3 mb-8">
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">Unlimited chatbots (all types)</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">20,000 conversations/month</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">3 MCP services for each chatbot</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">Unlimited uploads</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">White-label solution</span>
//                   </li>
//                   <li className="flex items-center text-sm">
//                     <i className="fas fa-check text-green-500 mr-3"></i>
//                     <span className="text-slate-600 dark:text-slate-300">24/7 dedicated support</span>
//                   </li>
//                 </ul>
//                 <button className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
//                   Contact Sales
//                 </button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-white dark:bg-slate-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
//               All Plans Include
//             </h2>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <Card key={index} className="text-center">
//                 <CardContent className="p-6">
//                   <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <i className={`fas ${feature.icon} text-2xl text-primary`}></i>
//                   </div>
//                   <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
//                     {feature.title}
//                   </h3>
//                   <p className="text-sm text-slate-600 dark:text-slate-300">
//                     {feature.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Comparison Table */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
//               Compare Plans
//             </h2>
//           </div>
//           <Card>
//             <CardContent className="p-0">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50 dark:bg-slate-800">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-slate-900 dark:text-white font-semibold">Feature</th>
//                       <th className="px-6 py-4 text-center text-slate-900 dark:text-white font-semibold">Free Trial</th>
//                       <th className="px-6 py-4 text-center text-slate-900 dark:text-white font-semibold">Professional</th>
//                       <th className="px-6 py-4 text-center text-slate-900 dark:text-white font-semibold">Enterprise</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
//                     <tr>
//                       <td className="px-6 py-4 text-slate-900 dark:text-white">Chatbots</td>
//                       <td className="px-6 py-4 text-center">1</td>
//                       <td className="px-6 py-4 text-center">5</td>
//                       <td className="px-6 py-4 text-center">Unlimited</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 text-slate-900 dark:text-white">Conversations/Month</td>
//                       <td className="px-6 py-4 text-center">100</td>
//                       <td className="px-6 py-4 text-center">2,000</td>
//                       <td className="px-6 py-4 text-center">20,000</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 text-slate-900 dark:text-white">Document Uploads</td>
//                       <td className="px-6 py-4 text-center">5</td>
//                       <td className="px-6 py-4 text-center">20</td>
//                       <td className="px-6 py-4 text-center">Unlimited</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 text-slate-900 dark:text-white">MCP Services</td>
//                       <td className="px-6 py-4 text-center">-</td>
//                       <td className="px-6 py-4 text-center">1 per bot</td>
//                       <td className="px-6 py-4 text-center">3 per bot</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 text-slate-900 dark:text-white">All Chatbot Types</td>
//                       <td className="px-6 py-4 text-center"><i className="fas fa-times text-red-500"></i></td>
//                       <td className="px-6 py-4 text-center"><i className="fas fa-check text-green-500"></i></td>
//                       <td className="px-6 py-4 text-center"><i className="fas fa-check text-green-500"></i></td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 text-slate-900 dark:text-white">Analytics</td>
//                       <td className="px-6 py-4 text-center">Basic</td>
//                       <td className="px-6 py-4 text-center">Advanced</td>
//                       <td className="px-6 py-4 text-center">Custom Reports</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 text-slate-900 dark:text-white">Support</td>
//                       <td className="px-6 py-4 text-center">Email</td>
//                       <td className="px-6 py-4 text-center">Priority</td>
//                       <td className="px-6 py-4 text-center">24/7 Dedicated</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-20 bg-white dark:bg-slate-800">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
//               Frequently Asked Questions
//             </h2>
//           </div>
//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <Card key={index}>
//                 <CardContent className="p-6">
//                   <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
//                     {faq.question}
//                   </h3>
//                   <p className="text-slate-600 dark:text-slate-300">
//                     {faq.answer}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }



import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Pricing from "@/components/pricing";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
 
export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
 
  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "What happens after my free trial?",
      answer: "Your chatbot remains active but with limited features. Upgrade to Professional for full access."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied."
    },
    {
      question: "Can I add more chatbots to my plan?",
      answer: "Yes! You can purchase additional chatbot slots at $10/month per chatbot."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No contracts required. Pay monthly or annually (save 20% with annual billing)."
    }
  ];
 
  const features = [
    {
      icon: "fa-shield-alt",
      title: "Enterprise Security",
      description: "SOC 2 Type II compliant with end-to-end encryption"
    },
    {
      icon: "fa-headset",
      title: "24/7 Support",
      description: "Round-the-clock assistance for all paid plans"
    },
    {
      icon: "fa-sync",
      title: "No Lock-In",
      description: "Cancel anytime, no questions asked"
    },
    {
      icon: "fa-chart-line",
      title: "Scalable",
      description: "Grows with your business needs"
    }
  ];
 
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
     
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Flexible Plans Tailored to Your Needs
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            We believe in providing value that matches your unique requirements. Let's discuss a plan that works perfectly for your business.
          </p>
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 rounded-full px-6 py-3 shadow-lg">
              <i className="fas fa-handshake text-primary text-xl"></i>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Custom pricing available for all plan types
              </span>
            </div>
          </div>
        </div>
      </section>
 
      {/* Pricing Component */}
      <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Starter</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary">$0</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Perfect for small businesses getting started</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">1 Customer Support/FAQ chatbot only</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">100 conversations/month</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">5 document uploads</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">Basic customization</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">Email support</span>
                  </li>
                </ul>
                <button className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
                  Request Information
                </button>
              </CardContent>
            </Card>
 
            {/* Professional */}
            <Card className="border-2 border-primary hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Professional</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary">Contact for Quote</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Full access to all chatbot types & features</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">5 chatbots (all industry types)</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">1 MCP services for each chatbot</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">2,000 conversations/month</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">20 document uploads</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">Advanced customization</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">Priority support</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  Get Started
                </button>
              </CardContent>
            </Card>
 
            {/* Enterprise */}
            <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Enterprise</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary">Custom Pricing</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">For large organizations with custom needs</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">Unlimited chatbots (all types)</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">20,000 conversations/month</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">3 MCP services for each chatbot</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">Unlimited uploads</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">White-label solution</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-3"></i>
                    <span className="text-slate-600 dark:text-slate-300">24/7 dedicated support</span>
                  </li>
                </ul>
                <button className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
                  Contact Sales
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
 
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              All Plans Include
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${feature.icon} text-2xl text-primary`}></i>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
 
      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Compare Plans
            </h2>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-900 dark:text-white font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center text-slate-900 dark:text-white font-semibold">Free Trial</th>
                      <th className="px-6 py-4 text-center text-slate-900 dark:text-white font-semibold">Professional</th>
                      <th className="px-6 py-4 text-center text-slate-900 dark:text-white font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">Chatbots</td>
                      <td className="px-6 py-4 text-center">1</td>
                      <td className="px-6 py-4 text-center">5</td>
                      <td className="px-6 py-4 text-center">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">Conversations/Month</td>
                      <td className="px-6 py-4 text-center">100</td>
                      <td className="px-6 py-4 text-center">2,000</td>
                      <td className="px-6 py-4 text-center">20,000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">Document Uploads</td>
                      <td className="px-6 py-4 text-center">5</td>
                      <td className="px-6 py-4 text-center">20</td>
                      <td className="px-6 py-4 text-center">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">MCP Services</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center">1 per bot</td>
                      <td className="px-6 py-4 text-center">3 per bot</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">All Chatbot Types</td>
                      <td className="px-6 py-4 text-center"><i className="fas fa-times text-red-500"></i></td>
                      <td className="px-6 py-4 text-center"><i className="fas fa-check text-green-500"></i></td>
                      <td className="px-6 py-4 text-center"><i className="fas fa-check text-green-500"></i></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">Analytics</td>
                      <td className="px-6 py-4 text-center">Basic</td>
                      <td className="px-6 py-4 text-center">Advanced</td>
                      <td className="px-6 py-4 text-center">Custom Reports</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">Support</td>
                      <td className="px-6 py-4 text-center">Email</td>
                      <td className="px-6 py-4 text-center">Priority</td>
                      <td className="px-6 py-4 text-center">24/7 Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
 
      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
 
      <Footer />
    </div>
  );
}
 
 
 