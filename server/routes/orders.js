import { Router } from 'express';
import { getDb, saveDb } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/orders — user's orders
router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        if (result.length === 0) return res.json([]);

        const orders = result[0].values.map(vals => {
            const order = {};
            result[0].columns.forEach((col, i) => { order[col] = vals[i]; });

            // Get order items
            const itemsResult = db.exec('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            order.items = itemsResult.length > 0
                ? itemsResult[0].values.map(iv => {
                    const item = {};
                    itemsResult[0].columns.forEach((col, i) => { item[col] = iv[i]; });
                    return item;
                })
                : [];

            // Camel case aliases
            order.totalAmount = order.total_amount;
            order.deliveryFee = order.delivery_fee;
            order.paymentMethod = order.payment_method;
            order.customerName = order.customer_name;
            order.createdAt = order.created_at;
            order.updatedAt = order.updated_at;
            order.userId = order.user_id;

            return order;
        });

        res.json(orders);
    } catch (err) {
        console.error('Orders error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// POST /api/orders — create new order  
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items, totalAmount, deliveryFee, paymentMethod, address, phone, customerName } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Buyurtma bo\'sh bo\'lishi mumkin emas' });
        }

        const db = await getDb();

        // Generate order ID
        const countResult = db.exec('SELECT COUNT(*) FROM orders');
        const count = countResult[0].values[0][0] + 1;
        const orderId = `KUZ-${String(count).padStart(3, '0')}`;

        db.run(
            `INSERT INTO orders (id, user_id, total_amount, delivery_fee, status, payment_method, address, phone, customer_name) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
            [orderId, req.user.id, totalAmount, deliveryFee || 0, paymentMethod, address, phone, customerName || req.user.name]
        );

        for (const item of items) {
            db.run(
                'INSERT INTO order_items (order_id, product_id, name, size, color, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [orderId, item.productId, item.name, item.size, item.color, item.quantity, item.price]
            );
        }

        saveDb();
        res.status(201).json({ id: orderId, status: 'pending', message: 'Buyurtma qabul qilindi!' });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
