import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'kiyimchi_cart';

const getInitialCart = () => {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.findIndex(
                item => item.productId === action.payload.productId &&
                    item.size === action.payload.size &&
                    item.color === action.payload.color
            );
            if (existingIndex > -1) {
                const newState = [...state];
                newState[existingIndex] = {
                    ...newState[existingIndex],
                    quantity: newState[existingIndex].quantity + action.payload.quantity,
                };
                return newState;
            }
            return [...state, action.payload];
        }
        case 'REMOVE_ITEM':
            return state.filter((_, index) => index !== action.payload);
        case 'UPDATE_QUANTITY': {
            const newState = [...state];
            newState[action.payload.index] = {
                ...newState[action.payload.index],
                quantity: Math.max(1, action.payload.quantity),
            };
            return newState;
        }
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeFromCart = (index) => {
        dispatch({ type: 'REMOVE_ITEM', payload: index });
    };

    const updateQuantity = (index, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = cartTotal > 500000 ? 0 : 25000;

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            cartTotal,
            deliveryFee,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

export default CartContext;
