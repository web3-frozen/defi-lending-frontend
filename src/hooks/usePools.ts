import { useState, useEffect, useCallback, useRef } from "react";
import type { Pool, ChainInfo, SymbolInfo, Filters } from "../types";
import { fetchPools, fetchChains, fetchSymbols } from "./api";

export const DEFAULT_FILTERS: Filters = {
  chain: "",
  symbols: [],
  assetClass: "",
  sortBy: "tvl",
  order: "desc",
  minTvl: 0,
  limit: 50,
};

export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [chains, setChains] = useState<ChainInfo[]>([]);
  const [symbols, setSymbols] = useState<SymbolInfo[]>([]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasData = useRef(false);

  const loadPools = useCallback(async () => {
    if (hasData.current) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetchPools(filters);
      setPools(res.data);
      hasData.current = true;
    } catch {
      setError("Unable to load rates. Check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  useEffect(() => {
    fetchChains()
      .then(setChains)
      .catch(() => {});
    fetchSymbols()
      .then(setSymbols)
      .catch(() => {});
  }, []);

  const updateFilters = useCallback((updates: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleSort = useCallback(
    (field: Filters["sortBy"]) => {
      if (filters.sortBy === field) {
        updateFilters({ order: filters.order === "desc" ? "asc" : "desc" });
      } else {
        updateFilters({ sortBy: field, order: "desc" });
      }
    },
    [filters.sortBy, filters.order, updateFilters]
  );

  return {
    pools,
    chains,
    symbols,
    filters,
    loading,
    refreshing,
    error,
    updateFilters,
    toggleSort,
    refresh: loadPools,
  };
}
