import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from 'lucide-react';
import { adminAPI } from '../../services/api';
import './AdminPages.css';

const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

const orderStatuses = {
    pending: { label: 'Kutilyapti', color: 'warning' },
    packing: { label: 'Qadoqlanmoqda', color: 'info' },
    shipping: { label: "Yo'lda", color: 'primary' },
    delivered: { label: 'Yetkazildi', color: 'success' },
    cancelled: { label: 'Bekor qilindi', color: 'error' },
};

export default function DashboardPage() {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, pendingOrders: 0 });
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            adminAPI.getStats(),
            adminAPI.getOrders(),
            adminAPI.getProducts(),
        ])
            .then(([s, o, p]) => { setStats(s); setOrders(o); setProducts(p); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="admin-page"><p>Yuklanmoqda...</p></div>;

    return (
        <div className="admin-page animate-fade-in">
            <h1 className="admin-page__title">Dashboard</h1>
            <p className="admin-page__subtitle">Umumiy ko'rsatkichlar</p>

            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--success"><DollarSign size={24} /></div>
                    <div>
                        <p className="stat-card__label">Umumiy tushum</p>
                        <p className="stat-card__value">{formatPrice(stats.totalRevenue)}</p>
                        <p className="stat-card__change">↑ 12% o'sish</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--primary"><ShoppingCart size={24} /></div>
                    <div>
                        <p className="stat-card__label">Buyurtmalar</p>
                        <p className="stat-card__value">{stats.totalOrders}</p>
                        <p className="stat-card__change">{stats.pendingOrders} ta kutilmoqda</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--warning"><Package size={24} /></div>
                    <div>
                        <p className="stat-card__label">Tovarlar</p>
                        <p className="stat-card__value">{stats.totalProducts}</p>
                        <p className="stat-card__change">Faol mahsulotlar</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--accent"><Users size={24} /></div>
                    <div>
                        <p className="stat-card__label">Mijozlar</p>
                        <p className="stat-card__value">{stats.totalCustomers}</p>
                        <p className="stat-card__change">Ro'yxatdan o'tgan</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-section">
                <h3 className="admin-section__title">So'nggi buyurtmalar</h3>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr><th>ID</th><th>Mijoz</th><th>Summa</th><th>Holat</th><th>Sana</th></tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map(order => {
                                const status = orderStatuses[order.status];
                                return (
                                    <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>{order.customerName || order.customer_name}</td>
                                        <td>{formatPrice(order.totalAmount || order.total_amount)}</td>
                                        <td><span className={`badge badge-${status.color}`}>{status.label}</span></td>
                                        <td>{new Date(order.createdAt || order.created_at).toLocaleDateString('uz-UZ')}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Products */}
            <div className="admin-section">
                <h3 className="admin-section__title">Eng ko'p sotilgan tovarlar</h3>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr><th>Tovar</th><th>Narx</th><th>Qoldiq</th><th>Reyting</th></tr>
                        </thead>
                        <tbody>
                            {products.filter(p => p.isPopular).slice(0, 5).map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={product.images[0]} alt="" style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                                            {product.name}
                                        </div>
                                    </td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>{product.stock} dona</td>
                                    <td>⭐ {product.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
