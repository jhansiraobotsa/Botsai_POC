import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <i className="fas fa-robot text-2xl text-primary mr-2"></i>
              <span className="text-xl font-bold">Vyoma.ai</span>
            </div>
            <p className="text-slate-400 mb-4">
              Create intelligent AI chatbots for any industry. Powered by TechRaq. No coding required.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/techraq" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="https://linkedin.com/company/techraq" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-lg"></i>
              </a>
              <a href="https://github.com/techraq" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-github text-lg"></i>
              </a>
              <a href="https://facebook.com/techraq" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/features">
                  <a className="hover:text-white transition-colors">Features</a>
                </Link>
              </li>
              <li>
                <Link to="/pricing">
                  <a className="hover:text-white transition-colors">Pricing</a>
                </Link>
              </li>
              <li>
                <Link to="/documentation">
                  <a className="hover:text-white transition-colors">Integrations</a>
                </Link>
              </li>
              <li>
                <Link to="/documentation">
                  <a className="hover:text-white transition-colors">API</a>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <a className="hover:text-white transition-colors">Start Free Trial</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/about">
                  <a className="hover:text-white transition-colors">About</a>
                </Link>
              </li>
              <li>
                <a href="https://techraq.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://techraq.com/careers" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <Link to="/contact">
                  <a className="hover:text-white transition-colors">Contact</a>
                </Link>
              </li>
              <li>
                <a href="https://techraq.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  TechRaq.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/documentation">
                  <a className="hover:text-white transition-colors">Documentation</a>
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <a className="hover:text-white transition-colors">Help Center</a>
                </Link>
              </li>
              <li>
                <a href="https://discord.gg/vyoma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="https://status.vyoma.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Status
                </a>
              </li>
              <li>
                <Link to="/contact">
                  <a className="hover:text-white transition-colors">Support</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; 2024 Vyoma.ai by TechRaq. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
            <a href="/security" className="text-slate-400 hover:text-white text-sm transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
