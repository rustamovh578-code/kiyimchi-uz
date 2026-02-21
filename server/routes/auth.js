import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, saveDb } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) {
            return res.status(400).json({ error: "Ism, telefon va parol to'ldirilishi shart" });
        }

        const db = await getDb();

        // Check if phone exists
        const existing = db.exec('SELECT id FROM users WHERE phone = ?', [phone]);
        if (existing.length > 0 && existing[0].values.length > 0) {
            return res.status(409).json({ error: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan' });
        }

        const password_hash = bcrypt.hashSync(password, 10);
        db.run('INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, phone, password_hash, 'customer']);
        saveDb();

        const newUser = db.exec('SELECT id, name, phone, role FROM users WHERE phone = ?', [phone]);
        const user = {
            id: newUser[0].values[0][0],
            name: newUser[0].values[0][1],
            phone: newUser[0].values[0][2],
            role: newUser[0].values[0][3],
        };

        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ error: "Telefon va parol to'ldirilishi shart" });
        }

        const db = await getDb();
        const result = db.exec('SELECT id, name, phone, password_hash, role FROM users WHERE phone = ?', [phone]);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(401).json({ error: 'Telefon raqam yoki parol noto\'g\'ri' });
        }

        const row = result[0].values[0];
        const user = { id: row[0], name: row[1], phone: row[2], role: row[4] };
        const passwordHash = row[3];

        if (!bcrypt.compareSync(password, passwordHash)) {
            return res.status(401).json({ error: 'Telefon raqam yoki parol noto\'g\'ri' });
        }

        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec('SELECT id, name, phone, role, created_at FROM users WHERE id = ?', [req.user.id]);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
        }

        const row = result[0].values[0];
        res.json({
            id: row[0], name: row[1], phone: row[2], role: row[3], created_at: row[4],
        });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
