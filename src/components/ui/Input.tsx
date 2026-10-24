import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: string;
  rightAddon?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      leftIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          {leftAddon && (
            <span className="flex-shrink-0 px-3 py-3 bg-slate-100 text-slate-600 text-sm font-medium border border-r-0 border-slate-300 rounded-l-xl">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl transition-all duration-150 placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500",
              leftIcon && "pl-10",
              leftAddon && "rounded-l-none",
              rightAddon && "rounded-r-none",
              error
                ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
                : "border-slate-300 hover:border-slate-400",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightAddon && (
            <span className="flex-shrink-0 px-3 py-3 bg-slate-100 text-slate-600 text-sm font-medium border border-l-0 border-slate-300 rounded-r-xl">
              {rightAddon}
            </span>
          )}
        </div>
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-slate-500">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"
            role="alert"
          >
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl transition-all duration-150 appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500",
          error
            ? "border-red-400 focus:ring-red-400/30"
            : "border-slate-300 hover:border-slate-400",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium" role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
