import express, { Request, Response } from "express";
import cors from "cors";
import { vehiclesRouter } from "./routes/vehicles";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/vehicles", vehiclesRouter);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Fleet Management API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(
    `Fleet Management API server running on http://localhost:${PORT}`
  );
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
