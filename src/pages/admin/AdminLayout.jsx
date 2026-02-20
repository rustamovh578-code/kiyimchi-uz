import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, X, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Tovarlar' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Buyurtmalar' },
    { to: '/admin/customers', icon: Users, label: 'Mijozlar' },
];

export default function AdminLayout() {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin">
            {/* Sidebar */}
            <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
                <div className="admin__sidebar-header">
                    <span className="admin__sidebar-logo">👔 Admin</span>
                    <button className="admin__sidebar-close" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="admin__nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `admin__nav-link ${isActive ? 'admin__nav-link--active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin__sidebar-footer">
                    <NavLink to="/" className="admin__nav-link" onClick={() => setSidebarOpen(false)}>
                        <ChevronLeft size={18} />
                        <span>Do'konga qaytish</span>
                    </NavLink>
                    <button className="admin__nav-link admin__logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && <div className="admin__overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Main */}
            <div className="admin__main">
                <header className="admin__header">
                    <button className="admin__menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <h2 className="admin__header-title">Boshqaruv paneli</h2>
                    <div className="admin__header-user">
                        <span>{user?.name}</span>
                    </div>
                </header>

                <div className="admin__content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
