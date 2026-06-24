"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loadFares } from "../lib/pricing";

const rates: Record<string, number> = { KES: 1, GBP: 0.0058, USD: 0.0077, EUR: 0.0071 };
const symbols: Record<string, string> = { KES: "KES", GBP: "£", USD: "$", EUR: "€" };

interface CurrencyCtx {
  currency: string;
  setCurrency: (c: string) => void;
  format: (kes: number) => string;
  symbol: string;
}

const Ctx = createContext<CurrencyCtx>({ currency: "KES", setCurrency: () => {}, format: (n) => `KES ${n}`, symbol: "KES" });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState("KES");

  useEffect(() => {
    loadFares();
    const saved = localStorage.getItem("gmrides_currency");
    if (saved) setCurrencyState(saved);
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem("gmrides_currency", c);
  };

  const format = (kes: number) => {
    const converted = kes * (rates[currency] || 1);
    const sym = symbols[currency] || currency;
    return `${sym} ${converted % 1 === 0 ? converted.toLocaleString() : converted.toFixed(2)}`;
  };

  return <Ctx.Provider value={{ currency, setCurrency, format, symbol: symbols[currency] }}>{children}</Ctx.Provider>;
}

export const useCurrency = () => useContext(Ctx);
