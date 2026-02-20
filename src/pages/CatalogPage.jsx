import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import products, { searchProducts, getProductsByCategory } from '../data/products';
import { categories } from '../data/categories';
import './CatalogPage.css';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const seasons = ['Barcha mavsumlar', 'Yoz', 'Qish', 'Bahor/Kuz', 'Kuz/Qish'];

export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const categoryFilter = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || '';
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 2500000]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery) {
            result = searchProducts(searchQuery);
        }

        if (categoryFilter) {
            result = result.filter(p => p.category === categoryFilter || p.subcategory === categoryFilter);
        }

        if (selectedSizes.length > 0) {
            result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
        }

        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'new':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'popular':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return result;
    }, [categoryFilter, searchQuery, sortBy, selectedSizes, priceRange]);

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setPriceRange([0, 2500000]);
        setSearchParams({});
    };

    const updateSort = (value) => {
        const params = Object.fromEntries(searchParams.entries());
        if (value) params.sort = value;
        else delete params.sort;
        setSearchParams(params);
    };

    const activeCategory = categories.find(c => c.id === categoryFilter);

    return (
        <div className="catalog page-enter">
            <div className="container">
                {/* Breadcrumb */}
                <div className="catalog__breadcrumb">
                    <Link to="/">Bosh sahifa</Link>
                    <span>/</span>
                    <span>{activeCategory ? activeCategory.name : 'Katalog'}</span>
                    {searchQuery && <span> — "{searchQuery}"</span>}
                </div>

                {/* Top Bar */}
                <div className="catalog__topbar">
                    <div className="catalog__info">
                        <h1 className="catalog__title">
                            {searchQuery ? `"${searchQuery}" bo'yicha natijalar` :
                                activeCategory ? activeCategory.name : 'Barcha tovarlar'}
                        </h1>
                        <span className="catalog__count">{filteredProducts.length} ta tovar</span>
                    </div>

                    <div className="catalog__controls">
                        <button
                            className="btn btn-secondary btn-sm catalog__filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={16} />
                            Filtrlar
                        </button>

                        <select className="select catalog__sort" value={sortBy} onChange={(e) => updateSort(e.target.value)}>
                            <option value="">Saralash</option>
                            <option value="price-asc">Narx: Arzon → Qimmat</option>
                            <option value="price-desc">Narx: Qimmat → Arzon</option>
                            <option value="new">Yangi</option>
                            <option value="popular">Ommabop</option>
                        </select>

                        <div className="catalog__view-modes">
                            <button
                                className={`catalog__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 size={18} />
                            </button>
                            <button
                                className={`catalog__view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="catalog__layout">
                    {/* Sidebar Filters */}
                    <aside className={`catalog__sidebar ${showFilters ? 'catalog__sidebar--open' : ''}`}>
                        <div className="catalog__sidebar-header">
                            <h3>Filtrlar</h3>
                            <button className="catalog__sidebar-close" onClick={() => setShowFilters(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="filter-group">
                            <h4 className="filter-group__title">Kategoriyalar</h4>
                            <div className="filter-group__items">
                                <button
                                    className={`filter-chip ${!categoryFilter ? 'filter-chip--active' : ''}`}
                                    onClick={() => setSearchParams({})}
                                >
                                    Barchasi
                                </button>
                                {categories.map(cat => (
                                    <div key={cat.id}>
                                        <button
                                            className={`filter-chip ${categoryFilter === cat.id ? 'filter-chip--active' : ''}`}
                                            onClick={() => setSearchParams({ category: cat.id })}
                                        >
                                            {cat.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div className="filter-group">
                            <h4 className="filter-group__title">O'lcham</h4>
                            <div className="filter-sizes">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-chip ${selectedSizes.includes(size) ? 'size-chip--active' : ''}`}
                                        onClick={() => toggleSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <h4 className="filter-group__title">Narx diapazoni</h4>
                            <div className="filter-price">
                                <input
                                    type="range"
                                    min="0"
                                    max="2500000"
                                    step="50000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="filter-price__range"
                                />
                                <div className="filter-price__labels">
                                    <span>0 so'm</span>
                                    <span>{new Intl.NumberFormat('uz-UZ').format(priceRange[1])} so'm</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                            Filtrlarni tozalash
                        </button>
                    </aside>

                    {/* Products Grid */}
                    <div className="catalog__products">
                        {filteredProducts.length > 0 ? (
                            <div className={`catalog__grid catalog__grid--${viewMode} stagger-children`}>
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="catalog__empty">
                                <p className="catalog__empty-icon">🔍</p>
                                <h3>Tovar topilmadi</h3>
                                <p>Boshqa filtrlarni sinab ko'ring</p>
                                <button className="btn btn-primary" onClick={clearFilters}>
                                    Filtrlarni tozalash
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
