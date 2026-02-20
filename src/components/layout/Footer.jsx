import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Send, Instagram } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    {/* Brand */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-icon">👔</span>
                            <span className="footer__logo-text">Kiyimchi<span className="footer__logo-accent">.uz</span></span>
                        </Link>
                        <p className="footer__description">
                            Sifatli kiyimlar — qulay narxlarda. O'zbekiston bo'ylab yetkazib berish xizmati.
                        </p>
                        <div className="footer__socials">
                            <a href="#" className="footer__social-link" title="Telegram">
                                <Send size={18} />
                            </a>
                            <a href="#" className="footer__social-link" title="Instagram">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__section">
                        <h4 className="footer__title">Tezkor havolalar</h4>
                        <ul className="footer__links">
                            <li><Link to="/catalog">Katalog</Link></li>
                            <li><Link to="/catalog?category=men">Erkaklar</Link></li>
                            <li><Link to="/catalog?category=women">Ayollar</Link></li>
                            <li><Link to="/catalog?category=kids">Bolalar</Link></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="footer__section">
                        <h4 className="footer__title">Yordam</h4>
                        <ul className="footer__links">
                            <li><a href="#">Yetkazib berish</a></li>
                            <li><a href="#">To'lov usullari</a></li>
                            <li><a href="#">Qaytarish siyosati</a></li>
                            <li><a href="#">Ko'p so'raladigan savollar</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer__section">
                        <h4 className="footer__title">Aloqa</h4>
                        <ul className="footer__contacts">
                            <li>
                                <Phone size={16} />
                                <a href="tel:+998901234567">+998 90 123 45 67</a>
                            </li>
                            <li>
                                <Mail size={16} />
                                <a href="mailto:info@kiyimchi.uz">info@kiyimchi.uz</a>
                            </li>
                            <li>
                                <MapPin size={16} />
                                <span>Toshkent sh., Chilonzor tumani</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© 2026 Kiyimchi.uz — Barcha huquqlar himoyalangan</p>
                    <div className="footer__payments">
                        <span className="footer__payment-badge">💳 Payme</span>
                        <span className="footer__payment-badge">📱 Click</span>
                        <span className="footer__payment-badge">🏦 Uzum</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
