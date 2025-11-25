// import Navigation from "@/components/navigation";
// import Footer from "@/components/footer";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";

// export default function ContactPage() {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     company: "",
//     subject: "",
//     message: ""
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // In a real app, this would send to an API
//     toast({
//       title: "Message Sent!",
//       description: "We'll get back to you within 24 hours.",
//     });
//     setFormData({
//       name: "",
//       email: "",
//       company: "",
//       subject: "",
//       message: ""
//     });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const contactInfo = [
//     {
//       icon: "fa-envelope",
//       title: "Email",
//       info: "support@support@techraq.com",
//       link: "mailto:support@techraq.com",
//       color: "text-blue-600",
//       bgColor: "bg-blue-100"
//     },
//     {
//       icon: "fa-phone",
//       title: "Phone",
//       info: "+1 (555) 123-4567",
//       link: "tel:+15551234567",
//       color: "text-green-600",
//       bgColor: "bg-green-100"
//     },
//     {
//       icon: "fa-map-marker-alt",
//       title: "Office",
//       info: "123 AI Street, Tech Valley, CA 94000",
//       link: "#",
//       color: "text-red-600",
//       bgColor: "bg-red-100"
//     },
//     {
//       icon: "fa-clock",
//       title: "Business Hours",
//       info: "Mon-Fri: 9AM - 6PM PST",
//       link: "#",
//       color: "text-purple-600",
//       bgColor: "bg-purple-100"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
//       <Navigation />

//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/10 py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
//             Get in Touch
//           </h1>
//           <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
//             Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
//           </p>
//         </div>
//       </section>

//       {/* Contact Info Cards */}
//       <section className="py-12 -mt-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {contactInfo.map((info, index) => (
//               <Card key={index} className="hover:shadow-lg transition-shadow">
//                 <CardContent className="p-6 text-center">
//                   <div className={`w-14 h-14 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
//                     <i className={`fas ${info.icon} text-2xl ${info.color}`}></i>
//                   </div>
//                   <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
//                     {info.title}
//                   </h3>
//                   <a
//                     href={info.link}
//                     className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
//                   >
//                     {info.info}
//                   </a>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Form and Info */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-2xl">Send us a Message</CardTitle>
//                 <p className="text-slate-600 dark:text-slate-300">
//                   Fill out the form below and our team will get back to you within 24 hours.
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="name">Name *</Label>
//                       <Input
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                         placeholder="John Doe"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="email">Email *</Label>
//                       <Input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         placeholder="john@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="company">Company</Label>
//                       <Input
//                         id="company"
//                         name="company"
//                         value={formData.company}
//                         onChange={handleChange}
//                         placeholder="Your Company"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="subject">Subject *</Label>
//                       <Input
//                         id="subject"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleChange}
//                         required
//                         placeholder="How can we help?"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <Label htmlFor="message">Message *</Label>
//                     <Textarea
//                       id="message"
//                       name="message"
//                       value={formData.message}
//                       onChange={handleChange}
//                       required
//                       placeholder="Tell us more about your inquiry..."
//                       rows={6}
//                     />
//                   </div>

//                   <Button type="submit" size="lg" className="w-full">
//                     Send Message
//                     <i className="fas fa-paper-plane ml-2"></i>
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Additional Info */}
//             {/* <div className="space-y-8">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-2xl">Prefer to Chat</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex gap-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                         <i className="fas fa-question-circle text-primary"></i>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
//                         Product Questions
//                       </h3>
//                       <p className="text-slate-600 dark:text-slate-300 text-sm">
//                         Learn more about Vyoma.ai features and capabilities
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                         <i className="fas fa-briefcase text-primary"></i>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
//                         Enterprise Solutions
//                       </h3>
//                       <p className="text-slate-600 dark:text-slate-300 text-sm">
//                         Discuss custom plans for large organizations
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                         <i className="fas fa-handshake text-primary"></i>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
//                         Partnerships
//                       </h3>
//                       <p className="text-slate-600 dark:text-slate-300 text-sm">
//                         Explore integration and partnership opportunities
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                         <i className="fas fa-headset text-primary"></i>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
//                         Technical Support
//                       </h3>
//                       <p className="text-slate-600 dark:text-slate-300 text-sm">
//                         Get help with implementation and troubleshooting
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
//                 <CardContent className="p-8">
//                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//                     Prefer to Chat?
//                   </h3>
//                   <p className="text-slate-600 dark:text-slate-300 mb-6">
//                     Try our live chat support for instant answers to your questions. Available 24/7.
//                   </p>
//                   <Button size="lg" className="w-full">
//                     <i className="fas fa-comments mr-2"></i>
//                     Start Live Chat
//                   </Button>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//                     Follow Us
//                   </h3>
//                   <div className="flex gap-4">
//                     <a href="https://twitter.com/techraq" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
//                       <i className="fab fa-twitter"></i>
//                     </a>
//                     <a href="https://linkedin.com/company/techraq" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
//                       <i className="fab fa-linkedin"></i>
//                     </a>
//                     <a href="https://github.com/techraq" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
//                       <i className="fab fa-github"></i>
//                     </a>
//                     <a href="https://facebook.com/techraq" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
//                       <i className="fab fa-facebook"></i>
//                     </a>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div> */}
//           </div>
//         </div>
//       </section>

//       {/* Map Section */}
//       {/* <section className="py-20 bg-white dark:bg-slate-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
//               Visit Our Office
//             </h2>
//             <p className="text-lg text-slate-600 dark:text-slate-300">
//               We'd love to meet you in person
//             </p>
//           </div>
//           <div className="bg-slate-200 dark:bg-slate-700 h-96 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <i className="fas fa-map-marked-alt text-6xl text-slate-400 mb-4"></i>
//               <p className="text-slate-600 dark:text-slate-300">Interactive map would go here</p>
//             </div>
//           </div>
//         </div>
//       </section> */}

//       <Footer />
//     </div>
//   );
// }

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: "fa-envelope",
      title: "Email",
      info: "vyoma.support@techraq.com",
      link: "mailto:support@techraq.com",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: "fa-phone",
      title: "Phone",
      info: "+91 8191912101",
      link: "tel:+91 8191912101",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    // {
    //   icon: "fa-map-marker-alt",
    //   title: "Office",
    //   info: "123 AI Street, Tech Valley, CA 94000",
    //   link: "#",
    //   color: "text-red-600",
    //   bgColor: "bg-red-100",
    // },
    // {
    //   icon: "fa-clock",
    //   title: "Business Hours",
    //   info: "Mon-Fri: 9AM - 6PM PST",
    //   link: "#",
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-100",
    // },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 ">
        <div className="pl-[52px]">
          <section className="bg-gradient-to-br mt-20 from-primary/10 via-secondary/10 to-primary/5 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/10 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="py-8  ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 lg:px-6">
              <div className="grid lg:grid-cols-2  gap-2 md:grid-cols-1">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-14 h-14 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <i
                          className={`fas ${info.icon} text-2xl ${info.color}`}
                        ></i>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {info.title}
                      </h3>
                      <div className="w-full">
                        <a
                          href={info.link}
                          className="
                            text-slate-600 dark:text-slate-300
                            hover:text-primary transition-colors
                            block max-w-full break-words whitespace-normal overflow-hidden
                          "
                        >
                          {info.info}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Contact Form and Info */}
        <section className="py-14 flex justify-center items-center ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className=" gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-slate-600 dark:text-slate-300">
                    Fill out the form below and our team will get back to you
                    within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-center"
                    >
                      Send Message
                      <i className="fas fa-paper-plane ml-2"></i>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
