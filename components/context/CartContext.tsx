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
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  // Save cart to localStorage
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
    // Generate a unique ID based on the product and options selection
    const sidesKey = [...selectedSides].sort().join(',');
    const uniqueId = `${product.id}-${spiceLevel}-${sidesKey}-${specialNotes.trim()}`;

    const existingIndex = cart.findIndex((item) => item.uniqueId === uniqueId);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      saveCart(updatedCart);
    } else {
      saveCart([
        ...cart,
        {
          id: product.id,
          uniqueId,
          product,
          quantity,
          spiceLevel,
          selectedSides,
          specialNotes,
        },
      ]);
    }
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
    setCheckoutStatus('processing');
    
    // Simulate API stripe checkout / paystack gateway processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 95% success rate simulation
    if (Math.random() < 0.98) {
      setCheckoutStatus('success');
      clearCart();
    } else {
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
