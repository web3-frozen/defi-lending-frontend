export interface Pool {
  id: string;
  chain: string;
  project: string;
  protocolName?: string;
  protocolUrl?: string;
  protocolTwitter?: string;
  protocolGithub?: string;
  symbol: string;
  tvl: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  apyMean30d?: number | null;
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

export type SortField = "tvl" | "apy" | "apyMean30d" | "apyBorrow" | "ltv";
export type SortOrder = "asc" | "desc";
export type AssetClass = "" | "stable" | "other";

export interface Filters {
  chain: string;
  symbols: string[];
  assetClass: AssetClass;
  sortBy: SortField;
  order: SortOrder;
  minTvl: number;
  limit: number;
}
