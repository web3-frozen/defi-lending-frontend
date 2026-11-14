export interface Pool {
  id: string;
  chain: string;
  project: string;
  symbol: string;
  tvl: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  apyBaseBorrow: number | null;
  apyRewardBorrow: number | null;
  apyBorrow: number;
  ltv: number;
  totalSupplyUsd: number;
  totalBorrowUsd: number;
  stablecoin: boolean;
}

export interface PoolsResponse {
  data: Pool[];
  totalCount: number;
}

export interface ChainInfo {
  name: string;
  poolCount: number;
}

export interface SymbolInfo {
  symbol: string;
  poolCount: number;
}

export interface ProtocolInfo {
  name: string;
  totalTvl: number;
}

export type SortField = "tvl" | "apy" | "apyBorrow" | "ltv";
export type SortOrder = "asc" | "desc";
export type AssetClass = "" | "stable" | "other";

export interface Filters {
  chain: string;
  symbol: string;
  assetClass: AssetClass;
  sortBy: SortField;
  order: SortOrder;
  minTvl: number;
  limit: number;
}
