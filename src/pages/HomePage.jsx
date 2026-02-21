import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';
import './HomePage.css';

const banners = [
    {
        id: 1,
        title: "Qishki kolleksiya",
        subtitle: "50% gacha chegirma",
        description: "Eng issiq va zamonaviy qishki kiyimlar kolleksiyasi",
        cta: "Xarid qilish",
        link: "/catalog",
        gradient: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #FD79A8 100%)",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    },
    {
        id: 2,
        title: "Yangi kelganlar",
        subtitle: "2026 Bahor",
        description: "Eng so'nggi moda trendlari bilan tanishing",
        cta: "Ko'rish",
        link: "/catalog?sort=new",
        gradient: "linear-gradient(135deg, #00B894 0%, #55EFC4 50%, #74B9FF 100%)",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
    },
    {
        id: 3,
        title: "Bolalar kiyimlari",
        subtitle: "Maxsus aksiya",
        description: "Bolalaringiz uchun eng qulay va chiroyli kiyimlar",
        cta: "Tanlash",
        link: "/catalog?category=kids",
        gradient: "linear-gradient(135deg, #FD79A8 0%, #FDCB6E 50%, #FF6B6B 100%)",
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1200&q=80",
    },
];

const features = [
    { icon: Truck, title: "Bepul yetkazib berish", desc: "500 000 so'mdan ortiq xaridlarda" },
    { icon: Shield, title: "Xavfsiz to'lov", desc: "Payme, Click, Uzum" },
    { icon: RotateCcw, title: "14 kunlik qaytarish", desc: "Hech qanday savol yo'q" },
    { icon: Headphones, title: "24/7 Qo'llab-quvvatlash", desc: "Doimo aloqadamiz" },
];

export default function HomePage() {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [newProducts, setNewProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        productsAPI.getAll({ isNew: 'true' }).then(setNewProducts).catch(console.error);
        productsAPI.getAll({ isPopular: 'true', sort: 'rating' }).then(setPopularProducts).catch(console.error);
        categoriesAPI.getAll().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextBanner = () => setCurrentBanner(prev => (prev + 1) % banners.length);
    const prevBanner = () => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="home page-enter">
            {/* Hero Banner */}
            <section className="hero">
                <div className="hero__slider">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`hero__slide ${index === currentBanner ? 'hero__slide--active' : ''}`}
                            style={{ background: banner.gradient }}
                        >
                            <div className="hero__slide-bg" style={{ backgroundImage: `url(${banner.image})` }} />
                            <div className="container hero__content">
                                <div className="hero__text">
                                    <span className="hero__label animate-fade-in-up">{banner.subtitle}</span>
                                    <h1 className="hero__title animate-fade-in-up">{banner.title}</h1>
                                    <p className="hero__description animate-fade-in-up">{banner.description}</p>
                                    <Link to={banner.link} className="btn btn-primary btn-lg hero__cta animate-fade-in-up">
                                        {banner.cta} <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="hero__nav hero__nav--prev" onClick={prevBanner}>
                    <ChevronLeft size={24} />
                </button>
                <button className="hero__nav hero__nav--next" onClick={nextBanner}>
                    <ChevronRight size={24} />
                </button>
                <div className="hero__dots">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`hero__dot ${index === currentBanner ? 'hero__dot--active' : ''}`}
                            onClick={() => setCurrentBanner(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <div className="features__grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="feature-card__icon">
                                    <f.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="feature-card__title">{f.title}</h4>
                                    <p className="feature-card__desc">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Kategoriyalar</h2>
                            <p className="section-subtitle">Siz uchun eng yaxshi tanlov</p>
                        </div>
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat, i) => (
                            <Link
                                key={cat.id}
                                to={`/catalog?category=${cat.id}`}
                                className="category-card animate-fade-in-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <img src={cat.image} alt={cat.name} className="category-card__image" loading="lazy" />
                                <div className="category-card__overlay">
                                    <h3 className="category-card__name">{cat.name}</h3>
                                    <span className="category-card__count">{cat.subcategories.length} sub-kategoriya</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Products */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Yangi tovarlar</h2>
                            <p className="section-subtitle">Eng so'nggi qo'shilgan mahsulotlar</p>
                        </div>
                        <Link to="/catalog?sort=new" className="btn btn-outline btn-sm">
                            Barchasini ko'rish <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-4 stagger-children">
                        {newProducts.slice(0, 8).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section className="promo-banner">
                <div className="container">
                    <div className="promo-banner__content">
                        <h2 className="promo-banner__title">Telegram Bot orqali xarid qiling!</h2>
                        <p className="promo-banner__text">Telegram Mini App orqali qulay va tezkor xarid qilish imkoniyati</p>
                        <a href="#" className="btn btn-primary btn-lg">
                            <span>📱</span> Telegram Bot
                        </a>
                    </div>
                </div>
            </section>

            {/* Popular Products */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Ommabop tovarlar</h2>
                            <p className="section-subtitle">Eng ko'p sotilgan mahsulotlar</p>
                        </div>
                        <Link to="/catalog?sort=popular" className="btn btn-outline btn-sm">
                            Barchasini ko'rish <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-4 stagger-children">
                        {popularProducts.slice(0, 8).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
