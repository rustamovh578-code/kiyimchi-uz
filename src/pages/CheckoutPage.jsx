import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import './CheckoutPage.css';

const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

const regions = [
    'Toshkent shahri', "Toshkent viloyati", 'Samarqand', 'Buxoro', 'Farg\'ona',
    'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Xorazm',
    'Navoiy', 'Jizzax', "Qoraqalpog'iston",
];

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, cartTotal, deliveryFee, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        region: '',
        district: '',
        address: '',
        paymentMethod: 'cash',
        comment: '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.region || !form.address) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring");
            return;
        }
        try {
            const fullAddress = `${form.region}, ${form.district ? form.district + ', ' : ''}${form.address}`;
            const result = await ordersAPI.create({
                items: cart.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: cartTotal,
                deliveryFee,
                paymentMethod: form.paymentMethod,
                address: fullAddress,
                phone: form.phone,
                customerName: form.name,
            });
            setOrderId(result.id || '');
            setOrderPlaced(true);
            clearCart();
        } catch (err) {
            alert(err.message || 'Buyurtma berishda xatolik yuz berdi');
        }
    };

    if (orderPlaced) {
        return (
            <div className="checkout-success page-enter">
                <div className="container">
                    <div className="checkout-success__content">
                        <div className="checkout-success__icon">
                            <Check size={48} />
                        </div>
                        <h2>Buyurtma qabul qilindi! ✅</h2>
                        <p>Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada siz bilan bog'lanamiz.</p>
                        <p className="checkout-success__order-id">Buyurtma raqami: {orderId}</p>
                        <div className="checkout-success__actions">
                            <Link to="/" className="btn btn-primary">Bosh sahifaga</Link>
                            <Link to="/catalog" className="btn btn-secondary">Xaridni davom ettirish</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout page-enter">
            <div className="container">
                <h1 className="checkout__title">Buyurtma berish</h1>

                <form className="checkout__layout" onSubmit={handleSubmit}>
                    {/* Form */}
                    <div className="checkout__form">
                        {/* Contact */}
                        <div className="checkout__section">
                            <h3 className="checkout__section-title">📋 Shaxsiy ma'lumotlar</h3>
                            <div className="checkout__fields">
                                <div className="input-group">
                                    <label htmlFor="name">Ism-familiya *</label>
                                    <input id="name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="Ismingizni kiriting" required />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="phone">Telefon raqami *</label>
                                    <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+998 90 123 45 67" required />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="checkout__section">
                            <h3 className="checkout__section-title"><MapPin size={18} /> Yetkazib berish manzili</h3>
                            <div className="checkout__fields">
                                <div className="input-group">
                                    <label htmlFor="region">Viloyat *</label>
                                    <select id="region" name="region" className="select" value={form.region} onChange={handleChange} required>
                                        <option value="">Viloyatni tanlang</option>
                                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="district">Tuman</label>
                                    <input id="district" name="district" className="input" value={form.district} onChange={handleChange} placeholder="Tumanni kiriting" />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="address">Aniq manzil *</label>
                                    <input id="address" name="address" className="input" value={form.address} onChange={handleChange} placeholder="Ko'cha, uy, xonadon" required />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="checkout__section">
                            <h3 className="checkout__section-title"><CreditCard size={18} /> To'lov usuli</h3>
                            <div className="checkout__payments">
                                {[
                                    { value: 'cash', label: 'Naqd pul', icon: '💵', desc: 'Yetkazib berilganda' },
                                    { value: 'payme', label: 'Payme', icon: '💳', desc: 'Onlayn to\'lov' },
                                    { value: 'click', label: 'Click', icon: '📱', desc: 'Onlayn to\'lov' },
                                    { value: 'uzum', label: 'Uzum', icon: '🏦', desc: 'Onlayn to\'lov' },
                                ].map(pm => (
                                    <label key={pm.value} className={`checkout__payment-card ${form.paymentMethod === pm.value ? 'checkout__payment-card--active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={pm.value}
                                            checked={form.paymentMethod === pm.value}
                                            onChange={handleChange}
                                        />
                                        <span className="checkout__payment-icon">{pm.icon}</span>
                                        <div>
                                            <span className="checkout__payment-label">{pm.label}</span>
                                            <span className="checkout__payment-desc">{pm.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="checkout__section">
                            <div className="input-group">
                                <label htmlFor="comment">Izoh (ixtiyoriy)</label>
                                <textarea id="comment" name="comment" className="input checkout__textarea" value={form.comment} onChange={handleChange} placeholder="Qo'shimcha izohlar..." rows={3} />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="checkout__summary">
                        <div className="checkout__summary-card">
                            <h3>Buyurtma tafsilotlari</h3>

                            <div className="checkout__items">
                                {cart.map((item, i) => (
                                    <div key={i} className="checkout__item">
                                        <img src={item.image} alt={item.name} className="checkout__item-img" />
                                        <div className="checkout__item-info">
                                            <span className="checkout__item-name">{item.name}</span>
                                            <span className="checkout__item-meta">{item.color}, {item.size} × {item.quantity}</span>
                                        </div>
                                        <span className="checkout__item-price">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="divider" />

                            <div className="checkout__totals">
                                <div className="checkout__total-row">
                                    <span>Tovarlar</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="checkout__total-row">
                                    <span>Yetkazib berish</span>
                                    <span>{deliveryFee === 0 ? 'Bepul ✅' : formatPrice(deliveryFee)}</span>
                                </div>
                                <hr className="divider" />
                                <div className="checkout__total-row checkout__total-row--final">
                                    <span>Jami</span>
                                    <span>{formatPrice(cartTotal + deliveryFee)}</span>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg checkout__submit">
                                Buyurtmani tasdiqlash
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
