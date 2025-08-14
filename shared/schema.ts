import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer,
  boolean,
  jsonb,
  index 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  plan: varchar("plan").default("free").notNull(), // free, professional, enterprise
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatbots = pgTable("chatbots", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatbotId: varchar("chatbot_id").notNull().references(() => chatbots.id),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  content: text("content").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatbotId: varchar("chatbot_id").notNull().references(() => chatbots.id),
  sessionId: varchar("session_id").notNull(),
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  plan: varchar("plan").notNull(), // free, pro, enterprise
  status: varchar("status").notNull().default("active"), // active, cancelled, expired
  conversationsUsed: integer("conversations_used").notNull().default(0),
  maxConversations: integer("max_conversations").notNull(),
  maxChatbots: integer("max_chatbots").notNull(),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertChatbotSchema = createInsertSchema(chatbots).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Create chatbot schema for form validation
export const createChatbotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  industry: z.string().min(1, "Industry is required"),
  purpose: z.string().min(1, "Purpose is required"),
  tone: z.string().min(1, "Tone is required"),
  businessGoal: z.string().min(1, "Business goal is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  keyFeatures: z.string().min(1, "Key features are required"),
  brandColor: z.string().default("#3B82F6"),
  widgetPosition: z.string().default("bottom-right"),
});

// Chat message type
export type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChatbot = z.infer<typeof insertChatbotSchema>;
export type Chatbot = typeof chatbots.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type CreateChatbotForm = z.infer<typeof createChatbotSchema>;
