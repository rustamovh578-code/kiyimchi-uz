import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
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

const paymentMethods = {
    cash: { label: 'Naqd pul', icon: '💵' },
    payme: { label: 'Payme', icon: '💳' },
    click: { label: 'Click', icon: '📱' },
    uzum: { label: 'Uzum', icon: '🏦' },
};

export default function OrdersManagePage() {
    const [orderList, setOrderList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getOrders()
            .then(setOrderList)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = orderList.filter(o => {
        const name = o.customerName || o.customer_name || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            setOrderList(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
            ));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="admin-page"><p>Yuklanmoqda...</p></div>;

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page__topbar">
                <div>
                    <h1 className="admin-page__title">Buyurtmalar</h1>
                    <p className="admin-page__subtitle">{orderList.length} ta buyurtma</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="admin-search">
                        <Search size={16} />
                        <input placeholder="Qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
                        <option value="">Barcha holatlar</option>
                        {Object.entries(orderStatuses).map(([key, val]) => (
                            <option key={key} value={key}>{val.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr><th>ID</th><th>Mijoz</th><th>Tovarlar</th><th>Summa</th><th>To'lov</th><th>Holat</th><th>Sana</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(order => {
                            const status = orderStatuses[order.status];
                            const pmKey = order.paymentMethod || order.payment_method;
                            const pm = paymentMethods[pmKey];
                            return (
                                <tr key={order.id}>
                                    <td><strong>{order.id}</strong></td>
                                    <td>
                                        <div>
                                            <strong>{order.customerName || order.customer_name}</strong>
                                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{order.phone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        {order.items.map((item, i) => (
                                            <div key={i} style={{ fontSize: '13px' }}>
                                                {item.name} <span style={{ color: 'var(--text-tertiary)' }}>×{item.quantity}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td><strong>{formatPrice(order.totalAmount || order.total_amount)}</strong></td>
                                    <td>
                                        <span style={{ fontSize: '13px' }}>{pm?.icon} {pm?.label}</span>
                                    </td>
                                    <td>
                                        <select
                                            className="admin-status-select"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                background: `var(--color-${status.color}-50, var(--bg-tertiary))`,
                                                color: `var(--color-${status.color}, var(--text-primary))`,
                                            }}
                                        >
                                            {Object.entries(orderStatuses).map(([key, val]) => (
                                                <option key={key} value={key}>{val.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ fontSize: '13px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                                        {new Date(order.createdAt || order.created_at).toLocaleDateString('uz-UZ')}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
