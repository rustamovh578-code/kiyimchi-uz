import { getDb, saveDb } from './pool.js';
import bcrypt from 'bcryptjs';

const products = [
    {
        id: 1, name: "Premium Slim Fit Ko'ylak", category: 'men', subcategory: 'men-shirts',
        price: 289000, old_price: 350000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', 'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=600&q=80']),
        colors: JSON.stringify(['#FFFFFF', '#1A1A2E', '#4A90D9']), color_names: JSON.stringify(['Oq', 'Qora', 'Moviy']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        description: "Yuqori sifatli paxta aralashmasidan tayyorlangan slim fit ko'ylak. Ish va kundalik uchun ideal.",
        material: '100% Paxta', season: 'Barcha mavsumlar',
        is_new: 1, is_popular: 1, stock: 45, rating: 4.8,
    },
    {
        id: 2, name: "Klassik Shimlar", category: 'men', subcategory: 'men-pants',
        price: 349000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80']),
        colors: JSON.stringify(['#1A1A2E', '#3B3B3B', '#8B7355']), color_names: JSON.stringify(['Qora', 'Kulrang', 'Jigarrang']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        description: "Klassik uslubdagi shimlar. Ofis va rasmiy tadbirlar uchun qulay.",
        material: '65% Poliester, 35% Paxta', season: 'Barcha mavsumlar',
        is_new: 0, is_popular: 1, stock: 32, rating: 4.5,
    },
    {
        id: 3, name: "Qishki Kurtka Premium", category: 'men', subcategory: 'men-jackets',
        price: 799000, old_price: 950000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&q=80']),
        colors: JSON.stringify(['#1A1A2E', '#2C5F2D', '#8B4513']), color_names: JSON.stringify(['Qora', 'Yashil', 'Jigarrang']),
        sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
        description: "Issiq va bardoshli qishki kurtka. Shamol va sovuqdan himoya qiladi.",
        material: "Tashqi: Nylon, Ichki: Paxta to'ldiruvchi", season: 'Qish',
        is_new: 1, is_popular: 0, stock: 18, rating: 4.9,
    },
    {
        id: 4, name: "Sport Futbolka", category: 'men', subcategory: 'men-tshirts',
        price: 129000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80']),
        colors: JSON.stringify(['#1A1A2E', '#FFFFFF', '#E74C3C']), color_names: JSON.stringify(['Qora', 'Oq', 'Qizil']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        description: "Qulay va yengil sport futbolka. Har kunlik kiyish uchun ideal.",
        material: '100% Paxta', season: 'Yoz',
        is_new: 0, is_popular: 1, stock: 120, rating: 4.3,
    },
    {
        id: 5, name: "Elegant Kechki Ko'ylak", category: 'women', subcategory: 'women-dresses',
        price: 459000, old_price: 580000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80']),
        colors: JSON.stringify(['#E74C3C', '#1A1A2E', '#8E44AD']), color_names: JSON.stringify(['Qizil', 'Qora', 'Binafsha']),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
        description: "Nafis kechki ko'ylak. Maxsus tadbirlar uchun mukammal tanlov.",
        material: '70% Poliester, 30% Ipak', season: 'Barcha mavsumlar',
        is_new: 1, is_popular: 1, stock: 15, rating: 4.9,
    },
    {
        id: 6, name: "Zamonaviy Ayollar Shimi", category: 'women', subcategory: 'women-pants',
        price: 279000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80', 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&q=80']),
        colors: JSON.stringify(['#F5CBA7', '#1A1A2E', '#27AE60']), color_names: JSON.stringify(['Bej', 'Qora', 'Yashil']),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        description: "Zamonaviy kesimli ayollar shimi. Ofis va kundalik hayot uchun qulay.",
        material: '95% Paxta, 5% Elastan', season: 'Barcha mavsumlar',
        is_new: 0, is_popular: 1, stock: 40, rating: 4.6,
    },
    {
        id: 7, name: "Ipak Bluza", category: 'women', subcategory: 'women-blouses',
        price: 329000, old_price: 399000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80']),
        colors: JSON.stringify(['#FFFFFF', '#FFC0CB', '#87CEEB']), color_names: JSON.stringify(['Oq', 'Pushti', 'Havorang']),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
        description: "Tabiiy ipakdan tayyorlangan bluza. Yumshoq va nafis.",
        material: '100% Ipak', season: 'Bahor/Kuz',
        is_new: 1, is_popular: 0, stock: 22, rating: 4.7,
    },
    {
        id: 8, name: "Palto - Kuz/Qish", category: 'women', subcategory: 'women-coats',
        price: 1290000, old_price: 1500000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80', 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80']),
        colors: JSON.stringify(['#F5CBA7', '#1A1A2E', '#8B0000']), color_names: JSON.stringify(['Bej', 'Qora', 'Qizil']),
        sizes: JSON.stringify(['S', 'M', 'L']),
        description: "Premium sifatli palto. Jun aralashmasidan tayyorlangan. Issiq va zamonaviy.",
        material: '80% Jun, 20% Poliester', season: 'Kuz/Qish',
        is_new: 0, is_popular: 1, stock: 10, rating: 4.8,
    },
    {
        id: 9, name: "Bolalar Futbolka Set", category: 'kids', subcategory: 'kids-tshirts',
        price: 89000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80']),
        colors: JSON.stringify(['#4A90D9', '#E74C3C', '#27AE60']), color_names: JSON.stringify(["Ko'k", 'Qizil', 'Yashil']),
        sizes: JSON.stringify(['3-4Y', '5-6Y', '7-8Y', '9-10Y']),
        description: "Bolalar uchun yumshoq paxta futbolka. Rang-barang dizaynlar bilan.",
        material: '100% Organik paxta', season: 'Yoz',
        is_new: 1, is_popular: 1, stock: 80, rating: 4.4,
    },
    {
        id: 10, name: "Bolalar Jinsi Shim", category: 'kids', subcategory: 'kids-pants',
        price: 159000, old_price: 189000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80']),
        colors: JSON.stringify(['#4A90D9', '#1A1A2E']), color_names: JSON.stringify(["Ko'k", 'Qora']),
        sizes: JSON.stringify(['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y']),
        description: "Bolalar uchun mustahkam jinsi shim. Qulay va chidamli.",
        material: '98% Paxta, 2% Elastan', season: 'Barcha mavsumlar',
        is_new: 0, is_popular: 0, stock: 55, rating: 4.2,
    },
    {
        id: 11, name: "Erkaklar Kostyum To'plami", category: 'men', subcategory: 'men-suits',
        price: 1890000, old_price: 2200000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80']),
        colors: JSON.stringify(["#1B2631", "#2C3E50", "#566573"]), color_names: JSON.stringify(["To'q ko'k", "Ko'k-kulrang", "Kulrang"]),
        sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
        description: "Italiya junidan tayyorlangan premium kostyum. Klassik va zamonaviy uslubda.",
        material: '100% Jun (Italiya)', season: 'Barcha mavsumlar',
        is_new: 0, is_popular: 1, stock: 8, rating: 4.9,
    },
    {
        id: 12, name: "Yubka - Midi", category: 'women', subcategory: 'women-skirts',
        price: 249000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&q=80']),
        colors: JSON.stringify(['#1A1A2E', '#8B4513', '#F5CBA7']), color_names: JSON.stringify(['Qora', 'Jigarrang', 'Bej']),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
        description: "Zamonaviy midi yubka. Plisseli dizayn bilan nafis ko'rinish.",
        material: '100% Poliester', season: 'Bahor/Yoz',
        is_new: 1, is_popular: 0, stock: 30, rating: 4.5,
    },
    {
        id: 13, name: "Bolalar Qishki Kurtka", category: 'kids', subcategory: 'kids-jackets',
        price: 459000, old_price: 550000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80', 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80']),
        colors: JSON.stringify(['#E74C3C', '#4A90D9', '#1A1A2E']), color_names: JSON.stringify(['Qizil', "Ko'k", 'Qora']),
        sizes: JSON.stringify(['3-4Y', '5-6Y', '7-8Y', '9-10Y']),
        description: "Bolalar uchun issiq qishki kurtka. Suv o'tkazmaydi va shamoldan himoya qiladi.",
        material: "Nylon, Paxta to'ldiruvchi", season: 'Qish',
        is_new: 1, is_popular: 1, stock: 25, rating: 4.7,
    },
    {
        id: 14, name: "Erkaklar Polo Futbolka", category: 'men', subcategory: 'men-tshirts',
        price: 179000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80', 'https://images.unsplash.com/photo-1559582798-678dfc68cce4?w=600&q=80']),
        colors: JSON.stringify(['#1B4F72', '#FFFFFF', '#27AE60']), color_names: JSON.stringify(["Ko'k", 'Oq', 'Yashil']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        description: "Klassik polo futbolka. Pique paxta materialidan. Sport va kundalik uchun.",
        material: '100% Paxta pique', season: 'Yoz',
        is_new: 0, is_popular: 0, stock: 65, rating: 4.4,
    },
    {
        id: 15, name: "Bolalar Ko'ylak", category: 'kids', subcategory: 'kids-dresses',
        price: 149000, old_price: 179000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80']),
        colors: JSON.stringify(['#FFC0CB', '#FFFFFF', '#FFD700']), color_names: JSON.stringify(['Pushti', 'Oq', 'Oltin']),
        sizes: JSON.stringify(['3-4Y', '5-6Y', '7-8Y']),
        description: "Qizlar uchun chiroyli bayramona ko'ylak. Yumshoq material.",
        material: '100% Paxta', season: 'Bahor/Yoz',
        is_new: false, is_popular: true, stock: 35, rating: 4.6,
    },
    {
        id: 16, name: "Erkaklar Jinsi Shim", category: 'men', subcategory: 'men-pants',
        price: 399000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80']),
        colors: JSON.stringify(['#4A90D9', '#1A1A2E', '#3B3B3B']), color_names: JSON.stringify(["Ko'k", 'Qora', 'Kulrang']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        description: "Premium sifatli erkaklar jinsi shimi. Slim fit.",
        material: '99% Paxta, 1% Elastan', season: 'Barcha mavsumlar',
        is_new: 0, is_popular: 1, stock: 50, rating: 4.6,
    },
    {
        id: 17, name: "Ayollar Trench Palto", category: 'women', subcategory: 'women-coats',
        price: 890000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', 'https://images.unsplash.com/photo-1520012218364-3dbe62c99bee?w=600&q=80']),
        colors: JSON.stringify(['#F5CBA7', '#1A1A2E', '#8B0000']), color_names: JSON.stringify(['Bej', 'Qora', 'Qizil']),
        sizes: JSON.stringify(['S', 'M', 'L']),
        description: "Klassik trench palto. Bahor va kuz uchun ideal.",
        material: '70% Paxta, 30% Poliester', season: 'Bahor/Kuz',
        is_new: 0, is_popular: 0, stock: 12, rating: 4.5,
    },
    {
        id: 18, name: "Ayollar Chopon Ko'ylak", category: 'women', subcategory: 'women-dresses',
        price: 389000, old_price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=80', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80']),
        colors: JSON.stringify(['#27AE60', '#E74C3C', '#F39C12']), color_names: JSON.stringify(['Yashil', 'Qizil', 'Oltin']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        description: "An'anaviy chopon uslubidagi zamonaviy ko'ylak. Milliy va zamonaviy dizayn uyg'unligi.",
        material: '100% Ipak-atlas', season: 'Barcha mavsumlar',
        is_new: 1, is_popular: 0, stock: 18, rating: 4.8,
    },
    {
        id: 19, name: "Ayollar Sport Kostyum", category: 'women', subcategory: 'women-pants',
        price: 399000, old_price: 480000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1538329972958-465d6d2144ed?w=600&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80']),
        colors: JSON.stringify(['#1A1A2E', '#FFC0CB', '#868E96']), color_names: JSON.stringify(['Qora', 'Pushti', 'Kulrang']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        description: "Zamonaviy sport kostyum. Mashg'ulot va dam olish uchun qulay.",
        material: '80% Paxta, 20% Poliester', season: 'Barcha mavsumlar',
        is_new: 1, is_popular: 1, stock: 28, rating: 4.5,
    },
    {
        id: 20, name: "Bolalar Sport To'plam", category: 'kids', subcategory: 'kids-tshirts',
        price: 189000, old_price: 229000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80']),
        colors: JSON.stringify(['#E74C3C', '#4A90D9', '#1A1A2E']), color_names: JSON.stringify(['Qizil', "Ko'k", 'Qora']),
        sizes: JSON.stringify(['3-4Y', '5-6Y', '7-8Y', '9-10Y']),
        description: "Bolalar uchun sport to'plam. Qulay va chidamli material.",
        material: '100% Paxta', season: 'Barcha mavsumlar',
        is_new: 0, is_popular: 1, stock: 40, rating: 4.3,
    },
];

export async function initDatabase() {
    const db = await getDb();

    // Create tables
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            image TEXT,
            parent_id TEXT,
            FOREIGN KEY (parent_id) REFERENCES categories(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT,
            price INTEGER NOT NULL,
            old_price INTEGER,
            images TEXT DEFAULT '[]',
            colors TEXT DEFAULT '[]',
            color_names TEXT DEFAULT '[]',
            sizes TEXT DEFAULT '[]',
            description TEXT,
            material TEXT,
            season TEXT,
            is_new INTEGER DEFAULT 0,
            is_popular INTEGER DEFAULT 0,
            stock INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            total_amount INTEGER NOT NULL,
            delivery_fee INTEGER DEFAULT 0,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending','packing','shipping','delivered','cancelled')),
            payment_method TEXT,
            address TEXT,
            phone TEXT,
            customer_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            product_id INTEGER,
            name TEXT NOT NULL,
            size TEXT,
            color TEXT,
            quantity INTEGER DEFAULT 1,
            price INTEGER NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    // Check if already seeded
    const existing = db.exec('SELECT COUNT(*) as count FROM products');
    if (existing[0]?.values[0][0] > 0) {
        console.log('✅ Database already has data, skipping seed.');
        saveDb();
        return;
    }

    console.log('🌱 Seeding database...');

    // Seed admin user (password: admin123)
    const adminHash = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)`,
        ['Admin', '+998901111111', adminHash, 'admin']);

    // Seed demo customer (password: 123456)
    const customerHash = bcrypt.hashSync('123456', 10);
    db.run(`INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)`,
        ['Aziz Karimov', '+998901234567', customerHash, 'customer']);

    // Seed categories
    const cats = [
        { id: 'men', name: 'Erkaklar', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80' },
        { id: 'women', name: 'Ayollar', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80' },
        { id: 'kids', name: 'Bolalar', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80' },
    ];
    const subcats = [
        { id: 'men-shirts', name: "Ko'ylaklar", parent_id: 'men' },
        { id: 'men-pants', name: 'Shimlar', parent_id: 'men' },
        { id: 'men-jackets', name: 'Kurtkalar', parent_id: 'men' },
        { id: 'men-tshirts', name: 'Futbolkalar', parent_id: 'men' },
        { id: 'men-suits', name: 'Kostyumlar', parent_id: 'men' },
        { id: 'women-dresses', name: "Ko'ylaklar", parent_id: 'women' },
        { id: 'women-pants', name: 'Shimlar', parent_id: 'women' },
        { id: 'women-blouses', name: 'Bluzalar', parent_id: 'women' },
        { id: 'women-skirts', name: 'Yubkalar', parent_id: 'women' },
        { id: 'women-coats', name: 'Paltolar', parent_id: 'women' },
        { id: 'kids-tshirts', name: 'Futbolkalar', parent_id: 'kids' },
        { id: 'kids-pants', name: 'Shimlar', parent_id: 'kids' },
        { id: 'kids-dresses', name: "Ko'ylaklar", parent_id: 'kids' },
        { id: 'kids-jackets', name: 'Kurtkalar', parent_id: 'kids' },
    ];

    for (const c of cats) {
        db.run(`INSERT INTO categories (id, name, image, parent_id) VALUES (?, ?, ?, NULL)`, [c.id, c.name, c.image]);
    }
    for (const s of subcats) {
        db.run(`INSERT INTO categories (id, name, image, parent_id) VALUES (?, ?, NULL, ?)`, [s.id, s.name, s.parent_id]);
    }

    // Seed products
    const insertProduct = `INSERT INTO products (id, name, category, subcategory, price, old_price, images, colors, color_names, sizes, description, material, season, is_new, is_popular, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    for (const p of products) {
        db.run(insertProduct, [p.id, p.name, p.category, p.subcategory, p.price, p.old_price, p.images, p.colors, p.color_names, p.sizes, p.description, p.material, p.season, p.is_new ? 1 : 0, p.is_popular ? 1 : 0, p.stock, p.rating]);
    }

    // Seed orders
    const seedOrders = [
        { id: 'KUZ-001', user_id: 2, total_amount: 547000, delivery_fee: 25000, status: 'delivered', payment_method: 'payme', address: "Toshkent sh., Chilonzor t., 7-kvartal, 15-uy", phone: '+998901234567', customer_name: 'Aziz Karimov', created_at: '2026-02-15T10:30:00', updated_at: '2026-02-18T14:00:00' },
        { id: 'KUZ-002', user_id: 2, total_amount: 459000, delivery_fee: 25000, status: 'shipping', payment_method: 'click', address: "Samarqand sh., Registon ko'chasi, 42-uy", phone: '+998931234567', customer_name: 'Nilufar Rahimova', created_at: '2026-02-17T15:20:00', updated_at: '2026-02-19T09:00:00' },
        { id: 'KUZ-003', user_id: 2, total_amount: 426000, delivery_fee: 30000, status: 'packing', payment_method: 'cash', address: "Buxoro sh., Navoiy ko'chasi, 18-uy", phone: '+998941234567', customer_name: 'Dilnoza Usmonova', created_at: '2026-02-19T08:45:00', updated_at: '2026-02-19T08:45:00' },
        { id: 'KUZ-004', user_id: 2, total_amount: 1890000, delivery_fee: 0, status: 'pending', payment_method: 'uzum', address: "Toshkent sh., Mirzo Ulug'bek t., 5-uy", phone: '+998951234567', customer_name: 'Bobur Toshmatov', created_at: '2026-02-19T12:00:00', updated_at: '2026-02-19T12:00:00' },
        { id: 'KUZ-005', user_id: 2, total_amount: 1619000, delivery_fee: 0, status: 'delivered', payment_method: 'payme', address: "Namangan sh., Mustaqillik ko'chasi, 30-uy", phone: '+998971234567', customer_name: 'Gulnora Xasanova', created_at: '2026-02-10T16:30:00', updated_at: '2026-02-14T10:00:00' },
    ];

    for (const o of seedOrders) {
        db.run(`INSERT INTO orders (id, user_id, total_amount, delivery_fee, status, payment_method, address, phone, customer_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [o.id, o.user_id, o.total_amount, o.delivery_fee, o.status, o.payment_method, o.address, o.phone, o.customer_name, o.created_at, o.updated_at]);
    }

    // Seed order items
    const seedItems = [
        { order_id: 'KUZ-001', product_id: 1, name: "Premium Slim Fit Ko'ylak", size: 'L', color: 'Oq', quantity: 1, price: 289000 },
        { order_id: 'KUZ-001', product_id: 4, name: "Sport Futbolka", size: 'M', color: 'Qora', quantity: 2, price: 129000 },
        { order_id: 'KUZ-002', product_id: 5, name: "Elegant Kechki Ko'ylak", size: 'M', color: 'Qizil', quantity: 1, price: 459000 },
        { order_id: 'KUZ-003', product_id: 9, name: "Bolalar Futbolka Set", size: '5-6Y', color: "Ko'k", quantity: 3, price: 89000 },
        { order_id: 'KUZ-003', product_id: 10, name: "Bolalar Jinsi Shim", size: '5-6Y', color: "Ko'k", quantity: 1, price: 159000 },
        { order_id: 'KUZ-004', product_id: 11, name: "Erkaklar Kostyum To'plami", size: 'L', color: "To'q ko'k", quantity: 1, price: 1890000 },
        { order_id: 'KUZ-005', product_id: 8, name: "Palto - Kuz/Qish", size: 'M', color: 'Bej', quantity: 1, price: 1290000 },
        { order_id: 'KUZ-005', product_id: 7, name: "Ipak Bluza", size: 'S', color: 'Oq', quantity: 1, price: 329000 },
    ];

    for (const item of seedItems) {
        db.run(`INSERT INTO order_items (order_id, product_id, name, size, color, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item.order_id, item.product_id, item.name, item.size, item.color, item.quantity, item.price]);
    }

    saveDb();
    console.log('✅ Database seeded successfully!');
    console.log('   Admin: +998901111111 / admin123');
    console.log('   Customer: +998901234567 / 123456');
}
