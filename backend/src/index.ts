import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

import authRoutes from './routes/auth';
import companyRoutes from './routes/companies';
import taskRoutes from './routes/tasks';
import stripeRoutes from './routes/stripe';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(cors({
    origin: function (origin, callback) {
        // Dynamically allow all origins to prevent Vercel preview domain/DNS propagation errors
        callback(null, true);
    },
    credentials: true
}));

app.use(limiter);

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
