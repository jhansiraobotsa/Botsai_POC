// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useLocation } from "wouter";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";

// const registerSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
//   phone_number: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits"),
//   plan: z.enum(["basic", "premium", "enterprise"], {
//     required_error: "Please select a plan",
//   }),
//   primary_goal: z.string().min(1, "Primary goal is required"),
// });

// type RegisterForm = z.infer<typeof registerSchema>;

// const goalOptions = [
//   { value: "support", label: "Customer Support & FAQ", plans: ["basic", "premium", "enterprise"] },
//   { value: "lead", label: "Lead Generation & Sales", plans: ["premium", "enterprise"] },
//   { value: "booking", label: "Appointments & Booking", plans: ["premium", "enterprise"] },
//   { value: "education", label: "Information & Education", plans: ["premium", "enterprise"] },
// ];

// export default function Register() {
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();
//   const { registerMutation } = useAuth();

//   const form = useForm<RegisterForm>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       name: "",
//       phone_number: "",
//       plan: "basic",
//       primary_goal: "",
//     },
//   });

//   const onSubmit = async (data: RegisterForm) => {
//     try {
//       await registerMutation.mutateAsync(data);
//       toast({
//         title: "Registration Successful!",
//         description: "Your account has been created. Please login to continue.",
//       });
//       setLocation("/login");
//     } catch (error: any) {
//       toast({
//         title: "Registration Failed",
//         description: error.message || "Failed to create account",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center py-8">
//       <div className="max-w-3xl w-full px-4">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             <i className="fas fa-robot text-3xl text-primary mr-3"></i>
//             <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vyoma.ai</h1>
//           </div>
//           <p className="text-slate-600 dark:text-slate-300">Create your account</p>
//         </div>

//         <Card className="border-slate-200 dark:border-slate-700 shadow-xl">
//           <CardHeader className="space-y-1 pb-4">
//             <CardTitle className="text-2xl text-slate-900 dark:text-white">Register</CardTitle>
//             <p className="text-sm text-slate-600 dark:text-slate-400">Start your 14-day free trial today</p>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
//               <div className="flex  gap-3">
//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormLabel className="text-slate-700 dark:text-slate-300">Email</FormLabel>
//                         <FormControl>
//                           <Input 
//                             type="email"
//                             placeholder="Enter your email" 
//                             {...field}
//                             data-testid="input-email"
//                             className="bg-white dark:bg-slate-800  border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormLabel className="text-slate-700 dark:text-slate-300">Password</FormLabel>
//                         <FormControl>
//                           <Input 
//                             type="password"
//                             placeholder="Enter your password (min 6 characters)" 
//                             {...field}
//                             data-testid="input-password"
//                             className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//               </div>
                  
//               <div className="flex gap-3">
//                   <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel className="text-slate-700 dark:text-slate-300">Full Name</FormLabel>
//                       <FormControl>
//                         <Input 
//                           placeholder="Enter your full name" 
//                           {...field}
//                           data-testid="input-name"
//                           className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="phone_number"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel className="text-slate-700 dark:text-slate-300">Phone Number</FormLabel>
//                       <FormControl>
//                         <Input 
//                           placeholder="Enter your phone number" 
//                           {...field}
//                           data-testid="input-phone"
//                           className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
                
