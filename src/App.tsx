import { FilterBar, PoolTable } from "./components";
import { usePools, DEFAULT_FILTERS } from "./hooks/usePools";

export default function App() {
  const {
    pools,
    chains,
    symbols,
    filters,
    loading,
    refreshing,
    error,
    updateFilters,
    toggleSort,
    refresh,
  } = usePools();

  const canClear =
    filters.chain !== "" || filters.symbol !== "" || filters.assetClass !== "" || filters.minTvl > 0;

  return (
    <div className="app">
      <header className="masthead">
        <h1>DeFi lending aggregator</h1>
        <p className="subtitle">Compare supply and borrow across EVM and every other chain.</p>
      </header>

      <main>
        <FilterBar filters={filters} chains={chains} symbols={symbols} onFilterChange={updateFilters} />
        <p className="rate-legend">
          Totals include rewards. Supply adds them. Borrow subtracts them. Sorting uses the total.
        </p>
        {refreshing && (
          <p className="status" role="status">
            Updating rates
          </p>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button type="button" className="retry-button" onClick={refresh}>
              Retry
            </button>
          </div>
        )}

        {loading && pools.length === 0 ? (
          <div className="skeleton" role="status" aria-busy="true" aria-label="Loading rates">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        ) : (
          <PoolTable
            pools={pools}
            sortBy={filters.sortBy}
            order={filters.order}
            onToggleSort={toggleSort}
            canClear={canClear}
            onClearFilters={() =>
              updateFilters({
                chain: DEFAULT_FILTERS.chain,
                symbol: DEFAULT_FILTERS.symbol,
                assetClass: DEFAULT_FILTERS.assetClass,
                minTvl: DEFAULT_FILTERS.minTvl,
              })
            }
          />
        )}
      </main>

      <footer>
        <p>
          Rates from <a href="https://defillama.com/yields">DeFiLlama</a>. Refreshed every 5 minutes.
        </p>
      </footer>
    </div>
  );
}
