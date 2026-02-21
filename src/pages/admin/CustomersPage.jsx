import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import './AdminPages.css';

const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getCustomers()
            .then(setCustomers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    if (loading) return <div className="admin-page"><p>Yuklanmoqda...</p></div>;

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page__topbar">
                <div>
                    <h1 className="admin-page__title">Mijozlar</h1>
                    <p className="admin-page__subtitle">{customers.length} ta mijoz</p>
                </div>
                <div className="admin-search">
                    <Search size={16} />
                    <input placeholder="Ism yoki telefon..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr><th>Mijoz</th><th>Telefon</th><th>Buyurtmalar</th><th>Jami xarid</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(customer => (
                            <tr key={customer.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: 'var(--color-primary-50)', color: 'var(--color-primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 600, fontSize: '14px',
                                        }}>
                                            {customer.name.charAt(0)}
                                        </div>
                                        <strong>{customer.name}</strong>
                                    </div>
                                </td>
                                <td>{customer.phone}</td>
                                <td><span className="badge badge-primary">{customer.orderCount} ta</span></td>
                                <td><strong>{formatPrice(customer.totalSpent)}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
