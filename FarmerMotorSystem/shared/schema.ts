import { z } from "zod";

// We'll keep the schema definitions for type safety but adapt them for MongoDB
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const motorStatusSchema = z.object({
  status: z.boolean(),
  timestamp: z.date().optional().default(() => new Date()),
});

export const phaseDetectionSchema = z.object({
  activePhase: z.number().min(1).max(3),
  timestamp: z.date().optional().default(() => new Date()),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Define the User type to match our MongoDB schema but be compatible with existing code
export interface User {
  id: number;
  username: string;
  password: string;
}
