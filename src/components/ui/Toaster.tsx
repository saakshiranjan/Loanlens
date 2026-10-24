"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// Simple toast event system
type ToastListener = (toast: Toast) => void;
const listeners: ToastListener[] = [];

export function toast(t: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const toastItem: Toast = { duration: 5000, ...t, id };
  listeners.forEach((l) => l(toastItem));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((p) => p.id !== t.id));
      }, t.duration || 5000);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-teal-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const borders = {
    success: "border-l-teal-500",
    error: "border-l-red-500",
    info: "border-l-blue-500",
    warning: "border-l-amber-500",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 bg-white rounded-xl shadow-xl border border-slate-200 border-l-4 p-4 animate-fade-up",
            borders[t.type]
          )}
        >
          {icons[t.type]}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-900">{t.title}</p>
            {t.message && (
              <p className="text-xs text-slate-600 mt-0.5">{t.message}</p>
            )}
          </div>
          <button
            onClick={() => remove(t.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
