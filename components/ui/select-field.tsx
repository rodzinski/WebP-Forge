"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectFieldOption<T extends string> = {
  value: T;
  label: string;
};

type SelectFieldProps<T extends string> = {
  label: string;
  options: readonly SelectFieldOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SelectField<T extends string>({ label, options, value, onChange }: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => option.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const listboxId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function closeWhenClickingOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeWhenClickingOutside);
    return () => document.removeEventListener("pointerdown", closeWhenClickingOutside);
  }, []);

  function selectAt(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setOpen(true);
      setActiveIndex((current) => (current + direction + options.length) % options.length);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      selectAt(activeIndex);
    }
  }

  return <div className="select-field" ref={rootRef}>
    <span className="select-field-label" id={labelId}>{label}</span>
    <button
      type="button"
      className="select-field-trigger"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-labelledby={`${labelId} ${listboxId}-value`}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={handleKeyDown}
    >
      <span id={`${listboxId}-value`}>{selected.label}</span>
      <ChevronDown className="size-4" aria-hidden="true" />
    </button>
    {open && <div className="select-field-menu" id={listboxId} role="listbox" aria-labelledby={labelId}>
      {options.map((option, index) => <button
        type="button"
        role="option"
        aria-selected={option.value === value}
        className={index === activeIndex ? "is-active" : undefined}
        key={option.value}
        onPointerEnter={() => setActiveIndex(index)}
        onClick={() => selectAt(index)}
      >
        <span>{option.label}</span>
        {option.value === value && <Check className="size-4" aria-hidden="true" />}
      </button>)}
    </div>}
  </div>;
}
