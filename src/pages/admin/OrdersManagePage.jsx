import { useState } from 'react';
import { Search } from 'lucide-react';
import orders, { orderStatuses, paymentMethods } from '../../data/orders';
import { formatPrice } from '../../data/products';
import './AdminPages.css';

export default function OrdersManagePage() {
    const [orderList, setOrderList] = useState(orders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filtered = orderList.filter(o => {
        const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (orderId, newStatus) => {
        setOrderList(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
        ));
    };

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
                        <input
                            placeholder="Qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                        <tr>
                            <th>ID</th>
                            <th>Mijoz</th>
                            <th>Tovarlar</th>
                            <th>Summa</th>
                            <th>To'lov</th>
                            <th>Holat</th>
                            <th>Sana</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(order => {
                            const status = orderStatuses[order.status];
                            const pm = paymentMethods[order.paymentMethod];
                            return (
                                <tr key={order.id}>
                                    <td><strong>{order.id}</strong></td>
                                    <td>
                                        <div>
                                            <strong>{order.customerName}</strong>
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
                                    <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                                    <td>
                                        <span style={{ fontSize: '13px' }}>{pm?.icon} {pm?.label}</span>
                                    </td>
                                    <td>
                                        <select
                                            className="admin-status-select"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                background: `var(--color-${status.color === 'primary' ? 'primary' : status.color === 'success' ? 'success' : status.color === 'warning' ? 'warning' : status.color === 'error' ? 'error' : 'info'}-50, var(--bg-tertiary))`,
                                                color: `var(--color-${status.color}, var(--text-primary))`,
                                            }}
                                        >
                                            {Object.entries(orderStatuses).map(([key, val]) => (
                                                <option key={key} value={key}>{val.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ fontSize: '13px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                                        {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
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
