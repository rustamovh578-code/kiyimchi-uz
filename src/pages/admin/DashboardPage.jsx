import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from 'lucide-react';
import orders, { orderStatuses } from '../../data/orders';
import products, { formatPrice } from '../../data/products';
import './AdminPages.css';

export default function DashboardPage() {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount + o.deliveryFee, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'packing').length;
    const totalProducts = products.length;
    const totalCustomers = new Set(orders.map(o => o.userId)).size;

    return (
        <div className="admin-page animate-fade-in">
            <h1 className="admin-page__title">Dashboard</h1>
            <p className="admin-page__subtitle">Umumiy ko'rsatkichlar</p>

            {/* Stats */}
            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--success">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="stat-card__label">Umumiy tushum</p>
                        <p className="stat-card__value">{formatPrice(totalRevenue)}</p>
                        <p className="stat-card__change">↑ 12% o'sish</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--primary">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <p className="stat-card__label">Buyurtmalar</p>
                        <p className="stat-card__value">{orders.length}</p>
                        <p className="stat-card__change">{pendingOrders} ta kutilmoqda</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--warning">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="stat-card__label">Tovarlar</p>
                        <p className="stat-card__value">{totalProducts}</p>
                        <p className="stat-card__change">Faol mahsulotlar</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--accent">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="stat-card__label">Mijozlar</p>
                        <p className="stat-card__value">{totalCustomers}</p>
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
                            <tr>
                                <th>ID</th>
                                <th>Mijoz</th>
                                <th>Summa</th>
                                <th>Holat</th>
                                <th>Sana</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const status = orderStatuses[order.status];
                                return (
                                    <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>{order.customerName}</td>
                                        <td>{formatPrice(order.totalAmount)}</td>
                                        <td><span className={`badge badge-${status.color}`}>{status.label}</span></td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</td>
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
                            <tr>
                                <th>Tovar</th>
                                <th>Narx</th>
                                <th>Qoldiq</th>
                                <th>Reyting</th>
                            </tr>
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
