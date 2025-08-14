import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Navigation() {

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-robot text-2xl text-primary mr-2"></i>
              <span className="text-xl font-bold text-slate-900">ChatBot Builder</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#docs" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Docs</a>
              <a href="#support" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">Support</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button 
                variant="ghost" 
                data-testid="button-signin"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                data-testid="button-start-trial"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