//               <div className="flex gap-3">
//                   <FormField
//                   control={form.control}
//                   name="plan"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel className="text-slate-700 dark:text-slate-300">Plan</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger data-testid="select-plan" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
//                             <SelectValue placeholder="Select a plan" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
//                           <SelectItem value="basic" className="text-slate-900 dark:text-white">Basic - Free Trial</SelectItem>
//                           <SelectItem value="premium" className="text-slate-900 dark:text-white">Premium - $****/month</SelectItem>
//                           <SelectItem value="enterprise" className="text-slate-900 dark:text-white">Enterprise - $*****/month</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="primary_goal"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel className="text-slate-700 dark:text-slate-300">What is your primary goal for this chatbot? *</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger data-testid="select-goal" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
//                             <SelectValue placeholder="Select a goal" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
//                           {goalOptions.map((option) => (
//                             <SelectItem
//                               key={option.value}
//                               value={option.value}
//                               disabled={form.watch("plan") === "basic" && !option.plans.includes("basic")}
//                               className="text-slate-900 dark:text-white"
//                             >
//                               {option.label}
//                               {option.plans.includes("premium") && <span className="ml-2 text-xs text-primary">Professional+</span>}
//                               {option.plans.includes("enterprise") && !option.plans.includes("premium") && <span className="ml-2 text-xs text-green-600 dark:text-green-400">Enterprise</span>}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
                

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={registerMutation.isPending}
//                   data-testid="button-register"
//                 >
//                   {registerMutation.isPending ? (
//                     <>
//                       <i className="fas fa-spinner fa-spin mr-2"></i>
//                       Creating Account...
//                     </>
//                   ) : (
//                     <>
//                       <i className="fas fa-user-plus mr-2"></i>
//                       Create Account
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </Form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
//                     Or sign up with
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                 onClick={() => {
//                   toast({
//                     title: "Coming Soon",
//                     description: "Google SSO will be available soon!",
//                   });
//                 }}
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 Google
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                 onClick={() => {
//                   toast({
//                     title: "Coming Soon",
//                     description: "Microsoft SSO will be available soon!",
//                   });
//                 }}
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path fill="#f25022" d="M1 1h10v10H1z" />
//                   <path fill="#00a4ef" d="M13 1h10v10H13z" />
//                   <path fill="#7fba00" d="M1 13h10v10H1z" />
//                   <path fill="#ffb900" d="M13 13h10v10H13z" />
//                 </svg>
//                 Microsoft
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                 onClick={() => {
//                   toast({
//                     title: "Coming Soon",
//                     description: "GitHub SSO will be available soon!",
//                   });
//                 }}
//               >
//                 <i className="fab fa-github text-lg mr-2"></i>
//                 GitHub
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                 onClick={() => {
//                   toast({
//                     title: "Coming Soon",
//                     description: "LinkedIn SSO will be available soon!",
//                   });
//                 }}
//               >
//                 <i className="fab fa-linkedin text-lg mr-2 text-[#0077B5]"></i>
//                 LinkedIn
//               </Button>
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-slate-600 dark:text-slate-400">
//                 Already have an account?{" "}
//                 <Button 
//                   variant="link" 
//                   className="p-0 h-auto text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80"
//                   onClick={() => setLocation("/login")}
//                 >
//                   Login here
//                 </Button>
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="text-center mt-6">
//           <Button 
//             variant="link" 
//             onClick={() => setLocation("/")}
//             data-testid="button-back-home"
//             className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
//           >
//             <i className="fas fa-arrow-left mr-2"></i>
//             Back to Home
//           </Button>
//         </div>

//         {/* Decorative elements */}
//         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
//           <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits"),
  plan: z.enum(["basic", "premium", "enterprise"], {
    required_error: "Please select a plan",
  }),
  primary_goal: z.string().min(1, "Primary goal is required"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const goalOptions = [
  { value: "support", label: "Customer Support & FAQ", plans: ["basic", "premium", "enterprise"] },
  { value: "lead", label: "Lead Generation & Sales", plans: ["premium", "enterprise"] },
  { value: "booking", label: "Appointments & Booking", plans: ["premium", "enterprise"] },
  { value: "education", label: "Information & Education", plans: ["premium", "enterprise"] },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { registerMutation } = useAuth();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone_number: "",
      plan: "basic",
      primary_goal: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync(data);
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please login to continue.",
      });
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <div className="w-full max-w-6xl flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6 px-8">
            <div className="flex items-center justify-center mb-4">
              <i className="fas fa-robot text-5xl text-primary mr-4"></i>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Vyoma.ai</h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-md">
              Create intelligent chatbots that transform your customer experience
            </p>
            <div className="space-y-3 text-left max-w-sm">
              <div className="flex items-center space-x-3">
                <i className="fas fa-check-circle text-green-500 text-lg"></i>
                <span className="text-slate-700 dark:text-slate-300">14-day free trial</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-check-circle text-green-500 text-lg"></i>
                <span className="text-slate-700 dark:text-slate-300">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-check-circle text-green-500 text-lg"></i>
                <span className="text-slate-700 dark:text-slate-300">Setup in 5 minutes</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <i className="fas fa-robot text-2xl text-primary mr-2"></i>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Vyoma.ai</h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Create your account</p>
            </div>

            <Card className="border-slate-200 dark:border-slate-700 shadow-xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl lg:text-2xl text-slate-900 dark:text-white">Register</CardTitle>
                <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">Start your 14-day free trial today</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Two-column layout for large screens, single column for mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="lg:col-span-2">
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="Enter your email" 
                                {...field}
                                data-testid="input-email"
                                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password"
                                placeholder="Min 6 characters" 
                                {...field}
                                data-testid="input-password"
                                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field}
                                data-testid="input-name"
                                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your phone number" 
                                {...field}
                                data-testid="input-phone"
                                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">Plan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-plan" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm">
                                  <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                                <SelectItem value="basic" className="text-slate-900 dark:text-white text-sm">Basic - Free Trial</SelectItem>
                                <SelectItem value="premium" className="text-slate-900 dark:text-white text-sm">Premium - $****/month</SelectItem>
                                <SelectItem value="enterprise" className="text-slate-900 dark:text-white text-sm">Enterprise - $*****/month</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="primary_goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">Primary Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-goal" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm">
                                  <SelectValue placeholder="Select a goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                                {goalOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={form.watch("plan") === "basic" && !option.plans.includes("basic")}
                                    className="text-slate-900 dark:text-white text-sm"
                                  >
                                    <span className="text-sm">{option.label}</span>
                                    {option.plans.includes("premium") && <span className="ml-2 text-xs text-primary">Professional+</span>}
                                    {option.plans.includes("enterprise") && !option.plans.includes("premium") && <span className="ml-2 text-xs text-green-600 dark:text-green-400">Enterprise</span>}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-sm py-2.5 mt-2"
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus mr-2"></i>
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400 text-xs">
                        Or sign up with
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs py-2 h-auto"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Google SSO will be available soon!",
                      });
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs py-2 h-auto"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Microsoft SSO will be available soon!",
                      });
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path fill="#f25022" d="M1 1h10v10H1z" />
                      <path fill="#00a4ef" d="M13 1h10v10H13z" />
                      <path fill="#7fba00" d="M1 13h10v10H1z" />
                      <path fill="#ffb900" d="M13 13h10v10H13z" />
                    </svg>
                    Microsoft
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs py-2 h-auto"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "GitHub SSO will be available soon!",
                      });
                    }}
                  >
                    <i className="fab fa-github text-sm mr-1"></i>
                    GitHub
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs py-2 h-auto"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "LinkedIn SSO will be available soon!",
                      });
                    }}
                  >
                    <i className="fab fa-linkedin text-sm mr-1 text-[#0077B5]"></i>
                    LinkedIn
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 text-xs"
                      onClick={() => setLocation("/login")}
                    >
                      Login here
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* <div className="text-center mt-4">
              <Button 
                variant="link" 
                onClick={() => setLocation("/")}
                data-testid="button-back-home"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs"
              >
                <i className="fas fa-arrow-left mr-1"></i>
                Back to Home
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30 -z-10">
        <div className="absolute top-10 right-4 lg:top-20 lg:right-20 w-48 h-48 lg:w-72 lg:h-72 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-4 lg:bottom-20 lg:left-20 w-64 h-64 lg:w-96 lg:h-96 bg-secondary/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}