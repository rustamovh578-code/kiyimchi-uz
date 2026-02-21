import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../data/products';
import './CartPage.css';

export default function CartPage() {
    const { cart, cartTotal, deliveryFee, removeFromCart, updateQuantity, clearCart } = useCart();
    const { isTelegram, showMainButton, haptic } = useTelegram();
    const navigate = useNavigate();

    // Telegram MainButton
    useEffect(() => {
        if (!isTelegram || cart.length === 0) return;
        const total = formatPrice(cartTotal + deliveryFee);
        return showMainButton(`Buyurtma berish — ${total}`, () => {
            haptic('impact', 'medium');
            navigate('/checkout');
        });
    }, [isTelegram, cart, cartTotal, deliveryFee, showMainButton, haptic, navigate]);

    if (cart.length === 0) {
        return (
            <div className="cart-empty page-enter">
                <div className="container">
                    <div className="cart-empty__content">
                        <span className="cart-empty__icon">🛒</span>
                        <h2>Savatcha bo'sh</h2>
                        <p>Hozircha hech narsa qo'shilmagan. Katalogdan tovarlarni tanlang!</p>
                        <Link to="/catalog" className="btn btn-primary btn-lg">
                            <ShoppingBag size={20} /> Xarid qilish
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart page-enter">
            <div className="container">
                <h1 className="cart__title">Savatcha</h1>

                <div className="cart__layout">
                    {/* Cart Items */}
                    <div className="cart__items">
                        {cart.map((item, index) => (
                            <div key={index} className="cart-item animate-fade-in-up">
                                <img src={item.image} alt={item.name} className="cart-item__image" />
                                <div className="cart-item__info">
                                    <Link to={`/product/${item.productId}`} className="cart-item__name">
                                        {item.name}
                                    </Link>
                                    <div className="cart-item__meta">
                                        <span>Rang: {item.color}</span>
                                        <span>O'lcham: {item.size}</span>
                                    </div>
                                    <div className="cart-item__bottom">
                                        <div className="cart-item__quantity">
                                            <button
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="cart-item__qty-value">{item.quantity}</span>
                                            <button
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="cart-item__price">{formatPrice(item.price * item.quantity)}</span>
                                        <button className="cart-item__remove" onClick={() => removeFromCart(index)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                            <Trash2 size={16} /> Savatchani tozalash
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="cart-summary">
                        <div className="cart-summary__card">
                            <h3 className="cart-summary__title">Buyurtma xulosasi</h3>

                            <div className="cart-summary__rows">
                                <div className="cart-summary__row">
                                    <span>Tovarlar ({cart.reduce((s, i) => s + i.quantity, 0)} dona)</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Yetkazib berish</span>
                                    <span className={deliveryFee === 0 ? 'cart-summary__free' : ''}>
                                        {deliveryFee === 0 ? 'Bepul' : formatPrice(deliveryFee)}
                                    </span>
                                </div>
                                {deliveryFee > 0 && (
                                    <p className="cart-summary__hint">
                                        {formatPrice(500000 - cartTotal)} qo'shsangiz, yetkazib berish bepul!
                                    </p>
                                )}
                                <hr className="divider" />
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Jami</span>
                                    <span>{formatPrice(cartTotal + deliveryFee)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="btn btn-primary btn-lg cart-summary__checkout">
                                Buyurtma berish <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
