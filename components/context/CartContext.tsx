'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MenuItem } from '@/types';

export interface CartItemOptions {
  [category: string]: { name: string; price: number }[];
}

export interface CartItem {
  cart_item_id: string; // unique string for the cart to handle duplicate products with different options
  product_id: string | number; // matches Supabase products.id
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total: number; // quantity * (unit_price + option_modifiers)
  options: CartItemOptions; // JSONB format: exactly capturing selected Spice Level and Sides
  // Convenience references for UI
  product?: MenuItem;
  spiceLevel?: string;
  selectedSides?: string[];
  specialNotes?: string;
}

export interface CustomerDetails {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  delivery_address?: string;
  postcode?: string;
  scheduled_date?: string;
  scheduled_time?: string;
}

export interface CartContextType {
  // 1. State
  items: CartItem[];
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  fulfillmentMethod: 'Delivery' | 'Collection';
  customerDetails: CustomerDetails;
  isCheckingOut: boolean;
  checkoutStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage: string | null;

  // 2. Actions
  addItem: (item: {
    product_id: string | number;
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
    total?: number;
    options: CartItemOptions;
    product?: MenuItem;
    specialNotes?: string;
  }) => void;
  removeItem: (cart_item_id: string) => void;
  updateQuantity: (cart_item_id: string, newQuantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setFulfillmentMethod: (method: 'Delivery' | 'Collection') => void;
  setCustomerDetails: (details: Partial<CustomerDetails>) => void;
  handleCheckout: (overrides?: Partial<CustomerDetails>) => Promise<void>;
  resetCheckout: () => void;

  // 3. Backwards Compatibility Aliases
  cart: CartItem[];
  addToCart: (
    product: MenuItem,
    quantity: number,
    spiceLevel?: string,
    selectedSides?: string[],
    specialNotes?: string,
    calculatedTotal?: number,
    optionsPayload?: CartItemOptions
  ) => void;
  removeFromCart: (cart_item_id: string) => void;
  fulfillment: 'Delivery' | 'Collection';
  setFulfillment: (method: 'Delivery' | 'Collection') => void;
  postcode: string;
  setPostcode: (code: string) => void;
  isDeliveryEligible: boolean | null;
  validatePostcode: (code: string) => boolean;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  triggerCheckout: (paymentMethod?: 'card' | 'apple-pay' | 'google-pay') => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tylicious_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'Delivery' | 'Collection'>('Delivery');
  const [customerDetails, setCustomerDetailsState] = useState<CustomerDetails>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    postcode: '',
    scheduled_date: '',
    scheduled_time: '',
  });
  const [isDeliveryEligible, setIsDeliveryEligible] = useState<boolean | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<CartContextType['checkoutStatus']>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('tylicious_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize items to ensure full schema compliance
          const normalized = parsed
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
              const unitPrice = Number(item.unit_price ?? item.product?.price ?? 0);
              const qty = Math.max(1, Number(item.quantity) || 1);
              const options: CartItemOptions = item.options || {
                'Spice Level': [{ name: item.spiceLevel || 'Medium', price: 0 }],
                'Sides': (item.selectedSides || []).map((s: string) => ({ name: s, price: 0 })),
              };
              const optionModifierSum = Object.values(options).reduce((s, arr) => {
                return s + (Array.isArray(arr) ? arr.reduce((vS, val) => vS + Number(val?.price || 0), 0) : 0);
              }, 0);
              const itemTotal = Number(item.total ?? (qty * (unitPrice + optionModifierSum)).toFixed(2));
              const cart_item_id = item.cart_item_id || item.uniqueId || `${item.product_id || item.id}-${JSON.stringify(options)}`;

              return {
                cart_item_id,
                product_id: item.product_id || item.id || item.product?.id,
                product_name: item.product_name || item.product?.name || 'Item',
                product_image: item.product_image || item.product?.image,
                quantity: qty,
                unit_price: unitPrice,
                total: itemTotal,
                options,
                product: item.product,
                specialNotes: item.specialNotes,
              } as CartItem;
            });
          setItems(normalized);
        }
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    }
  }, []);

  // Calculate Subtotal & Total
  const cartSubtotal = useMemo(() => {
    return Number(
      items.reduce((sum, item) => sum + (item.total || item.unit_price * item.quantity), 0).toFixed(2)
    );
  }, [items]);

  const deliveryFee = useMemo(() => {
    return fulfillmentMethod === 'Delivery' ? 5.00 : 0.00;
  }, [fulfillmentMethod]);

  const cartTotal = useMemo(() => {
    return Number((cartSubtotal + deliveryFee).toFixed(2));
  }, [cartSubtotal, deliveryFee]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Add Item to Cart
  const addItem: CartContextType['addItem'] = useCallback((itemInput) => {
    // 1. Calculate Option Modifiers & Item Total
    const options = itemInput.options || {};
    const optionModifierSum = Object.values(options).reduce((s, arr) => {
      return s + (Array.isArray(arr) ? arr.reduce((vS, val) => vS + Number(val.price || 0), 0) : 0);
    }, 0);

    const unitPrice = Number(itemInput.unit_price || 0);
    const quantity = Math.max(1, Math.floor(Number(itemInput.quantity) || 1));
    const effectiveTotal = Number(
      itemInput.total ?? (quantity * (unitPrice + optionModifierSum)).toFixed(2)
    );

    // 2. Generate Deterministic Cart Item ID (product_id + sorted JSON of options)
    const optionsKey = JSON.stringify(options);
    const cart_item_id = `${itemInput.product_id}-${optionsKey}`;

    // 3. Update Cart State (increment quantity if exact duplicate exists)
    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex((i) => i.cart_item_id === cart_item_id);
      let updated: CartItem[];

      if (existingIdx > -1) {
        updated = prevItems.map((curr, idx) => {
          if (idx === existingIdx) {
            const newQty = curr.quantity + quantity;
            const newTotal = Number((newQty * (unitPrice + optionModifierSum)).toFixed(2));
            return {
              ...curr,
              quantity: newQty,
              total: newTotal,
            };
          }
          return curr;
        });
      } else {
        const newItem: CartItem = {
          cart_item_id,
          product_id: itemInput.product_id,
          product_name: itemInput.product_name,
          product_image: itemInput.product_image || itemInput.product?.image,
          quantity,
          unit_price: unitPrice,
          total: effectiveTotal,
          options,
          product: itemInput.product,
          specialNotes: itemInput.specialNotes,
        };
        updated = [...prevItems, newItem];
      }

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Storage error:', err);
      }
      return updated;
    });

    setIsCartOpen(true);
  }, []);

  // Remove Item
  const removeItem = useCallback((cart_item_id: string) => {
    setItems((prevItems) => {
      const updated = prevItems.filter((item) => item.cart_item_id !== cart_item_id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Storage error:', err);
      }
      return updated;
    });
  }, []);

  // Update Quantity (caps minimum at 1; removal only permitted via trash icon)
  const updateQuantity = useCallback((cart_item_id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    setItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.cart_item_id === cart_item_id) {
          const validQuantity = Math.max(1, Math.floor(newQuantity));
          const optionModifierSum = Object.values(item.options || {}).reduce((s, arr) => {
            return s + (Array.isArray(arr) ? arr.reduce((vS, val) => vS + Number(val.price || 0), 0) : 0);
          }, 0);
          const newTotal = Number((validQuantity * (item.unit_price + optionModifierSum)).toFixed(2));
          return {
            ...item,
            quantity: validQuantity,
            total: newTotal,
          };
        }
        return item;
      });

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Storage error:', err);
      }
      return updated;
    });
  }, []);

  // Clear Cart
  const clearCart = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('tylicious_cart');
    } catch (e) {
      console.error('Failed to clear cart storage:', e);
    }
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    setCheckoutStatus('idle');
  }, []);

  const setCustomerDetails = useCallback((details: Partial<CustomerDetails>) => {
    setCustomerDetailsState((prev) => ({ ...prev, ...details }));
  }, []);

  // Postcode Validator
  const validatePostcode = useCallback((code: string) => {
    const cleaned = code.toUpperCase().replace(/\s+/g, '');
    const pattern = /^(E|EC|N|NW|SE|SW|W|WC|BR|CR|DA|EN|HA|IG|KT|RM|SM|TW|UB|WD|ME|TN|CT)[0-9]/i;
    const isEligible = pattern.test(cleaned);
    setIsDeliveryEligible(isEligible);
    return isEligible;
  }, []);

  // Checkout Handler attached to "Proceed to Checkout"
  const handleCheckout = useCallback(async (overrides?: Partial<CustomerDetails>) => {
    if (items.length === 0) return;

    setCheckoutStatus('processing');
    setErrorMessage(null);

    const mergedCustomer = {
      ...customerDetails,
      ...overrides,
    };

    const checkoutPayload = {
      customer_details: {
        customer_name: mergedCustomer.customer_name || 'Guest Customer',
        customer_email: mergedCustomer.customer_email || undefined,
        customer_phone: mergedCustomer.customer_phone || undefined,
        delivery_address: mergedCustomer.delivery_address || (mergedCustomer.postcode ? `Postcode: ${mergedCustomer.postcode}` : undefined),
        postcode: mergedCustomer.postcode || undefined,
        scheduled_date: mergedCustomer.scheduled_date || undefined,
        scheduled_time: mergedCustomer.scheduled_time || undefined,
      },
      fulfillment_method: fulfillmentMethod,
      items: items.map((item) => ({
        cart_item_id: item.cart_item_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        options: item.options,
      })),
      subtotal: cartSubtotal,
      delivery_fee: deliveryFee,
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to initiate secure Stripe checkout.');
      }

      // Redirect user to Stripe Checkout URL
      window.location.href = data.url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during checkout.';
      console.error('Checkout Error:', msg);
      setErrorMessage(msg);
      setCheckoutStatus('error');
    }
  }, [items, customerDetails, fulfillmentMethod, cartSubtotal, deliveryFee]);

  const resetCheckout = useCallback(() => {
    setCheckoutStatus('idle');
    setErrorMessage(null);
  }, []);

  // Backwards Compatibility Bridge for addToCart
  const addToCart: CartContextType['addToCart'] = useCallback((
    product,
    quantity,
    spiceLevel = 'Medium',
    selectedSides = [],
    specialNotes = '',
    calculatedTotal,
    optionsPayload
  ) => {
    const formattedOptions: CartItemOptions = optionsPayload || {
      'Spice Level': [{ name: spiceLevel || 'Medium', price: 0 }],
      'Sides': selectedSides.map((s) => ({
        name: s,
        price: s.includes('+£8') ? 8 : s.includes('+£7') ? 7 : 0,
      })),
      ...(specialNotes ? { 'Special Notes': [{ name: specialNotes, price: 0 }] } : {}),
    };

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      quantity,
      unit_price: product.price,
      total: calculatedTotal,
      options: formattedOptions,
      product,
      specialNotes,
    });
  }, [addItem]);

  return (
    <CartContext.Provider
      value={{
        // State
        items,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        itemCount,
        isCartOpen,
        fulfillmentMethod,
        customerDetails,
        isCheckingOut: checkoutStatus === 'processing',
        checkoutStatus,
        errorMessage,

        // Actions
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        setIsCartOpen,
        setFulfillmentMethod,
        setCustomerDetails,
        handleCheckout,
        resetCheckout,

        // Backwards compatibility
        cart: items,
        addToCart,
        removeFromCart: removeItem,
        fulfillment: fulfillmentMethod,
        setFulfillment: setFulfillmentMethod,
        postcode: customerDetails.postcode || '',
        setPostcode: (code: string) => setCustomerDetails({ postcode: code }),
        isDeliveryEligible,
        validatePostcode,
        scheduledDate: customerDetails.scheduled_date || '',
        setScheduledDate: (date: string) => setCustomerDetails({ scheduled_date: date }),
        scheduledTime: customerDetails.scheduled_time || '',
        setScheduledTime: (time: string) => setCustomerDetails({ scheduled_time: time }),
        triggerCheckout: () => handleCheckout(),
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
