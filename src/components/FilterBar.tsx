import type { Filters, ChainInfo } from "../types";

interface FilterBarProps {
  filters: Filters;
  chains: ChainInfo[];
  onFilterChange: (updates: Partial<Filters>) => void;
}

const CHAIN_LABELS: Record<string, string> = {
  ethereum: "Ethereum",
  solana: "Solana",
  polygon: "Polygon",
  avalanche: "Avalanche",
  sui: "Sui",
  aptos: "Aptos",
  bsc: "BSC",
  base: "Base",
  hyperliquid: "Hyperliquid",
  arbitrum: "Arbitrum",
};

const MIN_TVL_OPTIONS = [
  { label: "All", value: 0 },
  { label: "> $100K", value: 100_000 },
  { label: "> $1M", value: 1_000_000 },
  { label: "> $10M", value: 10_000_000 },
  { label: "> $100M", value: 100_000_000 },
];

export function FilterBar({ filters, chains, onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="chain-select">Chain</label>
        <select
          id="chain-select"
          value={filters.chain}
          onChange={(e) => onFilterChange({ chain: e.target.value })}
        >
          <option value="">All Chains</option>
          {chains.map((c) => (
            <option key={c.name} value={c.name}>
              {CHAIN_LABELS[c.name] ?? c.name} ({c.poolCount})
            </option>
          ))}
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
        <label htmlFor="limit-select">Show</label>
        <select
          id="limit-select"
          value={filters.limit}
          onChange={(e) => onFilterChange({ limit: Number(e.target.value) })}
        >
          {[25, 50, 100, 200].map((n) => (
            <option key={n} value={n}>
              {n} results
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
