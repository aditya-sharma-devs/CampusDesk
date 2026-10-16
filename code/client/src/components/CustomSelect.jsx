import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ label, options, value, onChange, icon: Icon, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find currently selected option object or string
  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );

  const selectedLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-xs font-bold flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
          isOpen
            ? 'border-thapar-500 ring-2 ring-thapar-500/20 bg-white dark:bg-darkcard shadow-md'
            : 'border-slate-200/80 dark:border-slate-800 hover:border-thapar-400 dark:hover:border-thapar-600 hover:bg-white dark:hover:bg-darkcard'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-thapar-500 shrink-0" />}
          <span className="text-slate-900 dark:text-white truncate">
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-thapar-500' : ''
          }`}
        />
      </div>

      {/* Popover Menu Options */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 py-1.5 px-1 bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
          {options.map((option, idx) => {
            const optVal = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            const isSelected = optVal === value;

            return (
              <div
                key={idx}
                onClick={() => handleSelect(optVal)}
                className={`flex items-center justify-between px-3 py-2.5 my-0.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-thapar-50 text-thapar-700 dark:bg-thapar-950/70 dark:text-thapar-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="truncate">{optLabel}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-thapar-600 dark:text-thapar-400 shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
