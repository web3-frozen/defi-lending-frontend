import { useState, useEffect, useCallback } from "react";
import type { Pool, ChainInfo, Filters } from "../types";
import { fetchPools, fetchChains } from "./api";

const DEFAULT_FILTERS: Filters = {
  chain: "",
  sortBy: "tvl",
  order: "desc",
  minTvl: 0,
  limit: 50,
};

export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [chains, setChains] = useState<ChainInfo[]>([]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPools(filters);
      setPools(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pools");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  useEffect(() => {
    fetchChains()
      .then(setChains)
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

  return { pools, chains, filters, loading, error, updateFilters, toggleSort, refresh: loadPools };
}
