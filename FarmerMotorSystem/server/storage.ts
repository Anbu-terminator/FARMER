import { User as UserModel, MotorActivity, PhaseDetection } from './db';
import { type User, type InsertUser } from "@shared/schema";
import mongoose from 'mongoose';

// Interface for storage methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  recordMotorActivity(userId: number, status: boolean): Promise<void>;
  recordPhaseDetection(userId: number, activePhase: number): Promise<void>;
  getRecentMotorActivities(userId: number, limit?: number): Promise<any[]>;
  getRecentPhaseDetections(userId: number, limit?: number): Promise<any[]>;
}

// MongoDB implementation of storage
export class MongoStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ _id: id }).lean();
      if (!user) return undefined;
      
      return {
        id: parseInt(user._id.toString()),
        username: user.username,
        password: user.password
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username }).lean();
      if (!user) return undefined;
      
      return {
        id: parseInt(user._id.toString()),
        username: user.username,
        password: user.password
      };
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const newUser = new UserModel(insertUser);
      const savedUser = await newUser.save();
      
      return {
        id: parseInt(savedUser._id.toString()),
        username: savedUser.username,
        password: savedUser.password
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async recordMotorActivity(userId: string | number, status: boolean): Promise<void> {
    try {
      const activity = new MotorActivity({
        userId,
        status,
        timestamp: new Date()
      });
      await activity.save();
    } catch (error) {
      console.error('Error recording motor activity:', error);
      throw error;
    }
  }

  async recordPhaseDetection(userId: string | number, activePhase: number): Promise<void> {
    try {
      const phaseDetection = new PhaseDetection({
        userId,
        activePhase,
        timestamp: new Date()
      });
      await phaseDetection.save();
    } catch (error) {
      console.error('Error recording phase detection:', error);
      throw error;
    }
  }

  async getRecentMotorActivities(userId: string | number, limit: number = 5): Promise<any[]> {
    try {
      return await MotorActivity.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting recent motor activities:', error);
      return [];
    }
  }

  async getRecentPhaseDetections(userId: string | number, limit: number = 5): Promise<any[]> {
    try {
      return await PhaseDetection.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting recent phase detections:', error);
      return [];
    }
  }
}

// In-memory storage implementation (for fallback)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private motorActivities: Map<number, any[]>;
  private phaseDetections: Map<number, any[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.motorActivities = new Map();
    this.phaseDetections = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async recordMotorActivity(userId: number, status: boolean): Promise<void> {
    if (!this.motorActivities.has(userId)) {
      this.motorActivities.set(userId, []);
    }
    
    const activities = this.motorActivities.get(userId);
    if (activities) {
      activities.push({
        status,
        timestamp: new Date()
      });
    }
  }

  async recordPhaseDetection(userId: number, activePhase: number): Promise<void> {
    if (!this.phaseDetections.has(userId)) {
      this.phaseDetections.set(userId, []);
    }
    
    const detections = this.phaseDetections.get(userId);
    if (detections) {
      detections.push({
        activePhase,
        timestamp: new Date()
      });
    }
  }

  async getRecentMotorActivities(userId: number, limit: number = 5): Promise<any[]> {
    const activities = this.motorActivities.get(userId) || [];
    return activities.slice(0, limit);
  }

  async getRecentPhaseDetections(userId: number, limit: number = 5): Promise<any[]> {
    const detections = this.phaseDetections.get(userId) || [];
    return detections.slice(0, limit);
  }
}

// Use MongoDB for persistent storage
import { User as UserModel, MotorActivity, PhaseDetection } from './db';
export const storage = new MongoStorage();
