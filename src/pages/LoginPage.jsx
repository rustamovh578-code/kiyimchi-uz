import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, register, loading } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegister) {
                await register(form.name, form.phone, form.password);
            } else {
                await login(form.phone, form.password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Xatolik yuz berdi');
        }
    };

    return (
        <div className="login-page page-enter">
            <div className="login-page__container">
                <div className="login-card animate-scale-in">
                    <div className="login-card__header">
                        <Link to="/" className="login-card__logo">
                            <span>👔</span>
                            <span>Kiyimchi<span className="login-card__logo-accent">.uz</span></span>
                        </Link>
                        <h2>{isRegister ? "Ro'yxatdan o'tish" : "Tizimga kirish"}</h2>
                        <p>{isRegister ? "Yangi hisob yarating" : "Hisobingizga kiring"}</p>
                    </div>

                    <form className="login-card__form" onSubmit={handleSubmit}>
                        {error && <div className="login-card__error" style={{ color: '#e74c3c', background: '#fdf0ef', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '8px' }}>{error}</div>}
                        {isRegister && (
                            <div className="input-group">
                                <label htmlFor="name">Ismingiz</label>
                                <input id="name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="Ismingizni kiriting" required />
                            </div>
                        )}
                        <div className="input-group">
                            <label htmlFor="phone">Telefon raqami</label>
                            <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+998 90 123 45 67" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Parol</label>
                            <div className="login-card__password-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Parolni kiriting"
                                    required
                                />
                                <button type="button" className="login-card__password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg login-card__submit">
                            {isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
                        </button>
                    </form>

                    <div className="login-card__footer">
                        <p>
                            {isRegister ? "Allaqachon hisobingiz bormi?" : "Hali ro'yxatdan o'tmaganmisiz?"}{' '}
                            <button className="login-card__switch" onClick={() => setIsRegister(!isRegister)}>
                                {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
                            </button>
                        </p>
                    </div>

                    <div className="login-card__hint">
                        <p>🔑 Admin panel uchun: <strong>+998901111111</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
