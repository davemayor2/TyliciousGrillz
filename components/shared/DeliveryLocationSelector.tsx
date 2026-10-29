'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Loader2, CheckCircle2, AlertTriangle, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AddressSuggestion } from '@/types/delivery';

export default function DeliveryLocationSelector() {
  const {
    customerDetails,
    setCustomerDetails,
    deliveryQuote,
    isCalculatingDelivery,
    deliveryError,
    calculateDeliveryQuote,
    setFulfillmentMethod,
  } = useCart();

  const [addressInput, setAddressInput] = useState(customerDetails.delivery_address || '');
  const [postcodeInput, setPostcodeInput] = useState(customerDetails.postcode || '');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const lastCalculatedRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external customer details if populated
  useEffect(() => {
    if (customerDetails.delivery_address && customerDetails.delivery_address !== addressInput) {
      setAddressInput(customerDetails.delivery_address);
    }
    if (customerDetails.postcode && customerDetails.postcode !== postcodeInput) {
      setPostcodeInput(customerDetails.postcode);
    }
  }, [customerDetails.delivery_address, customerDetails.postcode, addressInput, postcodeInput]);

  // Handle clicking outside suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced quote calculation
  const triggerQuoteCalculation = useCallback(
    async (addr: string, pc: string) => {
      const combined = `${addr.trim()} ${pc.trim()}`.trim();
      if (combined.length < 3) return;
      if (combined.toLowerCase() === lastCalculatedRef.current.toLowerCase()) {
        return; // Avoid unnecessary recalculation
      }

      lastCalculatedRef.current = combined;
      await calculateDeliveryQuote(addr, pc);
    },
    [calculateDeliveryQuote]
  );

  // Address input change handler with suggestions & debounced pricing quote
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressInput(value);
    setCustomerDetails({ delivery_address: value });

    // Fetch address autocomplete suggestions
    if (value.trim().length >= 3) {
      setIsSearchingSuggestions(true);
      fetch(`/api/delivery/autocomplete?q=${encodeURIComponent(value.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
            setSuggestions(data.suggestions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setIsSearchingSuggestions(false);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Debounce distance & fee calculation
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (value.trim().length >= 4) {
        triggerQuoteCalculation(value, postcodeInput);
      }
    }, 700);
  };

  // Postcode input change handler
  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPostcodeInput(value);
    setCustomerDetails({ postcode: value });

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (value.trim().length >= 3) {
        triggerQuoteCalculation(addressInput, value);
      }
    }, 600);
  };

  // User selects an autocomplete suggestion
  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    const selectedText = suggestion.description;
    setAddressInput(selectedText);
    const pc = suggestion.postcode || postcodeInput;
    if (suggestion.postcode) {
      setPostcodeInput(suggestion.postcode);
    }

    setCustomerDetails({
      delivery_address: selectedText,
      postcode: pc || undefined,
    });

    setShowSuggestions(false);
    setSuggestions([]);

    // Immediately trigger calculation for selected address
    triggerQuoteCalculation(selectedText, pc);
  };

  // Manual calculation trigger button
  const handleManualCalculate = () => {
    if (addressInput.trim() || postcodeInput.trim()) {
      triggerQuoteCalculation(addressInput, postcodeInput);
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="font-sans font-bold text-xs text-[#1A0500] uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#ED2C02]" />
          <span>Delivery Address</span>
        </label>
        <span className="text-[11px] font-sans text-[#777777]">
          From Gravesend (DA11)
        </span>
      </div>

      {/* Address Input & Suggestions Dropdown */}
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={addressInput}
            onChange={handleAddressChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Street address or postcode (e.g. 15 High Street, Dartford)"
            className="w-full bg-[#FFF5F3] border-2 border-[#1A0500] rounded-xl py-2.5 pl-9 pr-9 text-xs sm:text-sm font-sans text-[#1A0500] placeholder:text-[#888888] focus:outline-none focus:border-[#ED2C02] shadow-[2px_2px_0px_#1A0500] transition-colors"
          />
          <MapPin className="w-4 h-4 text-[#ED2C02] absolute left-3 pointer-events-none" />

          {isSearchingSuggestions || isCalculatingDelivery ? (
            <Loader2 className="w-4 h-4 text-[#ED2C02] animate-spin absolute right-3" />
          ) : addressInput.trim().length > 0 ? (
            <button
              type="button"
              onClick={handleManualCalculate}
              title="Calculate route fee"
              className="absolute right-2.5 p-1 text-[#777777] hover:text-[#ED2C02] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Autocomplete Suggestions Menu */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-2 border-[#1A0500] rounded-xl shadow-[4px_4px_0px_#1A0500] z-50 overflow-hidden divide-y divide-[#ED2C02]/10 max-h-52 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="w-full px-3.5 py-2.5 text-left text-xs font-sans hover:bg-[#FFF5F3] transition-colors flex items-start gap-2 cursor-pointer group"
              >
                <Navigation className="w-3.5 h-3.5 text-[#ED2C02] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A0500] truncate">{s.mainText}</p>
                  {s.secondaryText && (
                    <p className="text-[11px] text-[#777777] truncate">{s.secondaryText}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Postcode Quick Input & Check Button */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <input
            type="text"
            value={postcodeInput}
            onChange={handlePostcodeChange}
            placeholder="UK Postcode (e.g. DA1 1BY)"
            className="w-full bg-[#FFF5F3] border-2 border-[#1A0500] rounded-xl py-2 px-3 text-xs font-sans uppercase font-bold text-[#1A0500] placeholder:text-[#888888] placeholder:font-normal focus:outline-none focus:border-[#ED2C02] shadow-[2px_2px_0px_#1A0500]"
          />
        </div>
        <button
          type="button"
          onClick={handleManualCalculate}
          disabled={isCalculatingDelivery || (!addressInput.trim() && !postcodeInput.trim())}
          className="col-span-1 bg-[#1A0500] text-white hover:bg-[#ED2C02] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1 border-2 border-[#1A0500] shadow-[2px_2px_0px_#1A0500] active:translate-y-0.5 transition-all cursor-pointer"
        >
          {isCalculatingDelivery ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <span>Check Fee</span>
          )}
        </button>
      </div>

      {/* Dynamic Status / Feedback Display */}
      {isCalculatingDelivery ? (
        <div className="bg-[#FFF5F3] border border-[#ED2C02]/30 rounded-xl p-2.5 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 text-[#ED2C02] animate-spin shrink-0" />
          <span className="font-sans text-xs text-[#555555]">
            Checking delivery zone from our Gravesend kitchen...
          </span>
        </div>
      ) : deliveryQuote && deliveryQuote.isEligible ? (
        /* Eligible Delivery Breakdown */
        <div className="bg-[#F0FDF4] border-2 border-[#16A34A] rounded-xl p-2.5 flex flex-col gap-1.5 shadow-[2px_2px_0px_#16A34A]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans font-bold text-xs text-[#166534] flex items-center gap-1 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              <span className="truncate">{deliveryQuote.ruleName}</span>
            </span>
            <span className="font-sans font-extrabold text-xs text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#16A34A]/30 shrink-0">
              £{deliveryQuote.feeGBP.toFixed(2)} Delivery
            </span>
          </div>
          <p className="font-sans text-[11px] text-[#15803D] leading-tight">
            📍 {deliveryQuote.distanceMiles > 0 ? `${deliveryQuote.distanceMiles} miles route from Gravesend` : 'Delivery zone applied'}
          </p>
        </div>
      ) : deliveryQuote && !deliveryQuote.isEligible ? (
        /* Out of Radius Notice */
        <div className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-xl p-2.5 flex flex-col gap-1.5 shadow-[2px_2px_0px_#DC2626]">
          <div className="flex items-start gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-sans font-bold text-xs text-[#991B1B]">
                Outside Delivery Zones
              </p>
              <p className="font-sans text-[11px] text-[#B91C1C] mt-0.5 leading-snug">
                {deliveryQuote.message || 'Your postcode is outside our standard delivery zones across London, Kent & Essex.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFulfillmentMethod('Collection')}
            className="mt-1 w-full py-1.5 bg-[#DC2626] text-white hover:bg-[#b91c1c] text-[11px] font-sans font-bold rounded-lg border border-[#1A0500] shadow-[1px_1px_0px_#1A0500] transition-colors cursor-pointer"
          >
            Switch to Free Collection (Gravesend)
          </button>
        </div>
      ) : deliveryError ? (
        /* General Error (e.g. invalid street / unrecognized postcode) */
        <div className="bg-[#FFFBEB] border-2 border-[#D97706] rounded-xl p-2.5 flex items-start gap-2 shadow-[2px_2px_0px_#D97706]">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-[#92400E] leading-snug">
            {deliveryError}
          </p>
        </div>
      ) : (
        <p className="font-sans text-[11px] text-[#777777] italic text-center">
          Enter your delivery address above to compute the exact driving route fee.
        </p>
      )}
    </div>
  );
}
