import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import middleware from './middleware/auth.js';
import authRoutes from './routes/auth.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);// auth routes el usuario ingresa a api/auth/register
app.get("/api/protected", middleware, (req, res) => {
    res.json({
        message: 'Protected route'
    });
});

app.use((req, res, next) => {
    res.status(500).json({
        message: 'Internal server error'
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


