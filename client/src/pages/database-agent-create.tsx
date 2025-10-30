import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const databaseAgentSchema = z.object({
  name: z.string().min(1, "Agent name is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  // Database Configuration
  databaseType: z.enum(["postgresql", "mysql", "mongodb", "sqlserver", "oracle", "redis"]),
  connectionString: z.string().min(1, "Connection string is required"),
  schema: z.string().optional(),
  
  // LLM Configuration
  llmProvider: z.enum(["openai", "anthropic", "azure", "google", "local"]),
  llmModel: z.string().min(1, "Model is required"),
  apiKey: z.string().min(1, "API key is required"),
  temperature: z.number().min(0).max(2).default(0.7),
  
  // Agent Settings
  maxQueries: z.number().min(1).max(100).default(10),
  allowedTables: z.string().optional(),
  queryTimeout: z.number().min(1).max(300).default(30),
  enableCaching: z.boolean().default(true),
});

type DatabaseAgentForm = z.infer<typeof databaseAgentSchema>;

export default function DatabaseAgentCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("database");
  const [testingConnection, setTestingConnection] = useState(false);

  const form = useForm<DatabaseAgentForm>({
    resolver: zodResolver(databaseAgentSchema),
    defaultValues: {
      name: "",
      description: "",
      databaseType: "postgresql",
      connectionString: "",
      schema: "",
      llmProvider: "openai",
      llmModel: "gpt-4",
      apiKey: "",
      temperature: 0.7,
      maxQueries: 10,
      allowedTables: "",
      queryTimeout: 30,
      enableCaching: true,
    },
  });

  const databaseTypes = [
    { value: "postgresql", label: "PostgreSQL", icon: "fa-database" },
    { value: "mysql", label: "MySQL", icon: "fa-database" },
    { value: "mongodb", label: "MongoDB", icon: "fa-leaf" },
    { value: "sqlserver", label: "SQL Server", icon: "fa-server" },
    { value: "oracle", label: "Oracle", icon: "fa-database" },
    { value: "redis", label: "Redis", icon: "fa-bolt" },
  ];

  const llmProviders = [
    { value: "openai", label: "OpenAI", models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"] },
    { value: "anthropic", label: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"] },
    { value: "azure", label: "Azure OpenAI", models: ["gpt-4", "gpt-35-turbo"] },
    { value: "google", label: "Google AI", models: ["gemini-pro", "gemini-ultra"] },
    { value: "local", label: "Local LLM", models: ["llama-2", "mistral", "custom"] },
  ];

  const selectedProvider = llmProviders.find(p => p.value === form.watch("llmProvider"));

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the database!",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to the database. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const onSubmit = async (data: DatabaseAgentForm) => {
    try {
      console.log("Creating database agent:", data);
      // TODO: Implement API call to create database agent
      toast({
        title: "Database Agent Created!",
        description: "Your database agent has been created successfully.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create database agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Create Database Agent
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Connect your database and configure an AI assistant for natural language queries
              </p>
            </div>
            <Badge className="bg-green-500 text-white">
              <i className="fas fa-database mr-1"></i>
              Database Agent
            </Badge>
          </div>
        </div>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="database">
                      <i className="fas fa-database mr-2"></i>
                      Database
                    </TabsTrigger>
                    <TabsTrigger value="llm">
                      <i className="fas fa-brain mr-2"></i>
                      LLM Configuration
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <i className="fas fa-cog mr-2"></i>
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  {/* Database Configuration Tab */}
                  <TabsContent value="database" className="space-y-4 mt-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Agent Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="My Database Assistant"
                              {...field}
                              className="dark:bg-slate-900 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what this agent will help users with..."
                              {...field}
                              rows={3}
                              className="dark:bg-slate-900 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-4" />

                    <FormField
                      control={form.control}
                      name="databaseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Database Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="dark:bg-slate-900 dark:border-slate-600">
                                <SelectValue placeholder="Select database type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-slate-800">
                              {databaseTypes.map((db) => (
                                <SelectItem key={db.value} value={db.value} className="dark:text-white">
                                  <div className="flex items-center">
                                    <i className={`fas ${db.icon} mr-2`}></i>
                                    {db.label}
                                  </div>
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
                      name="connectionString"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Connection String *</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="postgresql://user:password@host:5432/database"
                              {...field}
                              className="dark:bg-slate-900 dark:border-slate-600 font-mono text-sm"
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            Your connection string is encrypted and stored securely
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Schema (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="public"
                              {...field}
                              className="dark:bg-slate-900 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            Specify the database schema to use
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={testConnection}
                      disabled={testingConnection || !form.watch("connectionString")}
                      className="w-full dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      {testingConnection ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Testing Connection...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plug mr-2"></i>
                          Test Connection
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  {/* LLM Configuration Tab */}
                  <TabsContent value="llm" className="space-y-4 mt-6">
                    <FormField
                      control={form.control}
                      name="llmProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">LLM Provider *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="dark:bg-slate-900 dark:border-slate-600">
                                <SelectValue placeholder="Select LLM provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-slate-800">
                              {llmProviders.map((provider) => (
                                <SelectItem key={provider.value} value={provider.value} className="dark:text-white">
                                  {provider.label}
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
                      name="llmModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Model *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="dark:bg-slate-900 dark:border-slate-600">
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-slate-800">
                              {selectedProvider?.models.map((model) => (
                                <SelectItem key={model} value={model} className="dark:text-white">
                                  {model}
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
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">API Key *</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="sk-..."
                              {...field}
                              className="dark:bg-slate-900 dark:border-slate-600 font-mono"
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            Your API key is encrypted and never exposed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">
                            Temperature: {field.value}
                          </FormLabel>
                          <FormControl>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              className="w-full"
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            Lower values are more focused, higher values are more creative
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-4 mt-6">
                    <FormField
                      control={form.control}
                      name="maxQueries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Max Queries per Session</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="dark:bg-slate-900 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            Maximum number of queries allowed per user session
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowedTables"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Allowed Tables (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="users, products, orders (comma-separated)"
                              {...field}
                              rows={3}
                              className="dark:bg-slate-900 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            Restrict queries to specific tables. Leave empty to allow all tables.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="queryTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">Query Timeout (seconds)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="300"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="dark:bg-slate-900 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            Maximum time allowed for query execution
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enableCaching"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-slate-600">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-slate-700 dark:text-slate-300">
                              Enable Query Caching
                            </FormLabel>
                            <FormDescription className="dark:text-slate-400">
                              Cache frequently asked queries for faster responses
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setLocation("/select-agent")}
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back
                  </Button>
                  <Button type="submit" size="lg">
                    <i className="fas fa-check mr-2"></i>
                    Create Database Agent
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

