import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  const team = [
    {
      name: "Suresh Chandra Maddula",
      role: "CEO & Founder",
      initials: "SCM",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      bio: "Visionary leader with expertise in enterprise software"
    },
    {
      name: "Khadar Khan",
      role: "Architect",
      initials: "KK",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      bio: "Solutions architect and system design expert"
    },
    {
      name: "Ravikanth kandakatla",
      role: "AI Lead",
      initials: "RR",
      color: "bg-gradient-to-br from-green-500 to-green-700",
      bio: "Leading AI innovation and machine learning initiatives"
    },
    {
      name: "Rahul Ramana",
      role: "Project Lead",
      initials: "RR",
      color: "bg-gradient-to-br from-orange-500 to-orange-700",
      bio: "Expert in project management and delivery"
    },
    {
      name: "Jhansirao Botsa",
      role: "AI Developer",
      initials: "JB",
      color: "bg-gradient-to-br from-pink-500 to-pink-700",
      bio: "Specialist in AI development and implementation"
    }
  ];

  const values = [
    {
      icon: "fa-heart",
      title: "Customer First",
      description: "Every decision we make is guided by what's best for our customers"
    },
    {
      icon: "fa-lightbulb",
      title: "Innovation",
      description: "We push the boundaries of what's possible with AI technology"
    },
    {
      icon: "fa-shield-alt",
      title: "Trust & Security",
      description: "Your data security and privacy are our top priorities"
    },
    {
      icon: "fa-users",
      title: "Collaboration",
      description: "We believe in the power of teamwork and open communication"
    }
  ];

  const milestones = [
    { year: "2010", event: "TechRaq Founded", description: "Started with a vision to democratize technology" },
    { year: "2015", event: "Enterprise Growth", description: "Expanded to serve enterprise clients" },
    { year: "2020", event: "AI Innovation", description: "Pivoted to focus on AI solutions" },
    { year: "2023", event: "Vyoma.ai Launch", description: "Released our flagship chatbot platform" },
    { year: "2024", event: "1,000+ Customers", description: "Crossed major adoption milestone" },
    { year: "2024", event: "Global Reach", description: "Serving customers in 25+ countries" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            About TechRaq & Vyoma.ai
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We're on a mission to make AI accessible to every business, regardless of size or technical expertise.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              TechRaq was founded in 2010 with a commitment to delivering innovative technology solutions. Over the years, 
              we've evolved from a traditional software company to a pioneering force in artificial intelligence. 
              Our flagship product, Vyoma.ai, represents the culmination of over a decade of expertise and innovation.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The name "Vyoma" comes from Sanskrit, meaning "sky" or "limitless space" – representing our belief that 
              AI possibilities are boundless. With a team of experienced professionals led by CEO Suresh Chandra Maddula, 
              we've built a platform that removes technical barriers, allowing anyone to create intelligent chatbots 
              in minutes instead of months.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Today, Vyoma.ai powers thousands of chatbots across industries like healthcare, e-commerce, education, 
              and finance. From small startups to large enterprises, businesses trust us to deliver exceptional 
              customer experiences through AI.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Learn more about our parent company and explore our comprehensive solutions at{" "}
              <a 
                href="https://techraq.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                techraq.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${value.icon} text-3xl text-primary`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              The team behind Vyoma.ai
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                <CardContent className="p-8">
                  <div className="relative inline-block mb-6">
                    <div className={`w-24 h-24 ${member.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-2xl font-bold">
                        {member.initials}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg">
                      <i className="fas fa-check text-white text-xs leading-none flex items-center justify-center h-full"></i>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold mb-3 text-sm uppercase tracking-wide">
                    {member.role}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <i className="fab fa-linkedin text-sm"></i>
                    </a>
                    <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <i className="fas fa-envelope text-sm"></i>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Key milestones in the TechRaq story
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{milestone.year}</div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {milestone.event}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Us on Our Journey
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of the AI revolution. Start building your chatbot today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white hover:bg-white/20">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

