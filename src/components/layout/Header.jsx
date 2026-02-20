import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { categories } from '../../data/categories';
import './Header.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount } = useCart();
    const { isAuthenticated, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
                <div className="container">
                    <div className="header__inner">
                        {/* Logo */}
                        <Link to="/" className="header__logo">
                            <span className="header__logo-icon">👔</span>
                            <span className="header__logo-text">Kiyimchi<span className="header__logo-accent">.uz</span></span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="header__nav">
                            <Link to="/" className={`header__nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                                Bosh sahifa
                            </Link>
                            <div className="header__nav-dropdown">
                                <button className="header__nav-link header__nav-link--dropdown">
                                    Katalog <ChevronDown size={16} />
                                </button>
                                <div className="header__dropdown-menu">
                                    <Link to="/catalog" className="header__dropdown-item header__dropdown-all">
                                        Barcha tovarlar
                                    </Link>
                                    {categories.map(cat => (
                                        <Link key={cat.id} to={`/catalog?category=${cat.id}`} className="header__dropdown-item">
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>

                        {/* Actions */}
                        <div className="header__actions">
                            {/* Desktop Search */}
                            <form className="header__search-form" onSubmit={handleSearch}>
                                <Search size={18} className="header__search-icon" />
                                <input
                                    type="text"
                                    placeholder="Qidirish..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="header__search-input"
                                />
                            </form>

                            {/* Mobile Search Toggle */}
                            <button className="header__action-btn header__search-toggle" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                                <Search size={20} />
                            </button>

                            {/* Theme Toggle */}
                            <button className="header__action-btn" onClick={toggleTheme} title={theme === 'light' ? 'Qorong\'u rejim' : 'Yorug\' rejim'}>
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>

                            {/* Cart */}
                            <Link to="/cart" className="header__action-btn header__cart-btn">
                                <ShoppingBag size={20} />
                                {cartCount > 0 && <span className="header__cart-badge">{cartCount}</span>}
                            </Link>

                            {/* Profile */}
                            <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/profile') : '/login'} className="header__action-btn">
                                <User size={20} />
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button className="header__menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="header__mobile-search animate-fade-in-down">
                        <div className="container">
                            <form onSubmit={handleSearch} className="header__mobile-search-form">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Tovar nomi yoki artikuli..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button type="button" className="header__search-close" onClick={() => setIsSearchOpen(false)}>
                                    <X size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="mobile-menu-overlay animate-fade-in" onClick={() => setIsMenuOpen(false)}>
                    <nav className="mobile-menu animate-slide-right" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu__header">
                            <span className="header__logo-text">Kiyimchi<span className="header__logo-accent">.uz</span></span>
                            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="mobile-menu__links">
                            <Link to="/" className="mobile-menu__link">Bosh sahifa</Link>
                            <Link to="/catalog" className="mobile-menu__link">Barcha tovarlar</Link>
                            {categories.map(cat => (
                                <Link key={cat.id} to={`/catalog?category=${cat.id}`} className="mobile-menu__link mobile-menu__link--sub">
                                    {cat.name}
                                </Link>
                            ))}
                            <hr className="divider" />
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" className="mobile-menu__link">Shaxsiy kabinet</Link>
                                    {isAdmin && <Link to="/admin" className="mobile-menu__link">Admin Panel</Link>}
                                </>
                            ) : (
                                <Link to="/login" className="mobile-menu__link">Kirish</Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
