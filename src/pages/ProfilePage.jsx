import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import orders, { orderStatuses, paymentMethods } from '../data/orders';
import { formatPrice } from '../data/products';
import './ProfilePage.css';

export default function ProfilePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

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
                                            {new Date(order.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                                            {paymentMethods[order.paymentMethod]?.icon} {paymentMethods[order.paymentMethod]?.label}
                                        </span>
                                        <span className="order-card__total">{formatPrice(order.totalAmount + order.deliveryFee)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
