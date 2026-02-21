import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/init.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import ordersRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import telegramRoutes from './routes/telegram.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/telegram', telegramRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'Kiyimchi.uz API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            products: '/api/products',
            categories: '/api/categories',
            auth: '/api/auth/login',
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Ichki server xatosi' });
});

// Start server
async function start() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`\n🚀 Kiyimchi.uz API server ishlayapti:`);
            console.log(`   http://localhost:${PORT}`);
            console.log(`   API: http://localhost:${PORT}/api/health\n`);
        });
    } catch (err) {
        console.error('Server ishga tushirishda xato:', err);
        process.exit(1);
    }
}

start();
