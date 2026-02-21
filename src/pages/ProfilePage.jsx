import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import './ProfilePage.css';

const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

const orderStatuses = {
    pending: { label: 'Kutilyapti', color: 'warning' },
    packing: { label: 'Qadoqlanmoqda', color: 'info' },
    shipping: { label: "Yo'lda", color: 'primary' },
    delivered: { label: 'Yetkazildi', color: 'success' },
    cancelled: { label: 'Bekor qilindi', color: 'error' },
};

const paymentMethods = {
    cash: { label: 'Naqd pul', icon: '💵' },
    payme: { label: 'Payme', icon: '💳' },
    click: { label: 'Click', icon: '📱' },
    uzum: { label: 'Uzum', icon: '🏦' },
};

export default function ProfilePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        ordersAPI.getMyOrders()
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile page-enter">
            <div className="container">
                <div className="profile__header">
                    <div className="profile__user">
                        <div className="profile__avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="profile__name">{user.name}</h1>
                            <p className="profile__phone">{user.phone}</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                        <LogOut size={16} /> Chiqish
                    </button>
                </div>

                <h2 className="profile__section-title">
                    <Package size={20} /> Buyurtmalar tarixi
                </h2>

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>Yuklanmoqda...</p>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Hali buyurtmalar yo'q</p>
                        <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1rem' }}>Xarid qilish</Link>
                    </div>
                ) : (
                    <div className="profile__orders">
                        {orders.map(order => {
                            const status = orderStatuses[order.status];
                            return (
                                <div key={order.id} className="order-card animate-fade-in-up">
                                    <div className="order-card__header">
                                        <div>
                                            <span className="order-card__id">#{order.id}</span>
                                            <span className="order-card__date">
                                                <Clock size={14} />
                                                {new Date(order.createdAt || order.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <span className={`badge badge-${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="order-card__items">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="order-card__item">
                                                <span className="order-card__item-name">{item.name}</span>
                                                <span className="order-card__item-meta">{item.color}, {item.size} × {item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-card__footer">
                                        <div className="order-card__address">
                                            <MapPin size={14} />
                                            <span>{order.address}</span>
                                        </div>
                                        <div className="order-card__bottom">
                                            <span className="order-card__payment">
                                                {paymentMethods[order.paymentMethod || order.payment_method]?.icon} {paymentMethods[order.paymentMethod || order.payment_method]?.label}
                                            </span>
                                            <span className="order-card__total">{formatPrice((order.totalAmount || order.total_amount) + (order.deliveryFee || order.delivery_fee || 0))}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
