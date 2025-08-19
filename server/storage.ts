import {
  users,
  chatbots,
  documents,
  conversations,
  subscriptions,
  type User,
  type UpsertUser,
  type Chatbot,
  type InsertChatbot,
  type Document,
  type InsertDocument,
  type Conversation,
  type InsertConversation,
  type Subscription,
  type InsertSubscription,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Chatbot operations
  getChatbotsByUserId(userId: string): Promise<Chatbot[]>;
  getChatbot(id: string): Promise<Chatbot | undefined>;
  createChatbot(chatbot: InsertChatbot & { userId: string }): Promise<Chatbot>;
  updateChatbot(id: string, chatbot: Partial<InsertChatbot>): Promise<Chatbot>;
  deleteChatbot(id: string): Promise<void>;
  getAllChatbots(): Promise<Chatbot[]>;
  
  // Document operations
  getDocumentsByChatbotId(chatbotId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  
  // Conversation operations
  getConversationsByChatbotId(chatbotId: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, conversation: Partial<InsertConversation>): Promise<Conversation>;
  
  // Subscription operations
  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, subscription: Partial<InsertSubscription>): Promise<Subscription>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private chatbots: Map<string, Chatbot> = new Map();
  private documents: Map<string, Document> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email);
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      const id = randomUUID();
      const newUser: User = {
        ...userData,
        id,
        plan: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
        email: userData.email ?? null,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        profileImageUrl: userData.profileImageUrl ?? null,
      };
      this.users.set(id, newUser);
      
      // Create default free subscription
      const subscription: Subscription = {
        id: randomUUID(),
        userId: id,
        plan: "free",
        status: "active",
        conversationsUsed: 0,
        maxConversations: 100,
        maxChatbots: 1,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.subscriptions.set(subscription.id, subscription);
      
      return newUser;
    }
  }

  async getChatbotsByUserId(userId: string): Promise<Chatbot[]> {
    return Array.from(this.chatbots.values()).filter(c => c.userId === userId);
  }

  async getChatbot(id: string): Promise<Chatbot | undefined> {
    return this.chatbots.get(id);
  }

  async createChatbot(chatbotData: InsertChatbot & { userId: string; id?: string }): Promise<Chatbot> {
    let id = chatbotData.id;
    let isTentative = false;
    if (!id) {
      id = randomUUID();
      isTentative = true;
    }
    console.log("[MemStorage] Storing chatbot with id:", id, chatbotData, isTentative ? '(tentative)' : '');
    const chatbot: Chatbot = {
      ...chatbotData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      brandColor: chatbotData.brandColor ?? "#3B82F6",
      widgetPosition: chatbotData.widgetPosition ?? "bottom-right",
      status: chatbotData.status ?? "active",
    };
    this.chatbots.set(id, chatbot);
    // Print all chatbots in memory as JSON
    console.log('[MemStorage] All chatbots in memory:', JSON.stringify(Array.from(this.chatbots.values()), null, 2));
    return chatbot;
  }

  async updateChatbot(id: string, chatbotData: Partial<InsertChatbot>): Promise<Chatbot> {
    const existing = this.chatbots.get(id);
    if (!existing) throw new Error("Chatbot not found");
    
    const updated: Chatbot = {
      ...existing,
      ...chatbotData,
      updatedAt: new Date(),
    };
    this.chatbots.set(id, updated);
    return updated;
  }

  async deleteChatbot(id: string): Promise<void> {
    this.chatbots.delete(id);
    // Also delete related documents and conversations
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

  async getAllChatbots(): Promise<Chatbot[]> {
    return Array.from(this.chatbots.values());
  }

  async getDocumentsByChatbotId(chatbotId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.chatbotId === chatbotId);
  }

  async createDocument(documentData: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...documentData,
      id,
      uploadedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
  }

  async getConversationsByChatbotId(chatbotId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(c => c.chatbotId === chatbotId);
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversationData: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...conversationData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: conversationData.messages ?? [],
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, conversationData: Partial<InsertConversation>): Promise<Conversation> {
    const existing = this.conversations.get(id);
    if (!existing) throw new Error("Conversation not found");
    
    const updated: Conversation = {
      ...existing,
      ...conversationData,
      updatedAt: new Date(),
    };
    this.conversations.set(id, updated);
    return updated;
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(s => s.userId === userId);
  }

  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = {
      ...subscriptionData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: subscriptionData.status ?? "active",
      conversationsUsed: subscriptionData.conversationsUsed ?? 0,
      trialEndsAt: subscriptionData.trialEndsAt ?? null,
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, subscriptionData: Partial<InsertSubscription>): Promise<Subscription> {
    const existing = this.subscriptions.get(id);
    if (!existing) throw new Error("Subscription not found");
    
    const updated: Subscription = {
      ...existing,
      ...subscriptionData,
      updatedAt: new Date(),
    };
    this.subscriptions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
