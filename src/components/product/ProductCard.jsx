import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { formatPrice, getDiscountPercent } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const discount = getDiscountPercent(product.oldPrice, product.price);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            productId: product.id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            size: product.sizes[0],
            color: product.colorNames[0],
            quantity: 1,
        });
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-card__image-wrapper">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                />
                <div className="product-card__overlay">
                    <button className="product-card__quick-add" onClick={handleQuickAdd} title="Savatchaga qo'shish">
                        <ShoppingBag size={18} />
                    </button>
                </div>
                <div className="product-card__badges">
                    {product.isNew && <span className="badge badge-primary">Yangi</span>}
                    {discount > 0 && <span className="badge badge-error">-{discount}%</span>}
                </div>
            </div>
            <div className="product-card__info">
                <h3 className="product-card__name">{product.name}</h3>
                <div className="product-card__colors">
                    {product.colors.slice(0, 4).map((color, i) => (
                        <span
                            key={i}
                            className="product-card__color-dot"
                            style={{ background: color }}
                            title={product.colorNames[i]}
                        />
                    ))}
                    {product.colors.length > 4 && (
                        <span className="product-card__color-more">+{product.colors.length - 4}</span>
                    )}
                </div>
                <div className="product-card__price-row">
                    <span className="product-card__price">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                        <span className="product-card__old-price">{formatPrice(product.oldPrice)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
