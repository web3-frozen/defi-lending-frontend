import type { Pool, SortField, SortOrder } from "../types";

interface PoolTableProps {
  pools: Pool[];
  sortBy: SortField;
  order: SortOrder;
  onToggleSort: (field: SortField) => void;
}

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627eea",
  solana: "#9945ff",
  polygon: "#8247e5",
  avalanche: "#e84142",
  sui: "#4da2ff",
  aptos: "#2ed8a3",
};

function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

function SortIcon({ field, sortBy, order }: { field: SortField; sortBy: SortField; order: SortOrder }) {
  if (field !== sortBy) return <span className="sort-icon">⇅</span>;
  return <span className="sort-icon active">{order === "desc" ? "↓" : "↑"}</span>;
}

export function PoolTable({ pools, sortBy, order, onToggleSort }: PoolTableProps) {
  if (pools.length === 0) {
    return <p className="empty-state">No lending pools found matching your filters.</p>;
  }

  return (
    <div className="table-container">
      <table className="pool-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Protocol</th>
            <th>Asset</th>
            <th>Chain</th>
            <th className="sortable" onClick={() => onToggleSort("tvl")}>
              TVL <SortIcon field="tvl" sortBy={sortBy} order={order} />
            </th>
            <th className="sortable" onClick={() => onToggleSort("apy")}>
              Supply APY <SortIcon field="apy" sortBy={sortBy} order={order} />
            </th>
            <th className="sortable" onClick={() => onToggleSort("apyBorrow")}>
              Borrow APY <SortIcon field="apyBorrow" sortBy={sortBy} order={order} />
            </th>
            <th className="sortable" onClick={() => onToggleSort("ltv")}>
              LTV <SortIcon field="ltv" sortBy={sortBy} order={order} />
            </th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool, idx) => (
            <tr key={pool.id}>
              <td className="rank">{idx + 1}</td>
              <td className="project">{pool.project}</td>
              <td className="symbol">
                {pool.symbol}
                {pool.stablecoin && <span className="badge stable">Stable</span>}
              </td>
              <td>
                <span
                  className="chain-badge"
                  style={{ backgroundColor: CHAIN_COLORS[pool.chain] ?? "#666" }}
                >
                  {pool.chain}
                </span>
              </td>
              <td className="number">{formatUSD(pool.tvl)}</td>
              <td className="number apy-supply">{formatPct(pool.apy)}</td>
              <td className="number apy-borrow">{formatPct(pool.apyBorrow)}</td>
              <td className="number">{pool.ltv > 0 ? formatPct(pool.ltv * 100) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
