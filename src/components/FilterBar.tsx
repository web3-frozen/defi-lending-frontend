import { useState } from "react";
import type { AssetClass, Filters, ChainInfo, SymbolInfo } from "../types";
import { chainLabel } from "../lib/format";

interface FilterBarProps {
  filters: Filters;
  chains: ChainInfo[];
  symbols: SymbolInfo[];
  onFilterChange: (updates: Partial<Filters>) => void;
}

const MIN_TVL_OPTIONS = [
  { label: "Any size", value: 0 },
  { label: "> $100K", value: 100_000 },
  { label: "> $1M", value: 1_000_000 },
  { label: "> $10M", value: 10_000_000 },
  { label: "> $100M", value: 100_000_000 },
];

export function FilterBar({ filters, chains, symbols, onFilterChange }: FilterBarProps) {
  const [symbolDraft, setSymbolDraft] = useState("");

  const addSymbols = (values: string[]) => {
    const next = [...filters.symbols];
    for (const value of values) {
      const trimmed = value.trim();
      if (!trimmed) continue;
      const canonical =
        symbols.find((item) => item.symbol.toLowerCase() === trimmed.toLowerCase())?.symbol ??
        trimmed.toUpperCase();
      if (!next.some((item) => item.toLowerCase() === canonical.toLowerCase())) {
        next.push(canonical);
      }
    }
    if (next.length !== filters.symbols.length) {
      onFilterChange({ symbols: next });
    }
    setSymbolDraft("");
  };

  const removeSymbol = (symbol: string) => {
    onFilterChange({ symbols: filters.symbols.filter((item) => item !== symbol) });
  };

  const filtersActive =
    filters.chain !== "" ||
    filters.symbols.length > 0 ||
    symbolDraft !== "" ||
    filters.assetClass !== "" ||
    filters.minTvl > 0;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="chain-select">Chain</label>
        <select
          id="chain-select"
          value={filters.chain}
          onChange={(e) => onFilterChange({ chain: e.target.value })}
        >
          <option value="">All chains</option>
          {chains.map((c) => (
            <option key={c.name} value={c.name}>
              {chainLabel(c.name)} ({c.poolCount})
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group filter-grow">
        <label htmlFor="asset-input">Assets</label>
        <div className="asset-picker">
          {filters.symbols.map((symbol) => (
            <span className="asset-chip" key={symbol}>
              {symbol}
              <button
                type="button"
                className="chip-remove"
                aria-label={`Remove ${symbol}`}
                onClick={() => removeSymbol(symbol)}
              >
                &times;
              </button>
            </span>
          ))}
          <input
            id="asset-input"
            name="asset"
            type="search"
            inputMode="search"
            autoComplete="off"
            spellCheck={false}
            placeholder={filters.symbols.length > 0 ? "Add asset" : "USDC, ETH..."}
            value={symbolDraft}
            list="asset-suggestions"
            onChange={(e) => setSymbolDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                if (!symbolDraft.trim()) return;
                e.preventDefault();
                addSymbols([symbolDraft]);
              } else if (
                e.key === "Backspace" &&
                symbolDraft === "" &&
                filters.symbols.length > 0
              ) {
                e.preventDefault();
                removeSymbol(filters.symbols[filters.symbols.length - 1]);
              }
            }}
          />
        </div>
        <datalist id="asset-suggestions">
          {symbols.map((item) => (
            <option key={item.symbol} value={item.symbol} />
          ))}
        </datalist>
      </div>

      <div className="filter-group">
        <label htmlFor="stablecoin-select">Stablecoins</label>
        <select
          id="stablecoin-select"
          value={filters.assetClass}
          onChange={(e) => onFilterChange({ assetClass: e.target.value as AssetClass })}
        >
          <option value="">Any</option>
          <option value="stable">Only stablecoins</option>
          <option value="other">Exclude stablecoins</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="tvl-select">Min TVL</label>
        <select
          id="tvl-select"
          value={filters.minTvl}
          onChange={(e) => onFilterChange({ minTvl: Number(e.target.value) })}
        >
          {MIN_TVL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="limit-select">Rows</label>
        <select
          id="limit-select"
          value={filters.limit}
          onChange={(e) => onFilterChange({ limit: Number(e.target.value) })}
        >
          {[25, 50, 100, 200].map((n) => (
            <option key={n} value={n}>
              {n} rows
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="text-button"
        disabled={!filtersActive}
        onClick={() => {
          setSymbolDraft("");
          onFilterChange({
            chain: "",
            symbols: [],
            assetClass: "",
            minTvl: 0,
          });
        }}
      >
        Clear filters
      </button>
    </div>
  );
}
