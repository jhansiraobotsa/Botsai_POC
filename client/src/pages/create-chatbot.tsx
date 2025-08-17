import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createChatbotSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CreateChatbotForm } from "@shared/schema";

const STEPS = [
  "Basic Information",
  "Industry Questions", 
  "Customization",
  "Review & Create"
];

const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "E-commerce",
  "Education",
  "Finance",
  "Real Estate",
  "Travel",
  "Food & Beverage",
  "Automotive",
  "Entertainment",
  "Non-profit",
  "Consulting",
  "Manufacturing",
  "Retail",
  "Professional Services",
  "Media",
  "Government",
  "Insurance",
  "Logistics",
  "Energy",
  "Sports & Fitness",
  "Beauty & Fashion",
  "Home & Garden",
  "Legal Services",
  "Other"
];

const PURPOSE_OPTIONS = [
  { value: "support", label: "Customer Support & FAQ", isPremium: false },
  { value: "sales", label: "Lead Generation & Sales", isPremium: true },
  { value: "booking", label: "Appointments & Booking", isPremium: true },
  { value: "info", label: "Information & Education", isPremium: true }
];

const TONE_OPTIONS = [
  "Professional & Formal",
  "Friendly & Casual", 
  "Helpful & Supportive",
  "Enthusiastic & Energetic"
];

