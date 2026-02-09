import { Router, type Request, type Response } from "express";
import sequelize from "../config/db.js";

const router = Router();

// Health check endpoint for Kubernetes
router.get("/health", async (req: Request, res: Response) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Simple readiness check (faster, no DB query)
router.get("/ready", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ready",
    timestamp: new Date().toISOString(),
  });
});

export default router;