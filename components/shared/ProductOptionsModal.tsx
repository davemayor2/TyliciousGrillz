'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem, Product, ProductOption, OptionValue } from '@/types';
import { X, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '@/libs/supabase/client';

interface ProductOptionsModalProps {
  product: MenuItem;
  onClose: () => void;
}

// Default Fallback Options matching the Tylicious Grillz menu structure
const DEFAULT_FALLBACK_OPTIONS: ProductOption[] = [
  {
    id: 'opt_spice_level',
    name: 'Spice Level',
    min_selections: 1,
    max_selections: 1,
    option_values: [
      { id: 'val_mild', name: 'Mild', price_modifier: 0, is_default: false },
      { id: 'val_medium', name: 'Medium', price_modifier: 0, is_default: true },
      { id: 'val_hot', name: 'Hot', price_modifier: 0, is_default: false },
      { id: 'val_extra_spicy', name: 'Extra Spicy', price_modifier: 0, is_default: false },
    ],
  },
  {
    id: 'opt_extra_sides',
    name: 'Add an Extra Side',
    min_selections: 0,
    max_selections: 2,
    option_values: [
      { id: 'val_plantain_chips', name: 'Fried Plantain & Chips (Included)', price_modifier: 0, is_default: true },
      { id: 'val_vermicelli', name: 'Vermicelli Noodles', price_modifier: 8, is_default: false },
      { id: 'val_mac_cheese', name: 'Mac & Cheese', price_modifier: 7, is_default: false },
    ],
  },
];

export default function ProductOptionsModal({ product, onClose }: ProductOptionsModalProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Supabase Product Options Data
  const [productData, setProductData] = useState<Product | null>(null);
  const [optionsList, setOptionsList] = useState<ProductOption[]>(DEFAULT_FALLBACK_OPTIONS);

  // State object mapping option_id -> array of selected OptionValue objects
  const [selectedOptions, setSelectedOptions] = useState<Record<string, OptionValue[]>>({});

  // Helper to initialize default selections for options
  const initDefaultSelections = useCallback((options: ProductOption[]) => {
    const initial: Record<string, OptionValue[]> = {};
    options.forEach((opt) => {
      const vals = opt.option_values || [];
      if (opt.max_selections === 1) {
        // Single-select: pick the marked default or the first option
        const defaultVal = vals.find((v) => v.is_default) || vals[0];
        if (defaultVal) {
          initial[opt.id] = [defaultVal];
        }
      } else {
        // Multi-select: pick all marked defaults up to max_selections
        const defaultVals = vals.filter((v) => v.is_default);
        const max = opt.max_selections || 2;
        initial[opt.id] = defaultVals.slice(0, max);
      }
    });
    setSelectedOptions(initial);
  }, []);

  // Fetch product along with nested options and values from Supabase
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    let isSubscribed = true;

    async function fetchProductWithOptions() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_options(*, option_values(*))')
          .eq('id', product.id)
          .maybeSingle();

        if (!isSubscribed) return;

        if (!error && data && data.product_options && data.product_options.length > 0) {
          setProductData(data);
          setOptionsList(data.product_options);
          initDefaultSelections(data.product_options);
        } else {
          // Fallback to default schema-compliant options
          setOptionsList(DEFAULT_FALLBACK_OPTIONS);
          initDefaultSelections(DEFAULT_FALLBACK_OPTIONS);
        }
      } catch (err) {
        console.warn('Supabase product options query:', err);
        if (isSubscribed) {
          setOptionsList(DEFAULT_FALLBACK_OPTIONS);
          initDefaultSelections(DEFAULT_FALLBACK_OPTIONS);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    fetchProductWithOptions();

    return () => {
      isSubscribed = false;
      document.body.style.overflow = '';
    };
  }, [product.id, initDefaultSelections]);

  // Handle Option Value Toggle
  const handleOptionToggle = (option: ProductOption, value: OptionValue) => {
    const isSingleSelect = option.max_selections === 1;
    const currentSelections = selectedOptions[option.id] || [];
    const isAlreadySelected = currentSelections.some((v) => v.id === value.id || v.name === value.name);

    if (isSingleSelect) {
      // Single-select radio button behavior
      setSelectedOptions((prev) => ({
        ...prev,
        [option.id]: [value],
      }));
    } else {
      // Multi-select toggle behavior with max_selections enforcement (e.g. max 2)
      const maxAllowed = option.max_selections || 2;

      if (isAlreadySelected) {
        setSelectedOptions((prev) => ({
          ...prev,
          [option.id]: currentSelections.filter((v) => v.id !== value.id && v.name !== value.name),
        }));
      } else {
        if (currentSelections.length >= maxAllowed) {
          // Replace oldest selection if max is reached or reject
          setSelectedOptions((prev) => ({
            ...prev,
            [option.id]: [...currentSelections.slice(1), value],
          }));
        } else {
          setSelectedOptions((prev) => ({
            ...prev,
            [option.id]: [...currentSelections, value],
          }));
        }
      }
    }
  };

  // Dynamic Price Calculation
  const calculatedTotal = useMemo(() => {
    const base = Number(productData?.price ?? product.price);

    // Sum price modifiers of all currently selected options
    const modifiersTotal = Object.values(selectedOptions).reduce((sum, values) => {
      const optSum = values.reduce((vSum, val) => {
        const mod = Number(val.price_modifier ?? val.price ?? 0);
        return vSum + mod;
      }, 0);
      return sum + optSum;
    }, 0);

    const unit = base + modifiersTotal;
    return Number((unit * quantity).toFixed(2));
  }, [productData, product.price, selectedOptions, quantity]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Add to Cart with formatted JSONB Order Item Payload
  const handleAdd = () => {
    // 1. Format options dictionary mapping option category name -> [{ name, price }]
    const formattedOptions: Record<string, { name: string; price: number }[]> = {};

    optionsList.forEach((opt) => {
      const selectedVals = selectedOptions[opt.id] || [];
      if (selectedVals.length > 0) {
        formattedOptions[opt.name] = selectedVals.map((v) => ({
          name: v.name,
          price: Number(v.price_modifier ?? v.price ?? 0),
        }));
      }
    });

    // 2. Extract legacy helper strings for drawer / backwards compatibility
    const spiceLevelVal = selectedOptions['opt_spice_level']?.[0]?.name || 'Medium';
    const sidesList = (selectedOptions['opt_extra_sides'] || []).map((s) => s.name);

    // 3. Dispatch to cart state with formatted JSONB structure & calculatedTotal
    addToCart(
      product,
      quantity,
      spiceLevelVal as MenuItem['category'],
      sidesList,
      specialNotes,
      calculatedTotal,
      formattedOptions
    );

    setShowSuccess(true);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-backdrop">
      <style>{`
        @keyframes modalBackdrop {
          from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); background-color: rgba(0, 0, 0, 0); }
          to { opacity: 1; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); background-color: rgba(0, 0, 0, 0.45); }
        }
        @keyframes modalPop {
          from { transform: scale(0.9) translateY(15px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-backdrop {
          animation: modalBackdrop 0.22s ease-out forwards;
        }
        .animate-pop {
          animation: modalPop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {showSuccess ? (
        /* Added to Basket Success Confirmation Popup Modal */
        <div className="relative w-full max-w-[460px] bg-white border border-[#E63900]/10 rounded-[28px] p-[36px_32px_32px_32px] flex flex-col items-center text-center z-10 shadow-[12px_12px_0px_#FFD8D8] animate-pop overflow-visible">

          {/* Top Animation SVG / Image */}
          <div id="top-animation-placeholder" className="w-24 h-24 mb-4 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/add to cart 2.gif" alt="Success Animation" className="w-full h-full object-contain" />
          </div>

          {/* Success Heading */}
          <div className="flex items-center gap-2 mb-2 justify-center">
            <span className="text-xl md:text-2xl">🛒</span>
            <h3 className="font-judson font-normal text-2xl md:text-[26px] text-black leading-tight">
              Added to your basket!
            </h3>
          </div>

          {/* Item Summary */}
          <p className="font-sans text-[14.5px] leading-relaxed text-[#666666] mb-1">
            {product.name} × {quantity}
          </p>

          {/* Price Display */}
          <div className="font-sans font-bold text-black text-2xl mb-7">
            £{calculatedTotal.toFixed(2)}
          </div>

          {/* Action Button Row */}
          <div className="flex items-center justify-center gap-3 w-full">
            {/* Continue Shopping Button */}
            <button
              onClick={onClose}
              className="w-1/2 py-3 bg-white border-[1.5px] border-[#E63900] text-[#E63900] font-sans font-bold text-[14px] md:text-[15px] rounded-full hover:bg-[#FFF5F5] transition-colors cursor-pointer select-none text-center"
            >
              Continue Shopping
            </button>

            {/* View Basket Button */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                onClose();
              }}
              className="w-1/2 flex items-center justify-between bg-[#E63900] hover:bg-[#ff440a] rounded-full py-2.5 pr-2.5 pl-5 transition-colors duration-200 cursor-pointer select-none text-center shadow-[0px_4px_12px_rgba(230,57,0,0.25)]"
            >
              <span className="text-white font-sans font-bold text-[14px] md:text-[15px]">
                View Basket
              </span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#E63900] font-bold shrink-0 text-sm">
                →
              </div>
            </button>
          </div>

        </div>
      ) : (
        /* Modal Container: 3D Stacked Card with pastel pink shadow backdrop */
        <div className="relative w-full max-w-[500px] max-h-[90vh] bg-white border border-[#E63900]/10 rounded-[28px] p-[28px_32px_28px_32px] flex flex-col z-10 shadow-[12px_12px_0px_#FFD8D8] text-left animate-pop overflow-visible">

          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-judson font-normal text-[28px] text-black leading-tight">
                {product.name}
              </h3>
              <span className="font-sans font-bold text-[#E63900] text-lg">
                £{product.price.toFixed(2)}
              </span>
            </div>

            {/* Close Button (Top-Right) */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#FFF5F5] hover:bg-[#FFE3E3] border-[1.5px] border-[#FF8A8A] flex items-center justify-center text-black transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="font-sans text-[13.5px] leading-relaxed text-[#666666] mb-5">
            {product.description || 'Freshly seasoned with Tylicious signature spices and flame-grilled to perfection. Served with Fried Plantain & Chips.'}
          </p>

          {/* Form Options Wrapper: scrolls internally on overflow */}
          <div className="flex-1 overflow-y-auto max-h-[45vh] pr-1 flex flex-col gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {isLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-brand-orange">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-sans text-sm font-semibold">Loading options...</span>
              </div>
            ) : (
              optionsList.map((option) => {
                const currentVals = selectedOptions[option.id] || [];

                return (
                  <div key={option.id} className="flex flex-col items-start w-full">
                    <div className="flex items-center justify-between w-full mb-2.5">
                      <span className="font-sans font-bold text-black text-base">
                        {option.name}
                        {option.min_selections && option.min_selections > 0 ? '*' : ''}
                      </span>
                      {option.max_selections && option.max_selections > 1 && (
                        <span className="font-sans text-xs text-[#888888]">
                          (Select up to {option.max_selections})
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2.5 w-full">
                      {(option.option_values || []).map((val) => {
                        const isSelected = currentVals.some((v) => v.id === val.id || v.name === val.name);
                        const modifier = Number(val.price_modifier ?? val.price ?? 0);
                        const priceLabel = modifier > 0 ? ` (+£${modifier.toFixed(0)})` : '';

                        return (
                          <button
                            key={val.id}
                            type="button"
                            onClick={() => handleOptionToggle(option, val)}
                            className={`px-4 py-2 rounded-full border-[1.5px] font-sans font-semibold text-xs md:text-sm text-center transition-all duration-150 cursor-pointer select-none ${
                              isSelected
                                ? 'bg-[#E63900] border-transparent text-white shadow-sm'
                                : 'bg-white border-[#E63900] text-[#2A0300] hover:bg-[#FFF5F5]'
                            }`}
                          >
                            {val.name}{priceLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            {/* Special Notes / Instructions */}
            <div className="flex flex-col items-start w-full">
              <label htmlFor="modal-notes" className="font-sans font-bold text-black text-base mb-2.5 select-none">
                Special Notes/Instructions
              </label>
              <textarea
                id="modal-notes"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="E.g. Extra spicy sauce, packaging instructions"
                className="w-full h-20 px-4 py-3 bg-white border-[1.5px] border-[#E63900] rounded-[16px] text-black font-sans text-sm placeholder:text-[#666666] focus:outline-none focus:border-[#E63900] transition-colors resize-none"
              />
            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between mt-6 gap-4 pt-4 border-t border-[#E63900]/10">

            {/* Quantity Counter (Left) */}
            <div className="flex items-center gap-3 bg-white border-[1.5px] border-[#E63900] rounded-full py-1.5 px-3.5 select-none">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 rounded-full bg-[#FFF5F5] border border-[#E63900] flex items-center justify-center text-[#E63900] hover:bg-[#FFD1D1] transition-colors cursor-pointer select-none font-bold text-xs"
              >
                -
              </button>
              <span className="w-6 text-center text-black font-sans font-bold text-base select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 rounded-full bg-[#FFF5F5] border border-[#E63900] flex items-center justify-center text-[#E63900] hover:bg-[#FFD1D1] transition-colors cursor-pointer select-none font-bold text-xs"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button (Right) with Dynamic Price */}
            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-between bg-[#E63900] hover:bg-[#ff440a] rounded-full py-2 pr-2 pl-6 transition-colors duration-200 cursor-pointer select-none shadow-[0px_4px_12px_rgba(230,57,0,0.25)]"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-white font-sans font-bold text-base leading-tight">
                  Add to Cart
                </span>
                <span className="text-white/80 font-sans text-xs">
                  £{calculatedTotal.toFixed(2)}
                </span>
              </div>

              {/* White Circular Badge with Right Arrow */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E63900] shrink-0 font-bold text-lg">
                →
              </div>
            </button>

          </div>

        </div>
      )}
    </div>,
    document.body
  );
}
