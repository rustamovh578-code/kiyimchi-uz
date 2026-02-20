import { useState } from 'react';
import { Search } from 'lucide-react';
import orders from '../../data/orders';
import { formatPrice } from '../../data/products';
import './AdminPages.css';

const customers = [
    { id: 1, name: 'Aziz Karimov', phone: '+998901234567', orders: 3, totalSpent: 1547000, lastOrder: '2026-02-15' },
    { id: 2, name: 'Nilufar Rahimova', phone: '+998931234567', orders: 1, totalSpent: 459000, lastOrder: '2026-02-17' },
    { id: 3, name: 'Dilnoza Usmonova', phone: '+998941234567', orders: 2, totalSpent: 826000, lastOrder: '2026-02-19' },
    { id: 4, name: 'Bobur Toshmatov', phone: '+998951234567', orders: 1, totalSpent: 1890000, lastOrder: '2026-02-19' },
    { id: 5, name: 'Gulnora Xasanova', phone: '+998971234567', orders: 4, totalSpent: 3219000, lastOrder: '2026-02-10' },
    { id: 6, name: 'Sardor Aliyev', phone: '+998901112233', orders: 2, totalSpent: 658000, lastOrder: '2026-02-08' },
    { id: 7, name: 'Madina Karimova', phone: '+998901113344', orders: 5, totalSpent: 4125000, lastOrder: '2026-02-18' },
    { id: 8, name: 'Jamshid Toshev', phone: '+998901114455', orders: 1, totalSpent: 289000, lastOrder: '2026-02-12' },
];

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page__topbar">
                <div>
                    <h1 className="admin-page__title">Mijozlar</h1>
                    <p className="admin-page__subtitle">{customers.length} ta mijoz</p>
                </div>
                <div className="admin-search">
                    <Search size={16} />
                    <input
                        placeholder="Ism yoki telefon..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mijoz</th>
                            <th>Telefon</th>
                            <th>Buyurtmalar</th>
                            <th>Jami xarid</th>
                            <th>Oxirgi buyurtma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(customer => (
                            <tr key={customer.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            background: 'var(--color-primary-50)',
                                            color: 'var(--color-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                        }}>
                                            {customer.name.charAt(0)}
                                        </div>
                                        <strong>{customer.name}</strong>
                                    </div>
                                </td>
                                <td>{customer.phone}</td>
                                <td>
                                    <span className="badge badge-primary">{customer.orders} ta</span>
                                </td>
                                <td><strong>{formatPrice(customer.totalSpent)}</strong></td>
                                <td style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                                    {new Date(customer.lastOrder).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
