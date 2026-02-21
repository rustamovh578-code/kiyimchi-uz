import { Router } from 'express';
import { getDb } from '../db/pool.js';

const router = Router();

function parseProduct(cols, vals) {
    const row = {};
    cols.forEach((col, i) => { row[col] = vals[i]; });
    // Parse JSON fields
    row.images = JSON.parse(row.images || '[]');
    row.colors = JSON.parse(row.colors || '[]');
    row.color_names = JSON.parse(row.color_names || '[]');
    row.colorNames = row.color_names;
    row.sizes = JSON.parse(row.sizes || '[]');
    row.isNew = !!row.is_new;
    row.isPopular = !!row.is_popular;
    row.oldPrice = row.old_price;
    return row;
}

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const { category, subcategory, search, minPrice, maxPrice, sort, sizes, isNew, isPopular } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category) { query += ' AND category = ?'; params.push(category); }
        if (subcategory) { query += ' AND subcategory = ?'; params.push(subcategory); }
        if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        if (minPrice) { query += ' AND price >= ?'; params.push(Number(minPrice)); }
        if (maxPrice) { query += ' AND price <= ?'; params.push(Number(maxPrice)); }
        if (isNew === 'true') { query += ' AND is_new = 1'; }
        if (isPopular === 'true') { query += ' AND is_popular = 1'; }

        // Sort
        switch (sort) {
            case 'price_asc': query += ' ORDER BY price ASC'; break;
            case 'price_desc': query += ' ORDER BY price DESC'; break;
            case 'rating': query += ' ORDER BY rating DESC'; break;
            case 'new': query += ' ORDER BY created_at DESC'; break;
            default: query += ' ORDER BY id ASC';
        }

        const result = db.exec(query, params);
        if (result.length === 0) return res.json([]);

        const products = result[0].values.map(vals => parseProduct(result[0].columns, vals));

        // Filter by sizes (client-side since sizes is JSON)
        if (sizes) {
            const sizeArr = sizes.split(',');
            const filtered = products.filter(p =>
                sizeArr.some(s => p.sizes.includes(s))
            );
            return res.json(filtered);
        }

        res.json(products);
    } catch (err) {
        console.error('Products error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec('SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Mahsulot topilmadi' });
        }

        const product = parseProduct(result[0].columns, result[0].values[0]);
        res.json(product);
    } catch (err) {
        console.error('Product error:', err);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
