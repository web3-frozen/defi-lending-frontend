import type { Pool, SortField, SortOrder } from "../types";
import { chainLabel, formatPct, formatUSD } from "../lib/format";

interface PoolTableProps {
  pools: Pool[];
  sortBy: SortField;
  order: SortOrder;
  onToggleSort: (field: SortField) => void;
  onClearFilters?: () => void;
  canClear?: boolean;
}

function SortMark({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return null;
  return (
    <span className="sort-icon" aria-hidden="true">
      {order === "desc" ? "\u2193" : "\u2191"}
    </span>
  );
}

function SortHeader({
  field,
  label,
  hint,
  numeric,
  sortBy,
  order,
  onToggleSort,
}: {
  field: SortField;
  label: string;
  hint?: string;
  numeric?: boolean;
  sortBy: SortField;
  order: SortOrder;
  onToggleSort: (field: SortField) => void;
}) {
  const active = sortBy === field;
  return (
    <th aria-sort={active ? (order === "asc" ? "ascending" : "descending") : "none"} className={numeric ? "num" : undefined}>
      <button type="button" className={numeric ? "sort-button num" : "sort-button"} onClick={() => onToggleSort(field)}>
        <span className="sort-line">
          <span>{label}</span>
          <SortMark active={active} order={order} />
        </span>
        {hint && <span className="col-hint">{hint}</span>}
      </button>
    </th>
  );
}

function RateCell({
  base,
  reward,
  total,
  kind,
}: {
  base: number | null;
  reward: number | null;
  total: number;
  kind: "supply" | "borrow";
}) {
  const known = base != null || reward != null;
  if (!known) {
    const label = kind === "borrow" ? "Borrow rate not reported" : `${formatPct(total)}, breakdown not reported`;
    return (
      <td className="number rate" aria-label={label}>
        {kind === "borrow" ? (
          <span className="rate-missing">{"\u2014"}</span>
        ) : (
          <>
            <span className="rate-total">{formatPct(total)}</span>
            <span className="rate-note">Breakdown not reported</span>
          </>
        )}
      </td>
    );
  }

  const baseValue = base ?? 0;
  const rewardValue = reward ?? 0;
  const operator = kind === "supply" ? "+" : "\u2212";
  const paid = kind === "borrow" && total < -0.005;
  const label =
    kind === "supply"
      ? `${formatPct(baseValue)} base plus ${formatPct(rewardValue)} reward, total ${formatPct(total)}`
      : `${formatPct(baseValue)} interest minus ${formatPct(rewardValue)} reward, total ${formatPct(total)}${paid ? ", paid to borrow" : ""}`;

  return (
    <td className="number rate" aria-label={label}>
      <span className="rate-eq">
        <span>{formatPct(baseValue)}</span>
        <span className="rate-op" aria-hidden="true">{` ${operator} `}</span>
        <span>{formatPct(rewardValue)}</span>
        <span className="rate-op" aria-hidden="true"> = </span>
        <span className="rate-total">{formatPct(total)}</span>
      </span>
      {paid && <span className="rate-note">Paid to borrow</span>}
    </td>
  );
}

export function PoolTable({ pools, sortBy, order, onToggleSort, onClearFilters, canClear = false }: PoolTableProps) {
  if (pools.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>{canClear ? "No lending pools match these filters." : "No lending pools are available right now."}</p>
        {canClear && onClearFilters && (
          <button type="button" className="text-button" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="pool-table">
        <thead>
          <tr>
            <th className="rank">#</th>
            <th>Protocol</th>
            <th>Asset</th>
            <th>Chain</th>
            <SortHeader field="tvl" label="TVL" numeric sortBy={sortBy} order={order} onToggleSort={onToggleSort} />
            <SortHeader
              field="apy"
              label="Supply"
              hint="base + reward"
              numeric
              sortBy={sortBy}
              order={order}
              onToggleSort={onToggleSort}
            />
            <SortHeader
              field="apyBorrow"
              label="Borrow"
              hint={"interest \u2212 reward"}
              numeric
              sortBy={sortBy}
              order={order}
              onToggleSort={onToggleSort}
            />
            <SortHeader field="ltv" label="LTV" numeric sortBy={sortBy} order={order} onToggleSort={onToggleSort} />
          </tr>
        </thead>
        <tbody>
          {pools.map((pool, idx) => (
            <tr key={pool.id}>
              <td className="rank">{idx + 1}</td>
              <td className="project">{pool.project}</td>
              <td className="symbol">
                {pool.symbol}
                {pool.stablecoin && <span className="stable-mark">Stable</span>}
              </td>
              <td>{chainLabel(pool.chain)}</td>
              <td className="number">{formatUSD(pool.tvl)}</td>
              <RateCell base={pool.apyBase} reward={pool.apyReward} total={pool.apy} kind="supply" />
              <RateCell base={pool.apyBaseBorrow} reward={pool.apyRewardBorrow} total={pool.apyBorrow} kind="borrow" />
              <td className="number">{pool.ltv > 0 ? formatPct(pool.ltv * 100) : "\u2014"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
