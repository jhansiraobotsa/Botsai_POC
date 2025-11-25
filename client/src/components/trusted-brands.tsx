export default function TrustedBrands() {
  const brands = [
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
    { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg" },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-slate-600 mb-8">
            Trusted by 10,000+ businesses worldwide
          </h3>
        </div>
        
        <div className="overflow-hidden relative">
          <div 
            className="flex items-center space-x-12 animate-scroll"
            style={{
              animation: 'scroll 30s linear infinite',
              width: 'max-content',
            }}
          >
            {/* Duplicate the brands twice for seamless infinite loop */}
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 min-w-[150px]"
              >
                <div className="flex items-center justify-center h-16 group cursor-pointer">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-h-12 max-w-full object-contain hover:scale-110 transition-all duration-300 ease-in-out group-hover:drop-shadow-lg"
                    onError={(e) => {
                      // Fallback to text with brand styling
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-lg font-bold text-slate-600 group-hover:text-primary transition-colors duration-300">${brand.name}</span>`;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Success Stories Section */}
        <div className="mt-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-primary/10 rounded-2xl p-8 mb-4 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-rocket text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">98%</h3>
                <p className="text-slate-600 font-medium">Customer Satisfaction</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mb-4 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-clock text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">2.1s</h3>
                <p className="text-slate-600 font-medium">Average Response Time</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 mb-4 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-comments text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-purple-600 mb-2">10M+</h3>
                <p className="text-slate-600 font-medium">Conversations Handled</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 mb-4 group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-globe text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-orange-600 mb-2">50+</h3>
                <p className="text-slate-600 font-medium">Countries Served</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}