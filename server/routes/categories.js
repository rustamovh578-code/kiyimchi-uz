import { Router } from 'express';
import { getDb } from '../db/pool.js';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const db = await getDb();

        // Get parent categories
        const parents = db.exec('SELECT id, name, image FROM categories WHERE parent_id IS NULL ORDER BY id');
        if (parents.length === 0) return res.json([]);

        const categories = parents[0].values.map(row => {
            const subs = db.exec('SELECT id, name FROM categories WHERE parent_id = ? ORDER BY id', [row[0]]);
            return {
                id: row[0],
                name: row[1],
                image: row[2],
                subcategories: subs.length > 0 ? subs[0].values.map(s => ({ id: s[0], name: s[1] })) : [],
            };
        });

        res.json(categories);
    } catch (err) {
        console.error('Categories error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
