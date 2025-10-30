// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users = /* @__PURE__ */ new Map();
  chatbots = /* @__PURE__ */ new Map();
  documents = /* @__PURE__ */ new Map();
  conversations = /* @__PURE__ */ new Map();
  subscriptions = /* @__PURE__ */ new Map();
  async getUser(id) {
    return this.users.get(id);
  }
  async upsertUser(userData) {
    const existingUser = Array.from(this.users.values()).find((u) => u.email === userData.email);
    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      const id = randomUUID();
      const newUser = {
        ...userData,
        id,
        plan: "free",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        email: userData.email ?? null,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        profileImageUrl: userData.profileImageUrl ?? null
      };
      this.users.set(id, newUser);
      const subscription = {
        id: randomUUID(),
        userId: id,
        plan: "free",
        status: "active",
        conversationsUsed: 0,
        maxConversations: 100,
        maxChatbots: 1,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3),
        // 14 days from now
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.subscriptions.set(subscription.id, subscription);
      return newUser;
    }
  }
  async getChatbotsByUserId(userId) {
    return Array.from(this.chatbots.values()).filter((c) => c.userId === userId);
  }
  async getChatbot(id) {
    return this.chatbots.get(id);
  }
  async createChatbot(chatbotData) {
    let id = chatbotData.id;
    let isTentative = false;
    if (!id) {
      id = randomUUID();
      isTentative = true;
    }
    console.log("[MemStorage] Storing chatbot with id:", id, chatbotData, isTentative ? "(tentative)" : "");
    const chatbot = {
      ...chatbotData,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      brandColor: chatbotData.brandColor ?? "#3B82F6",
      widgetPosition: chatbotData.widgetPosition ?? "bottom-right",
      status: chatbotData.status ?? "active"
    };
    this.chatbots.set(id, chatbot);
    console.log("[MemStorage] All chatbots in memory:", JSON.stringify(Array.from(this.chatbots.values()), null, 2));
    return chatbot;
  }
  async updateChatbot(id, chatbotData) {
    const existing = this.chatbots.get(id);
    if (!existing) throw new Error("Chatbot not found");
    const updated = {
      ...existing,
      ...chatbotData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.chatbots.set(id, updated);
    return updated;
  }
  async deleteChatbot(id) {
    this.chatbots.delete(id);
    Array.from(this.documents.entries()).forEach(([docId, doc]) => {
      if (doc.chatbotId === id) {
        this.documents.delete(docId);
      }
    });
    Array.from(this.conversations.entries()).forEach(([convId, conv]) => {
      if (conv.chatbotId === id) {
        this.conversations.delete(convId);
      }
    });
  }
  async getAllChatbots() {
    return Array.from(this.chatbots.values());
  }
  async getDocumentsByChatbotId(chatbotId) {
    return Array.from(this.documents.values()).filter((d) => d.chatbotId === chatbotId);
  }
  async createDocument(documentData) {
    const id = randomUUID();
    const document = {
      ...documentData,
      id,
      uploadedAt: /* @__PURE__ */ new Date()
    };
    this.documents.set(id, document);
    return document;
  }
  async deleteDocument(id) {
    this.documents.delete(id);
  }
  async getConversationsByChatbotId(chatbotId) {
    return Array.from(this.conversations.values()).filter((c) => c.chatbotId === chatbotId);
  }
  async getConversation(id) {
    return this.conversations.get(id);
  }
  async createConversation(conversationData) {
    const id = randomUUID();
    const conversation = {
      ...conversationData,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      messages: conversationData.messages ?? []
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
  async updateConversation(id, conversationData) {
    const existing = this.conversations.get(id);
    if (!existing) throw new Error("Conversation not found");
    const updated = {
      ...existing,
      ...conversationData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.conversations.set(id, updated);
    return updated;
  }
  async getSubscriptionByUserId(userId) {
    return Array.from(this.subscriptions.values()).find((s) => s.userId === userId);
  }
  async createSubscription(subscriptionData) {
    const id = randomUUID();
    const subscription = {
      ...subscriptionData,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      status: subscriptionData.status ?? "active",
      conversationsUsed: subscriptionData.conversationsUsed ?? 0,
      trialEndsAt: subscriptionData.trialEndsAt ?? null
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  async updateSubscription(id, subscriptionData) {
    const existing = this.subscriptions.get(id);
    if (!existing) throw new Error("Subscription not found");
    const updated = {
      ...existing,
      ...subscriptionData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.subscriptions.set(id, updated);
    return updated;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  plan: varchar("plan").default("free").notNull(),
  // free, professional, enterprise
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var chatbots = pgTable("chatbots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  industry: varchar("industry").notNull(),
  purpose: varchar("purpose").notNull(),
  tone: varchar("tone").notNull(),
  businessGoal: text("business_goal").notNull(),
  targetAudience: text("target_audience").notNull(),
  keyFeatures: text("key_features").notNull(),
  brandColor: varchar("brand_color").notNull().default("#3B82F6"),
  widgetPosition: varchar("widget_position").notNull().default("bottom-right"),
  status: varchar("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatbotId: varchar("chatbot_id").notNull().references(() => chatbots.id),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  content: text("content").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow()
});
var conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatbotId: varchar("chatbot_id").notNull().references(() => chatbots.id),
  sessionId: varchar("session_id").notNull(),
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  plan: varchar("plan").notNull(),
  // free, pro, enterprise
  status: varchar("status").notNull().default("active"),
  // active, cancelled, expired
  conversationsUsed: integer("conversations_used").notNull().default(0),
  maxConversations: integer("max_conversations").notNull(),
  maxChatbots: integer("max_chatbots").notNull(),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true
});
var insertChatbotSchema = createInsertSchema(chatbots).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});
var insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true
});
var insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var createChatbotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  industry: z.string().min(1, "Industry is required"),
  purpose: z.string().min(1, "Purpose is required"),
  tone: z.string().min(1, "Tone is required"),
  businessGoal: z.string().min(1, "Business goal is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  keyFeatures: z.string().min(1, "Key features are required"),
  brandColor: z.string().default("#3B82F6"),
  widgetPosition: z.string().default("bottom-right")
});

// server/routes.ts
import multer from "multer";
import { randomUUID as randomUUID2 } from "crypto";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
  // 10MB limit
});
async function registerRoutes(app2) {
  app2.get("/api/chatbots", async (req, res) => {
    try {
      const chatbots2 = await storage.getAllChatbots();
      res.json(chatbots2);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
      res.status(500).json({ message: "Failed to fetch chatbots" });
    }
  });
  app2.get("/api/chatbots/:id", async (req, res) => {
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
  app2.post("/api/chatbots", async (req, res) => {
    try {
      const body = req.body;
      const id = body.id || body._id || body.uuid || randomUUID2();
      const chatbotData = {
        ...body,
        id,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        brandColor: body.brandColor ?? "#3B82F6",
        widgetPosition: body.widgetPosition ?? "bottom-right",
        status: body.status ?? "active"
      };
      const chatbot = await storage.createChatbot(chatbotData);
      res.json(chatbot);
    } catch (error) {
      console.error("Error creating chatbot:", error);
      res.status(500).json({ message: "Failed to create chatbot" });
    }
  });
  app2.put("/api/chatbots/:id", async (req, res) => {
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
  app2.delete("/api/chatbots/:id", async (req, res) => {
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
  app2.get("/api/chatbots/:chatbotId/documents", async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      const documents2 = await storage.getDocumentsByChatbotId(req.params.chatbotId);
      res.json(documents2);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.post("/api/chatbots/:chatbotId/documents", upload.single("file"), async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const content = req.file.buffer.toString("utf8");
      const document = await storage.createDocument({
        chatbotId: req.params.chatbotId,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        content
      });
      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });
  app2.delete("/api/documents/:id", async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });
  app2.post("/api/chatbots/:chatbotId/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      const chatbotId = req.params.chatbotId;
      const chatbot = await storage.getChatbot(chatbotId);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      let conversation = await storage.getConversation(sessionId);
      if (!conversation) {
        conversation = await storage.createConversation({
          chatbotId,
          sessionId,
          messages: []
        });
      }
      const messages = [...conversation.messages, {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }];
      const aiResponse = generateMockResponse(message, chatbot.industry);
      messages.push({
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: aiResponse,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      await storage.updateConversation(sessionId, { messages });
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });
  app2.get("/api/widget/:chatbotId", async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.chatbotId);
      if (!chatbot) {
        return res.status(404).json({ message: "Chatbot not found" });
      }
      res.json({
        id: chatbot.id,
        name: chatbot.name,
        // fallback to brandColor/widgetPosition if needed
        brandColor: chatbot.brandColor,
        widgetPosition: chatbot.widgetPosition,
        status: chatbot.status
      });
    } catch (error) {
      console.error("Error fetching widget config:", error);
      res.status(500).json({ message: "Failed to fetch widget configuration" });
    }
  });
  app2.post("/api/chatbots/from-external", async (req, res) => {
    try {
      const ext = req.body;
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
        status: "active"
      });
      res.json(chatbot);
    } catch (error) {
      console.error("Error storing external chatbot:", error);
      res.status(500).json({ message: "Failed to store external chatbot" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
function generateMockResponse(userMessage, industry) {
  const message = userMessage.toLowerCase();
  const responses = {
    "e-commerce": {
      "hours": "Our store is open 24/7 online! Our customer service team is available Monday-Friday 9 AM to 6 PM EST.",
      "shipping": "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.",
      "return": "We have a 30-day return policy. You can return any unused items in original packaging.",
      "default": "Thank you for your interest! How can I help you with your shopping today?"
    },
    "healthcare": {
      "appointment": "To schedule an appointment, please call our office at (555) 123-4567 or use our online booking system.",
      "hours": "Our clinic hours are Monday-Friday 8 AM to 6 PM, Saturday 9 AM to 2 PM.",
      "insurance": "We accept most major insurance plans. Please contact us to verify your specific coverage.",
      "default": "I'm here to help with your healthcare questions. How can I assist you today?"
    },
    "default": {
      "hours": "Our business hours are Monday-Friday 9 AM to 6 PM EST.",
      "contact": "You can reach us by phone, email, or through this chat. How can I help?",
      "default": "Hello! I'm here to help answer your questions. What would you like to know?"
    }
  };
  const industryResponses = responses[industry] || responses.default;
  if (message.includes("hour") || message.includes("time")) {
    return industryResponses.hours || industryResponses.default;
  } else if (message.includes("ship") && industry === "e-commerce" && "shipping" in industryResponses) {
    return industryResponses.shipping || industryResponses.default;
  } else if (message.includes("return") && industry === "e-commerce" && "return" in industryResponses) {
    return industryResponses.return || industryResponses.default;
  } else if (message.includes("appointment") && industry === "healthcare" && "appointment" in industryResponses) {
    return industryResponses.appointment || industryResponses.default;
  } else if (message.includes("insurance") && industry === "healthcare" && "insurance" in industryResponses) {
    return industryResponses.insurance || industryResponses.default;
  } else if (message.includes("contact") && "contact" in industryResponses) {
    return industryResponses.contact || industryResponses.default;
  } else {
    return industryResponses.default;
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
