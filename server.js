import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import middleware from './middleware/auth.js';
import authRoutes from './routes/auth.js';


const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-domain.com' : 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// Protected route example
app.get("/api/protected", middleware, (req, res) => {
    res.json({
        message: 'Protected route',
        user: req.user,
    });
});

// Health check endpoint

// Error handling middleware
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
      message: "This is a protected route",
      user: req.user,
    });
  });
  
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  });
  

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


