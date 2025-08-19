import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatbotSchema, insertDocumentSchema, insertConversationSchema } from "@shared/schema";
import multer from "multer";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Chatbot routes
  app.get("/api/chatbots", async (req: any, res) => {
    try {
      // Return all chatbots (no user filtering)
      const chatbots = await storage.getAllChatbots();
      res.json(chatbots);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
      res.status(500).json({ message: "Failed to fetch chatbots" });
    }
  });

  app.get("/api/chatbots/:id", async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      res.json(chatbot);
    } catch (error) {
      console.error("Error fetching chatbot:", error);
      res.status(500).json({ message: "Failed to fetch chatbot" });
    }
  });

  app.post("/api/chatbots", async (req: any, res) => {
    try {
      const body = req.body;
      // Accept all fields, store everything, and use any id provided
      const id = body.id || body._id || body.uuid || randomUUID();
      const chatbotData = {
        ...body,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        brandColor: body.brandColor ?? "#3B82F6",
        widgetPosition: body.widgetPosition ?? "bottom-right",
        status: body.status ?? "active",
      };
      const chatbot = await storage.createChatbot(chatbotData);
      res.json(chatbot);
    } catch (error) {
      console.error("Error creating chatbot:", error);
      res.status(500).json({ message: "Failed to create chatbot" });
    }
  });

  app.put("/api/chatbots/:id", async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      const validatedData = insertChatbotSchema.partial().parse(req.body);
      const updated = await storage.updateChatbot(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating chatbot:", error);
      res.status(500).json({ message: "Failed to update chatbot" });
    }
  });

  app.delete("/api/chatbots/:id", async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      await storage.deleteChatbot(req.params.id);
      res.json({ message: "Chatbot deleted successfully" });
    } catch (error) {
      console.error("Error deleting chatbot:", error);
      res.status(500).json({ message: "Failed to delete chatbot" });
    }
  });

  // Document routes
  app.get("/api/chatbots/:chatbotId/documents", async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      const documents = await storage.getDocumentsByChatbotId(req.params.chatbotId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/chatbots/:chatbotId/documents", upload.single('file'), async (req: any, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
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

  app.delete("/api/documents/:id", async (req: any, res) => {
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
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
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

  // Widget embed route (public)
  app.get("/api/widget/:chatbotId", async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      // Return widget configuration (only fields that exist)
      res.json({
        id: chatbot.id,
        name: chatbot.name,
        // fallback to brandColor/widgetPosition if needed
        brandColor: chatbot.brandColor,
        widgetPosition: chatbot.widgetPosition,
        status: chatbot.status,
      });
    } catch (error) {
      console.error("Error fetching widget config:", error);
      res.status(500).json({ message: "Failed to fetch widget configuration" });
    }
  });

  // Accept and store external API chatbot response directly
  app.post("/api/chatbots/from-external", async (req: any, res) => {
    try {
      const ext = req.body;
      // Map external response to memory storage fields
      const chatbot = await storage.createChatbot({
        id: ext._id,
        userId: ext.user_id?.toString() ?? "public",
        name: ext.user_steps_details?.name ?? ext.chatbot_name ?? "Chatbot",
        industry: ext.user_steps_details?.industry ?? "",
        purpose: ext.user_steps_details?.purpose ?? "",
        tone: ext.user_steps_details?.tone ?? "",
        brandColor: ext.user_steps_details?.brandColor ?? "#3B82F6",
        businessGoal: ext.user_steps_details?.businessGoal ?? "",
        targetAudience: ext.user_steps_details?.targetAudience ?? "",
        keyFeatures: ext.user_steps_details?.keyFeatures ?? "",
        widgetPosition: ext.user_steps_details?.widgetPosition ?? "bottom-right",
        status: "active",
      });
      res.json(chatbot);
    } catch (error) {
      console.error("Error storing external chatbot:", error);
      res.status(500).json({ message: "Failed to store external chatbot" });
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
  } else if (message.includes('ship') && industry === 'e-commerce' && 'shipping' in industryResponses) {
    return (industryResponses as typeof responses['e-commerce']).shipping || industryResponses.default;
  } else if (message.includes('return') && industry === 'e-commerce' && 'return' in industryResponses) {
    return (industryResponses as typeof responses['e-commerce']).return || industryResponses.default;
  } else if (message.includes('appointment') && industry === 'healthcare' && 'appointment' in industryResponses) {
    return (industryResponses as typeof responses['healthcare']).appointment || industryResponses.default;
  } else if (message.includes('insurance') && industry === 'healthcare' && 'insurance' in industryResponses) {
    return (industryResponses as typeof responses['healthcare']).insurance || industryResponses.default;
  } else if (message.includes('contact') && 'contact' in industryResponses) {
    return (industryResponses as typeof responses['default']).contact || industryResponses.default;
  } else {
    return industryResponses.default;
  }
}
