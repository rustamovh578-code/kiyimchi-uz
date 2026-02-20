import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import products, { formatPrice } from '../../data/products';
import { categories } from '../../data/categories';
import './AdminPages.css';

export default function ProductsManagePage() {
    const [productList, setProductList] = useState(products);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const filtered = productList.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm("O'chirishni tasdiqlaysizmi?")) {
            setProductList(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page__topbar">
                <div>
                    <h1 className="admin-page__title">Tovarlar</h1>
                    <p className="admin-page__subtitle">{productList.length} ta tovar</p>
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
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditProduct(null); setShowModal(true); }}>
                        <Plus size={16} /> Qo'shish
                    </button>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tovar</th>
                            <th>Kategoriya</th>
                            <th>Narx</th>
                            <th>Qoldiq</th>
                            <th>Holat</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="admin-product-cell">
                                        <img src={product.images[0]} alt="" />
                                        <div>
                                            <strong>{product.name}</strong>
                                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                                KUZ-{String(product.id).padStart(4, '0')}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-primary">
                                        {categories.find(c => c.id === product.category)?.name || product.category}
                                    </span>
                                </td>
                                <td>
                                    <strong>{formatPrice(product.price)}</strong>
                                    {product.oldPrice && (
                                        <div style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--text-tertiary)' }}>
                                            {formatPrice(product.oldPrice)}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <span className={`badge ${product.stock > 20 ? 'badge-success' : product.stock > 5 ? 'badge-warning' : 'badge-error'}`}>
                                        {product.stock} dona
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${product.isNew ? 'badge-primary' : 'badge-success'}`}>
                                        {product.isNew ? 'Yangi' : 'Faol'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(product)}>
                                            <Edit size={14} />
                                        </button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(product.id)} style={{ color: 'var(--color-error)' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h3>{editProduct ? "Tovarni tahrirlash" : "Yangi tovar qo'shish"}</h3>
                            <button onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal__body">
                            <div className="input-group">
                                <label>Tovar nomi</label>
                                <input className="input" defaultValue={editProduct?.name || ''} placeholder="Tovar nomini kiriting" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="input-group">
                                    <label>Narx (so'm)</label>
                                    <input className="input" type="number" defaultValue={editProduct?.price || ''} placeholder="0" />
                                </div>
                                <div className="input-group">
                                    <label>Eski narx (ixtiyoriy)</label>
                                    <input className="input" type="number" defaultValue={editProduct?.oldPrice || ''} placeholder="0" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Kategoriya</label>
                                <select className="select" defaultValue={editProduct?.category || ''}>
                                    <option value="">Tanlang</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Tavsif</label>
                                <textarea className="input" rows={3} defaultValue={editProduct?.description || ''} placeholder="Tovar haqida ma'lumot" style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="input-group">
                                    <label>Mato tarkibi</label>
                                    <input className="input" defaultValue={editProduct?.material || ''} placeholder="100% Paxta" />
                                </div>
                                <div className="input-group">
                                    <label>Qoldiq (dona)</label>
                                    <input className="input" type="number" defaultValue={editProduct?.stock || ''} placeholder="0" />
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal__footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
                            <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                                {editProduct ? 'Saqlash' : "Qo'shish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
