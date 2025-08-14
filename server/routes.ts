import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatbotSchema, insertDocumentSchema, insertConversationSchema } from "@shared/schema";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Mock authentication middleware for MVP
const isAuthenticated = (req: any, res: any, next: any) => {
  // Check if user is logged in via session
  if (!req.session?.isLoggedIn) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Set user data for authenticated requests
  req.user = {
    claims: {
      sub: "jhansirao-123",
      email: "jhansirao@example.com",
      first_name: "Jhansi",
      last_name: "Rao"
    }
  };
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes (mocked for MVP)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is already "logged in" (for demo purposes)
      if (!req.session?.isLoggedIn) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = "jhansirao-123";
      let user = await storage.getUser(userId);
      
      if (!user) {
        user = await storage.upsertUser({
          id: userId,
          email: "jhansirao@example.com",
          firstName: "Jhansi",
          lastName: "Rao",
          profileImageUrl: null,
          plan: "free",
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Login route with username/password
  app.post('/api/login', async (req: any, res) => {
    try {
      const { username, password } = req.body;
      
      // Check credentials
      if (username === 'jhansirao' && password === 'Jhanu@123$') {
        // Set session as logged in
        req.session.isLoggedIn = true;
        
        // Create user if doesn't exist
        const userId = "jhansirao-123";
        let user = await storage.getUser(userId);
        
        if (!user) {
          user = await storage.upsertUser({
            id: userId,
            email: "jhansirao@example.com",
            firstName: "Jhansi",
            lastName: "Rao",
            profileImageUrl: null,
            plan: "free",
          });
        }
        
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout route
  app.post('/api/logout', async (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  // Chatbot routes
  app.get("/api/chatbots", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chatbots = await storage.getChatbotsByUserId(userId);
      res.json(chatbots);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
      res.status(500).json({ message: "Failed to fetch chatbots" });
    }
  });

  app.get("/api/chatbots/:id", isAuthenticated, async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      
      // Check ownership
      if (chatbot.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(chatbot);
    } catch (error) {
      console.error("Error fetching chatbot:", error);
      res.status(500).json({ message: "Failed to fetch chatbot" });
    }
  });

  app.post("/api/chatbots", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertChatbotSchema.parse(req.body);
      
      // Check subscription limits
      const subscription = await storage.getSubscriptionByUserId(userId);
      const userChatbots = await storage.getChatbotsByUserId(userId);
      
      if (subscription && userChatbots.length >= subscription.maxChatbots) {
        return res.status(403).json({ message: "Chatbot limit reached for your plan" });
      }
      
      const chatbot = await storage.createChatbot({ ...validatedData, userId });
      res.json(chatbot);
    } catch (error) {
      console.error("Error creating chatbot:", error);
      res.status(500).json({ message: "Failed to create chatbot" });
    }
  });

  app.put("/api/chatbots/:id", isAuthenticated, async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      
      if (chatbot.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const validatedData = insertChatbotSchema.partial().parse(req.body);
      const updated = await storage.updateChatbot(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating chatbot:", error);
      res.status(500).json({ message: "Failed to update chatbot" });
    }
  });

  app.delete("/api/chatbots/:id", isAuthenticated, async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      
      if (chatbot.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteChatbot(req.params.id);
      res.json({ message: "Chatbot deleted successfully" });
    } catch (error) {
      console.error("Error deleting chatbot:", error);
      res.status(500).json({ message: "Failed to delete chatbot" });
    }
  });

  // Document routes
  app.get("/api/chatbots/:chatbotId/documents", isAuthenticated, async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot || chatbot.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const documents = await storage.getDocumentsByChatbotId(req.params.chatbotId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/chatbots/:chatbotId/documents", isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot || chatbot.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Extract text content from file (simplified for MVP)
      const content = req.file.buffer.toString('utf8');
      
      const document = await storage.createDocument({
        chatbotId: req.params.chatbotId,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        content,
      });
      
      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Chat routes
  app.post("/api/chatbots/:chatbotId/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      const chatbotId = req.params.chatbotId;
      
      const chatbot = await storage.getChatbot(chatbotId);
      if (!chatbot || !chatbot.isActive) {
        return res.status(404).json({ message: "Chatbot not found or inactive" });
      }
      
      // Get or create conversation
      let conversation = await storage.getConversation(sessionId);
      if (!conversation) {
        conversation = await storage.createConversation({
          chatbotId,
          sessionId,
          messages: [],
        });
      }
      
      // Add user message
      const messages = [...(conversation.messages as any[]), {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }];
      
      // Generate AI response (mock for MVP)
      const aiResponse = generateMockResponse(message, chatbot.industry);
      messages.push({
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      });
      
      // Update conversation
      await storage.updateConversation(sessionId, { messages });
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Subscription routes
  app.get("/api/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscriptionByUserId(userId);
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Widget embed route (public)
  app.get("/api/widget/:chatbotId", async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot || !chatbot.isActive) {
        return res.status(404).json({ message: "Chatbot not found or inactive" });
      }
      
      // Return widget configuration
      res.json({
        id: chatbot.id,
        name: chatbot.name,
        welcomeMessage: chatbot.welcomeMessage,
        primaryColor: chatbot.primaryColor,
        position: chatbot.position,
        size: chatbot.size,
      });
    } catch (error) {
      console.error("Error fetching widget config:", error);
      res.status(500).json({ message: "Failed to fetch widget configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateMockResponse(userMessage: string, industry: string): string {
  const message = userMessage.toLowerCase();
  
  // Industry-specific responses
  const responses = {
    'e-commerce': {
      'hours': "Our store is open 24/7 online! Our customer service team is available Monday-Friday 9 AM to 6 PM EST.",
      'shipping': "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.",
      'return': "We have a 30-day return policy. You can return any unused items in original packaging.",
      'default': "Thank you for your interest! How can I help you with your shopping today?"
    },
    'healthcare': {
      'appointment': "To schedule an appointment, please call our office at (555) 123-4567 or use our online booking system.",
      'hours': "Our clinic hours are Monday-Friday 8 AM to 6 PM, Saturday 9 AM to 2 PM.",
      'insurance': "We accept most major insurance plans. Please contact us to verify your specific coverage.",
      'default': "I'm here to help with your healthcare questions. How can I assist you today?"
    },
    'default': {
      'hours': "Our business hours are Monday-Friday 9 AM to 6 PM EST.",
      'contact': "You can reach us by phone, email, or through this chat. How can I help?",
      'default': "Hello! I'm here to help answer your questions. What would you like to know?"
    }
  };
  
  const industryResponses = responses[industry as keyof typeof responses] || responses.default;
  
  if (message.includes('hour') || message.includes('time')) {
    return industryResponses.hours || industryResponses.default;
  } else if (message.includes('ship') && industry === 'e-commerce') {
    return industryResponses.shipping || industryResponses.default;
  } else if (message.includes('return') && industry === 'e-commerce') {
    return industryResponses.return || industryResponses.default;
  } else if (message.includes('appointment') && industry === 'healthcare') {
    return industryResponses.appointment || industryResponses.default;
  } else if (message.includes('insurance') && industry === 'healthcare') {
    return industryResponses.insurance || industryResponses.default;
  } else if (message.includes('contact')) {
    return industryResponses.contact || industryResponses.default;
  } else {
    return industryResponses.default;
  }
}
