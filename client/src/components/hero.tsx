import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleStartTrial = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      setLocation("/login");
    }
  };

  const handleWatchDemo = () => {
    // Demo functionality placeholder
    console.log("Watch demo clicked");
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Build AI Chatbots for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary ml-3">
              Any Industry
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Create intelligent chatbots powered by your documents and website content. Deploy anywhere with our embeddable widget. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4"
              data-testid="button-start-trial-hero"
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={handleWatchDemo}
              data-testid="button-watch-demo"
            >
              <i className="fas fa-play mr-2"></i>
              Watch Demo
            </Button>
          </div>
          <div className="mt-12">
            <p className="text-sm text-slate-500 mb-8">Trusted by 10,000+ businesses worldwide</p>
            <div className="overflow-hidden relative max-w-4xl mx-auto">
              <div 
                className="flex items-center space-x-12 animate-scroll"
                style={{
                  animation: 'scroll 30s linear infinite',
                  width: 'max-content',
                }}
              >
                {/* Duplicate the brands twice for seamless infinite loop */}
                {[
                  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
                  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
                  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
                  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
                  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
                  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
                  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
                  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg" },
                ].concat([
                  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
                  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
                  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
                  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
                  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
                  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
                  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
                  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg" },
                ]).map((brand, index) => (
                  <div
                    key={`${brand.name}-${index}`}
                    className="flex-shrink-0 min-w-[120px]"
                  >
                    <div className="flex items-center justify-center h-12 group cursor-pointer">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="max-h-8 max-w-full object-contain hover:scale-110 transition-all duration-300 ease-in-out opacity-70 hover:opacity-100"
                        onError={(e) => {
                          // Fallback to text with brand styling
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<span class="text-sm font-bold text-slate-400 group-hover:text-primary transition-colors duration-300">${brand.name}</span>`;
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
