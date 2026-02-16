export interface Pool {
  id: string;
  chain: string;
  project: string;
  symbol: string;
  tvl: number;
  apyBase: number;
  apyReward: number;
  apy: number;
  apyBaseBorrow: number;
  apyRewardBorrow: number;
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

export interface ProtocolInfo {
  name: string;
  totalTvl: number;
}

export type SortField = "tvl" | "apy" | "apyBorrow" | "ltv";
export type SortOrder = "asc" | "desc";

export interface Filters {
  chain: string;
  sortBy: SortField;
  order: SortOrder;
  minTvl: number;
  limit: number;
}
