import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const TelegramContext = createContext(null);

export function useTelegram() {
    return useContext(TelegramContext);
}

export function TelegramProvider({ children }) {
    const [webApp, setWebApp] = useState(null);
    const [user, setUser] = useState(null);
    const [isTelegram, setIsTelegram] = useState(false);
    const [colorScheme, setColorScheme] = useState('light');

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg && tg.initData) {
            // Telegram ichida ishlayapti
            tg.ready();
            tg.expand(); // To'liq ekranga ochish

            setWebApp(tg);
            setIsTelegram(true);
            setColorScheme(tg.colorScheme || 'light');
            document.body.classList.add('telegram-webapp');

            // Foydalanuvchi ma'lumotlari
            if (tg.initDataUnsafe?.user) {
                setUser({
                    id: tg.initDataUnsafe.user.id,
                    firstName: tg.initDataUnsafe.user.first_name,
                    lastName: tg.initDataUnsafe.user.last_name || '',
                    username: tg.initDataUnsafe.user.username || '',
                    languageCode: tg.initDataUnsafe.user.language_code || 'uz',
                });
            }

            // Tema o'zgarganda
            tg.onEvent('themeChanged', () => {
                setColorScheme(tg.colorScheme || 'light');
            });
        }
    }, []);

    // MainButton boshqarish
    const showMainButton = useCallback((text, onClick) => {
        if (!webApp) return;
        const btn = webApp.MainButton;
        btn.text = text;
        btn.show();
        btn.onClick(onClick);
        return () => {
            btn.offClick(onClick);
            btn.hide();
        };
    }, [webApp]);

    // BackButton boshqarish
    const showBackButton = useCallback((onClick) => {
        if (!webApp) return;
        webApp.BackButton.show();
        webApp.BackButton.onClick(onClick);
        return () => {
            webApp.BackButton.offClick(onClick);
            webApp.BackButton.hide();
        };
    }, [webApp]);

    // Haptic feedback
    const haptic = useCallback((type = 'impact', style = 'medium') => {
        if (!webApp?.HapticFeedback) return;
        if (type === 'impact') webApp.HapticFeedback.impactOccurred(style);
        else if (type === 'notification') webApp.HapticFeedback.notificationOccurred(style);
        else if (type === 'selection') webApp.HapticFeedback.selectionChanged();
    }, [webApp]);

    // Ma'lumot yuborish va yopish
    const close = useCallback((data) => {
        if (!webApp) return;
        if (data) webApp.sendData(JSON.stringify(data));
        webApp.close();
    }, [webApp]);

    const value = {
        webApp,
        user,
        isTelegram,
        colorScheme,
        showMainButton,
        showBackButton,
        haptic,
        close,
        initData: webApp?.initData || '',
        initDataUnsafe: webApp?.initDataUnsafe || {},
    };

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    );
}
