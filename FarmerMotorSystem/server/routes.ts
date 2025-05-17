import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { insertUserSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "farmer-corner-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
      }
    })
  );

  // Authentication middleware
  const authenticateUser = (req: Request, res: Response, next: Function) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Registration endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Validate request
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user with hashed password
      const user = await storage.createUser({
        username: userData.username,
        password: hashedPassword
      });
      
      // Return user without password
      res.status(201).json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      // Validate request
      const loginData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(loginData.username);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(loginData.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Return user without password
      res.json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Convert userId to number if it's a string
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId as number;
      const user = await storage.getUser(userIdNum);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Server error while getting user" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Mock phase detection endpoint
  app.get("/api/phase", authenticateUser, (req: Request, res: Response) => {
    // In a real app, this would get data from sensors
    const phases = [1, 2, 3];
    const activePhase = phases[Math.floor(Math.random() * phases.length)];
    
    res.json({ 
      activePhase,
      timestamp: new Date()
    });
  });

  // Motor status endpoint
  app.post("/api/motor/toggle", authenticateUser, (req: Request, res: Response) => {
    try {
      const { status } = z.object({ status: z.boolean() }).parse(req.body);
      // In a real app, this would control actual hardware
      res.json({ 
        success: true,
        status,
        timestamp: new Date()
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error toggling motor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
