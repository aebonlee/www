import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CartContextType {
  cartItems: any[];
  cartTotal: number;
  cartCount: number;
  addItem: (product: any) => void;
  removeItem: (productId: any) => void;
  updateQuantity: (productId: any, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'dreamitbiz_cart';

const loadCart = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>(loadCart);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = useCallback((product: any) => {
    if (product.isSoldOut) return;
    setCartItems((prev: any[]) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: any) => {
    setCartItems((prev: any[]) => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: any, quantity: number) => {
    if (quantity < 1 || quantity > 99) return;
    setCartItems((prev: any[]) =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      cartCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
