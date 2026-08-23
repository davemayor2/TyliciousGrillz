'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '@/types';

export interface CartItem {
  id: string;
  uniqueId: string; // to distinguish items with different customizations
  product: MenuItem;
  quantity: number;
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Spicy';
  selectedSides: string[];
  specialNotes: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: MenuItem, quantity: number, spiceLevel: CartItem['spiceLevel'], selectedSides: string[], specialNotes: string) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  fulfillment: 'Delivery' | 'Collection';
  setFulfillment: (f: 'Delivery' | 'Collection') => void;
  postcode: string;
  setPostcode: (code: string) => void;
  isDeliveryEligible: boolean | null;
  validatePostcode: (code: string) => boolean;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  checkoutStatus: 'idle' | 'processing' | 'success' | 'error';
  triggerCheckout: (paymentMethod: 'card' | 'apple-pay' | 'google-pay') => Promise<void>;
  resetCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<'Delivery' | 'Collection'>('Delivery');
  const [postcode, setPostcode] = useState('');
  const [isDeliveryEligible, setIsDeliveryEligible] = useState<boolean | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState<CartContextType['checkoutStatus']>('idle');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('tylicious_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  // Save cart to localStorage — accepts updater fn or array for flexibility
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('tylicious_cart', JSON.stringify(newCart));
  };

  const addToCart = (
    product: MenuItem,
    quantity: number,
    spiceLevel: CartItem['spiceLevel'],
    selectedSides: string[],
    specialNotes: string
  ) => {
    // Unique key: product + spice level + sides only.
    // specialNotes is intentionally excluded so re-orders with a slightly
    // different note still merge into the existing cart row rather than
    // creating a duplicate. Sides order is normalised via sort().
    const sidesKey = [...selectedSides].sort().join(',');
    const uniqueId = `${product.id}-${spiceLevel}-${sidesKey}`;

    // Use functional setState to always read the *latest* cart, preventing
    // stale-closure duplicates when the modal is closed and re-opened.
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.uniqueId === uniqueId);
      let updatedCart: CartItem[];
      if (existingIndex > -1) {
        updatedCart = prevCart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          {
            id: product.id,
            uniqueId,
            product,
            quantity,
            spiceLevel,
            selectedSides,
            specialNotes,
          },
        ];
      }
      localStorage.setItem('tylicious_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId: string) => {
    saveCart(cart.filter((item) => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(uniqueId);
      return;
    }
    saveCart(
      cart.map((item) => (item.uniqueId === uniqueId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const validatePostcode = (code: string) => {
    const cleaned = code.toUpperCase().replace(/\s+/g, '');
    
    // Regular expression matching London/Kent postcodes:
    // London: E, EC, N, NW, SE, SW, W, WC, BR, CR, DA, EN, HA, IG, KT, RM, SM, TW, UB, WD
    // Kent: ME, TN, CT, DA
    const pattern = /^(E|EC|N|NW|SE|SW|W|WC|BR|CR|DA|EN|HA|IG|KT|RM|SM|TW|UB|WD|ME|TN|CT)[0-9]/i;
    
    const isEligible = pattern.test(cleaned);
    setIsDeliveryEligible(isEligible);
    return isEligible;
  };

  const triggerCheckout = async (paymentMethod: 'card' | 'apple-pay' | 'google-pay') => {
    if (cart.length === 0) return;
    setCheckoutStatus('processing');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          fulfillment,
          postcode,
          scheduledDate,
          scheduledTime,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to initiate checkout.');
      }

      // Redirect customer to Stripe Checkout page
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutStatus('error');
    }
  };

  const resetCheckout = () => {
    setCheckoutStatus('idle');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        fulfillment,
        setFulfillment,
        postcode,
        setPostcode,
        isDeliveryEligible,
        validatePostcode,
        scheduledDate,
        setScheduledDate,
        scheduledTime,
        setScheduledTime,
        checkoutStatus,
        triggerCheckout,
        resetCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
