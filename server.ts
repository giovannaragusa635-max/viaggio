import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Mock data for the prototype
  app.get("/api/spots", (req, res) => {
    res.json([
      { id: 1, name: "Trattoria da Giggi", type: "Food", price: "€", safety: 5, lat: 41.8902, lng: 12.4922, description: "Authentic Roman pasta for under 12€." },
      { id: 2, name: "YellowSquare Hostel", type: "Stay", price: "€€", safety: 4, lat: 41.9055, lng: 12.5047, description: "Best social hostel in Rome with a basement bar." },
      { id: 3, name: "Mercato di Testaccio", type: "Food", price: "€", safety: 5, lat: 41.8785, lng: 12.4775, description: "Street food heaven. Try the Mordi e Vai sandwich." },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VibeRoute server running on http://localhost:${PORT}`);
  });
}

startServer();
