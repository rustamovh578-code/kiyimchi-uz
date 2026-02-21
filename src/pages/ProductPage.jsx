import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Star, Minus, Plus, Truck, RotateCcw, Shield } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import './ProductPage.css';

const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
const getDiscountPercent = (oldPrice, price) => oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        setLoading(true);
        setSelectedImage(0);
        setSelectedSize('');
        setSelectedColor(0);
        setQuantity(1);
        productsAPI.getById(id)
            .then(data => {
                setProduct(data);
                return productsAPI.getAll({ category: data.category });
            })
            .then(related => setRelatedProducts(related.filter(p => p.id !== Number(id)).slice(0, 4)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><p>Yuklanmoqda...</p></div>;
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Tovar topilmadi</h2>
                <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1rem' }}>Katalogga qaytish</Link>
            </div>
        );
    }

    const discount = getDiscountPercent(product.oldPrice || product.old_price, product.price);
    const colorNames = product.colorNames || product.color_names || [];

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Iltimos, o'lchamni tanlang");
            return;
        }
        addToCart({
            productId: product.id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            size: selectedSize,
            color: colorNames[selectedColor],
            quantity,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const nextImage = () => setSelectedImage(prev => (prev + 1) % product.images.length);
    const prevImage = () => setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length);

    return (
        <div className="product-page page-enter">
            <div className="container">
                {/* Breadcrumb */}
                <div className="catalog__breadcrumb">
                    <Link to="/">Bosh sahifa</Link>
                    <span>/</span>
                    <Link to="/catalog">Katalog</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                <div className="product-page__grid">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="product-gallery__main">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="product-gallery__image"
                            />
                            {product.images.length > 1 && (
                                <>
                                    <button className="product-gallery__nav product-gallery__nav--prev" onClick={prevImage}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="product-gallery__nav product-gallery__nav--next" onClick={nextImage}>
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                            {discount > 0 && (
                                <span className="badge badge-error product-gallery__badge">-{discount}%</span>
                            )}
                        </div>
                        <div className="product-gallery__thumbs">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    className={`product-gallery__thumb ${i === selectedImage ? 'product-gallery__thumb--active' : ''}`}
                                    onClick={() => setSelectedImage(i)}
                                >
                                    <img src={img} alt={`${product.name} ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        {product.isNew && <span className="badge badge-primary">Yangi</span>}
                        <h1 className="product-info__name">{product.name}</h1>

                        <div className="product-info__rating">
                            <Star size={16} fill="#FDCB6E" color="#FDCB6E" />
                            <span>{product.rating}</span>
                            <span className="product-info__stock">
                                {product.stock > 0 ? `✅ Mavjud (${product.stock} dona)` : '❌ Tugagan'}
                            </span>
                        </div>

                        <div className="product-info__price">
                            <span className="product-info__current-price">{formatPrice(product.price)}</span>
                            {product.oldPrice && (
                                <span className="product-info__old-price">{formatPrice(product.oldPrice)}</span>
                            )}
                        </div>

                        <p className="product-info__description">{product.description}</p>

                        {/* Color Selector */}
                        <div className="product-selector">
                            <h4 className="product-selector__title">Rang: <span>{colorNames[selectedColor]}</span></h4>
                            <div className="product-selector__colors">
                                {product.colors.map((color, i) => (
                                    <button
                                        key={i}
                                        className={`product-selector__color ${i === selectedColor ? 'product-selector__color--active' : ''}`}
                                        style={{ background: color }}
                                        onClick={() => setSelectedColor(i)}
                                        title={product.colorNames[i]}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="product-selector">
                            <h4 className="product-selector__title">O'lcham: <span>{selectedSize || 'Tanlang'}</span></h4>
                            <div className="product-selector__sizes">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`product-selector__size ${selectedSize === size ? 'product-selector__size--active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="product-quantity">
                            <h4 className="product-selector__title">Miqdor:</h4>
                            <div className="product-quantity__controls">
                                <button className="product-quantity__btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    <Minus size={16} />
                                </button>
                                <span className="product-quantity__value">{quantity}</span>
                                <button className="product-quantity__btn" onClick={() => setQuantity(quantity + 1)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="product-info__actions">
                            <button
                                className={`btn btn-lg product-info__add-btn ${addedToCart ? 'product-info__add-btn--added' : 'btn-primary'}`}
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                {addedToCart ? (
                                    <>✅ Qo'shildi!</>
                                ) : (
                                    <><ShoppingBag size={20} /> Savatchaga qo'shish</>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-info__features">
                            <div className="product-info__feature">
                                <Truck size={18} />
                                <span>Bepul yetkazib berish (500 000+)</span>
                            </div>
                            <div className="product-info__feature">
                                <RotateCcw size={18} />
                                <span>14 kunlik qaytarish</span>
                            </div>
                            <div className="product-info__feature">
                                <Shield size={18} />
                                <span>Sifat kafolati</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="product-details">
                            <h4>Tovar haqida</h4>
                            <table className="product-details__table">
                                <tbody>
                                    <tr><td>Mato tarkibi</td><td>{product.material}</td></tr>
                                    <tr><td>Mavsumi</td><td>{product.season}</td></tr>
                                    <tr><td>Artikul</td><td>KUZ-{String(product.id).padStart(4, '0')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="section">
                        <h2 className="section-title">O'xshash tovarlar</h2>
                        <div className="grid grid-4 stagger-children">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