// Dashboard Components
function DashboardHeader({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div className="bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <i className="fas fa-robot text-primary text-xl"></i>
          <span className="text-white font-semibold">BOTSAi Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-300 text-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} data-testid="button-logout">
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        <Link to="/" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg">
          <i className="fas fa-robot"></i>
          <span>My Chatbots</span>
        </Link>
        <Link to="/create" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg bg-slate-100">
          <i className="fas fa-plus"></i>
          <span>Create New</span>
        </Link>
        <button className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg w-full text-left">
          <i className="fas fa-chart-bar"></i>
          <span>Analytics</span>
        </button>
        <button className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg w-full text-left">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default function CreateChatbot() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const userPlan = user?.plan || "free";

  const form = useForm<CreateChatbotForm>({
    resolver: zodResolver(createChatbotSchema),
    defaultValues: {
      name: "",
      industry: "",
      purpose: "",
      tone: "",
      businessGoal: "",
      targetAudience: "",
      keyFeatures: "",
      brandColor: "#3B82F6",
      widgetPosition: "bottom-right"
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateChatbotForm) => {
      const response = await apiRequest("POST", "/api/chatbots", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your chatbot has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] });
      setLocation(`/chatbot/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create chatbot",
        variant: "destructive",
      });
    },
  });

  const onNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const onPrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: CreateChatbotForm) => {
    createMutation.mutate(data);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} onLogout={() => window.location.href = '/api/logout'} />
      
      <div className="flex">
        <Sidebar />
        <div className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Create Your Chatbot
              </h1>
              <p className="text-xl text-slate-600">Our intelligent setup process guides you through customization</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>{STEPS[step]}</CardTitle>
                  <div className="text-sm text-slate-600">
                    Step {step + 1} of {STEPS.length}
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {step === 0 && <BasicInformationStep form={form} userPlan={userPlan} />}
                    {step === 1 && <IndustryQuestionsStep form={form} />}
                    {step === 2 && <CustomizationStep form={form} />}
                    {step === 3 && <ReviewStep form={form} />}

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onPrevious}
                        disabled={step === 0}
                        data-testid="button-previous"
                      >
                        Previous
                      </Button>
                      
                      {step === STEPS.length - 1 ? (
                        <Button
                          type="submit"
                          disabled={createMutation.isPending}
                          data-testid="button-create-chatbot"
                        >
                          {createMutation.isPending ? "Creating..." : "Create Chatbot"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={onNext}
                          data-testid="button-next"
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function BasicInformationStep({ form, userPlan }: { form: any; userPlan: string }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chatbot Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Customer Support Bot" 
                {...field}
                data-testid="input-chatbot-name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What industry best describes your business? *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-industry">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {INDUSTRY_OPTIONS.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What is your primary goal for this chatbot? *</FormLabel>
            {userPlan === "free" && (
              <Alert className="mb-4">
                <AlertDescription>
                  Free trial only includes Customer Support & FAQ chatbots. 
                  <a href="#pricing" className="text-primary underline ml-1">Upgrade to Professional</a> for access to all chatbot types.
                </AlertDescription>
              </Alert>
            )}
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
                data-testid="radio-purpose"
              >
                {PURPOSE_OPTIONS.map((purpose) => {
                  const isDisabled = userPlan === "free" && purpose.isPremium;
                  return (
                    <div key={purpose.value} className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50' : ''}`}>
                      <RadioGroupItem 
                        value={purpose.value} 
                        id={purpose.value}
                        disabled={isDisabled}
                      />
                      <Label 
                        htmlFor={purpose.value}
                        className={isDisabled ? 'text-slate-400 cursor-not-allowed' : ''}
                      >
                        {purpose.label}
                        {purpose.isPremium && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Professional+
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function IndustryQuestionsStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="tone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What tone should your chatbot use? *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TONE_OPTIONS.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="businessGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What is your main business goal? *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Increase customer satisfaction, reduce support tickets, generate leads..."
                {...field}
                data-testid="textarea-business-goal"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Who is your target audience? *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Small business owners, tech-savvy millennials, senior citizens..."
                {...field}
                data-testid="textarea-target-audience"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function CustomizationStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="keyFeatures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Key features or services to highlight *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., 24/7 support, product recommendations, booking system..."
                {...field}
                data-testid="textarea-key-features"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="brandColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand Color</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-3">
                <Input
                  type="color"
                  {...field}
                  className="w-16 h-10 rounded border-none"
                  data-testid="input-brand-color"
                />
                <span className="text-sm text-slate-600">{field.value}</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="widgetPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Widget Position</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-widget-position">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ReviewStep({ form }: { form: any }) {
  const values = form.getValues();
  
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Review Your Chatbot Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-700">Name:</span>
            <p className="text-slate-600">{values.name || "Not specified"}</p>
          </div>
          
          <div>
            <span className="font-medium text-slate-700">Industry:</span>
            <p className="text-slate-600">{values.industry || "Not specified"}</p>
          </div>
          
          <div>
            <span className="font-medium text-slate-700">Purpose:</span>
            <p className="text-slate-600">{values.purpose || "Not specified"}</p>
          </div>
          
          <div>
            <span className="font-medium text-slate-700">Tone:</span>
            <p className="text-slate-600">{values.tone || "Not specified"}</p>
          </div>
          
          <div className="md:col-span-2">
            <span className="font-medium text-slate-700">Business Goal:</span>
            <p className="text-slate-600">{values.businessGoal || "Not specified"}</p>
          </div>
          
          <div className="md:col-span-2">
            <span className="font-medium text-slate-700">Target Audience:</span>
            <p className="text-slate-600">{values.targetAudience || "Not specified"}</p>
          </div>
          
          <div className="md:col-span-2">
            <span className="font-medium text-slate-700">Key Features:</span>
            <p className="text-slate-600">{values.keyFeatures || "Not specified"}</p>
          </div>
          
          <div>
            <span className="font-medium text-slate-700">Brand Color:</span>
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: values.brandColor }}
              ></div>
              <span className="text-slate-600">{values.brandColor}</span>
            </div>
          </div>
          
          <div>
            <span className="font-medium text-slate-700">Widget Position:</span>
            <p className="text-slate-600">{values.widgetPosition || "bottom-right"}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
        <p className="text-sm text-primary-dark">
          <i className="fas fa-info-circle mr-2"></i>
          After creating your chatbot, you'll be able to upload documents, customize responses, and get your embed code.
        </p>
      </div>
    </div>
  );
}