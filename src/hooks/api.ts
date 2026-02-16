import type { PoolsResponse, ChainInfo, Filters } from "../types";

const BASE_URL = "/api";

export async function fetchPools(filters: Filters): Promise<PoolsResponse> {
  const params = new URLSearchParams();
  if (filters.chain) params.set("chain", filters.chain);
  params.set("sort", filters.sortBy);
  params.set("order", filters.order);
  params.set("limit", String(filters.limit));
  if (filters.minTvl > 0) params.set("minTvl", String(filters.minTvl));

  const res = await fetch(`${BASE_URL}/pools?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchChains(): Promise<ChainInfo[]> {
  const res = await fetch(`${BASE_URL}/chains`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}
