import { FilterBar, PoolTable } from "./components";
import { usePools } from "./hooks";

export default function App() {
  const { pools, chains, filters, loading, error, updateFilters, toggleSort, refresh } = usePools();

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 DeFi Lending Aggregator</h1>
        <p className="subtitle">
          Top lending protocols across Ethereum, Solana, Polygon, Avalanche, Sui &amp; Aptos
        </p>
      </header>

      <main>
        <FilterBar filters={filters} chains={chains} onFilterChange={updateFilters} />

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={refresh}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading pools…</div>
        ) : (
          <PoolTable
            pools={pools}
            sortBy={filters.sortBy}
            order={filters.order}
            onToggleSort={toggleSort}
          />
        )}
      </main>

      <footer>
        <p>Data sourced from <a href="https://defillama.com" target="_blank" rel="noreferrer">DeFiLlama</a>. Refreshed every 5 minutes.</p>
      </footer>
    </div>
  );
}
