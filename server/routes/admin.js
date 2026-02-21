import { Router } from 'express';
import { getDb, saveDb } from '../db/pool.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const db = await getDb();
        const totalProducts = db.exec('SELECT COUNT(*) FROM products')[0].values[0][0];
        const totalOrders = db.exec('SELECT COUNT(*) FROM orders')[0].values[0][0];
        const totalCustomers = db.exec("SELECT COUNT(*) FROM users WHERE role = 'customer'")[0].values[0][0];
        const revenueResult = db.exec("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered'");
        const totalRevenue = revenueResult[0].values[0][0];
        const pendingOrders = db.exec("SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'packing')")[0].values[0][0];

        res.json({ totalProducts, totalOrders, totalCustomers, totalRevenue, pendingOrders });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/admin/products
router.get('/products', async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec('SELECT * FROM products ORDER BY id');
        if (result.length === 0) return res.json([]);

        const products = result[0].values.map(vals => {
            const row = {};
            result[0].columns.forEach((col, i) => { row[col] = vals[i]; });
            row.images = JSON.parse(row.images || '[]');
            row.colors = JSON.parse(row.colors || '[]');
            row.color_names = JSON.parse(row.color_names || '[]');
            row.colorNames = row.color_names;
            row.sizes = JSON.parse(row.sizes || '[]');
            row.isNew = !!row.is_new;
            row.isPopular = !!row.is_popular;
            row.oldPrice = row.old_price;
            return row;
        });
        res.json(products);
    } catch (err) {
        console.error('Admin products error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// POST /api/admin/products 
router.post('/products', async (req, res) => {
    try {
        const db = await getDb();
        const { name, category, subcategory, price, old_price, images, colors, color_names, sizes, description, material, season, is_new, is_popular, stock, rating } = req.body;

        db.run(
            `INSERT INTO products (name, category, subcategory, price, old_price, images, colors, color_names, sizes, description, material, season, is_new, is_popular, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, subcategory, price, old_price || null, JSON.stringify(images || []), JSON.stringify(colors || []), JSON.stringify(color_names || []), JSON.stringify(sizes || []), description, material, season, is_new ? 1 : 0, is_popular ? 1 : 0, stock || 0, rating || 0]
        );
        saveDb();

        const newProduct = db.exec('SELECT last_insert_rowid()');
        res.status(201).json({ id: newProduct[0].values[0][0], message: 'Mahsulot qo\'shildi' });
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
    try {
        const db = await getDb();
        const { name, category, subcategory, price, old_price, images, colors, color_names, sizes, description, material, season, is_new, is_popular, stock, rating } = req.body;

        db.run(
            `UPDATE products SET name=?, category=?, subcategory=?, price=?, old_price=?, images=?, colors=?, color_names=?, sizes=?, description=?, material=?, season=?, is_new=?, is_popular=?, stock=?, rating=? WHERE id=?`,
            [name, category, subcategory, price, old_price || null, JSON.stringify(images || []), JSON.stringify(colors || []), JSON.stringify(color_names || []), JSON.stringify(sizes || []), description, material, season, is_new ? 1 : 0, is_popular ? 1 : 0, stock || 0, rating || 0, Number(req.params.id)]
        );
        saveDb();

        res.json({ message: 'Mahsulot yangilandi' });
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
    try {
        const db = await getDb();
        db.run('DELETE FROM products WHERE id = ?', [Number(req.params.id)]);
        saveDb();
        res.json({ message: 'Mahsulot o\'chirildi' });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec('SELECT * FROM orders ORDER BY created_at DESC');
        if (result.length === 0) return res.json([]);

        const orders = result[0].values.map(vals => {
            const order = {};
            result[0].columns.forEach((col, i) => { order[col] = vals[i]; });

            const itemsResult = db.exec('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            order.items = itemsResult.length > 0
                ? itemsResult[0].values.map(iv => {
                    const item = {};
                    itemsResult[0].columns.forEach((col, i) => { item[col] = iv[i]; });
                    return item;
                })
                : [];

            order.totalAmount = order.total_amount;
            order.deliveryFee = order.delivery_fee;
            order.paymentMethod = order.payment_method;
            order.customerName = order.customer_name;
            order.createdAt = order.created_at;
            order.updatedAt = order.updated_at;
            return order;
        });

        res.json(orders);
    } catch (err) {
        console.error('Admin orders error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// PUT /api/admin/orders/:id — update status
router.put('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'packing', 'shipping', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Noto\'g\'ri status' });
        }

        const db = await getDb();
        db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, req.params.id]);
        saveDb();

        res.json({ message: 'Buyurtma statusi yangilandi' });
    } catch (err) {
        console.error('Update order error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/admin/customers
router.get('/customers', async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec("SELECT id, name, phone, role, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC");
        if (result.length === 0) return res.json([]);

        const customers = result[0].values.map(vals => {
            const user = { id: vals[0], name: vals[1], phone: vals[2], role: vals[3], created_at: vals[4] };

            // Get order count and total for each customer
            const orderStats = db.exec('SELECT COUNT(*), COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = ?', [user.id]);
            user.orderCount = orderStats[0].values[0][0];
            user.totalSpent = orderStats[0].values[0][1];

            return user;
        });

        res.json(customers);
    } catch (err) {
        console.error('Customers error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
