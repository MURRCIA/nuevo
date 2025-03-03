import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import middleware from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? null : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


