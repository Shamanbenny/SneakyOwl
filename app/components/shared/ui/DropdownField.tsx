"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  options: DropdownOption[];
  value: string;
};

const DropdownField = ({
  ariaLabel,
  className = "",
  disabled = false,
  onChange,
  options,
  value,
}: DropdownFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`site-dropdown ${className}`}>
      <button
        type="button"
        className={`site-dropdown__trigger ${isOpen ? "site-dropdown__trigger--open" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedOption?.label ?? "Select an option"}</span>
        <FaChevronDown aria-hidden="true" />
      </button>
      {isOpen ? (
        <div
          id={listboxId}
          className="site-dropdown__menu"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`site-dropdown__option ${option.value === value ? "site-dropdown__option--selected" : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default DropdownField;
