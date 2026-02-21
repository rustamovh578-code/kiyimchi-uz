import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

export async function getDb() {
    if (db) return db;

    const dbPath = path.resolve(__dirname, process.env.DB_PATH || './kiyimchi.db');
    const SQL = await initSqlJs();

    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }

    // Enable WAL for better performance
    db.run('PRAGMA journal_mode=WAL');
    db.run('PRAGMA foreign_keys=ON');

    return db;
}

export function saveDb() {
    if (!db) return;
    const dbPath = path.resolve(__dirname, process.env.DB_PATH || './kiyimchi.db');
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
}

// Auto-save periodically
setInterval(saveDb, 30000);

// Save on exit
process.on('exit', saveDb);
process.on('SIGINT', () => { saveDb(); process.exit(); });
process.on('SIGTERM', () => { saveDb(); process.exit(); });
