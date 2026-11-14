import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPools } from "../hooks/api";
import { usePools } from "../hooks/usePools";
import type { Pool, PoolsResponse } from "../types";

vi.mock("../hooks/api", () => ({
  fetchPools: vi.fn(),
  fetchChains: vi.fn().mockResolvedValue([]),
  fetchSymbols: vi.fn().mockResolvedValue([]),
}));

function pool(symbol: string): Pool {
  return {
    id: symbol,
    chain: "ethereum",
    project: "aave-v3",
    symbol,
    tvl: 1_000_000,
    apyBase: 1,
    apyReward: 0,
    apy: 1,
    apyBaseBorrow: 2,
    apyRewardBorrow: 0,
    apyBorrow: 2,
    ltv: 0.8,
    totalSupplyUsd: 1_000_000,
    totalBorrowUsd: 500_000,
    stablecoin: false,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("usePools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ignores an older response that arrives after a newer filter request", async () => {
    const initial = deferred<PoolsResponse>();
    const firstFilter = deferred<PoolsResponse>();
    const secondFilter = deferred<PoolsResponse>();

    vi.mocked(fetchPools)
      .mockReturnValueOnce(initial.promise)
      .mockReturnValueOnce(firstFilter.promise)
      .mockReturnValueOnce(secondFilter.promise);

    const { result } = renderHook(() => usePools());
    await waitFor(() => expect(fetchPools).toHaveBeenCalledTimes(1));

    await act(async () => {
      initial.resolve({ data: [], totalCount: 0 });
      await initial.promise;
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.updateFilters({ symbols: ["USDC"] });
    });
    await waitFor(() => expect(fetchPools).toHaveBeenCalledTimes(2));

    act(() => {
      result.current.updateFilters({ symbols: ["USDC", "ETH"] });
    });
    await waitFor(() => expect(fetchPools).toHaveBeenCalledTimes(3));

    await act(async () => {
      secondFilter.resolve({ data: [pool("USDC"), pool("ETH")], totalCount: 2 });
      await secondFilter.promise;
    });
    await waitFor(() =>
      expect(result.current.pools.map((item) => item.symbol)).toEqual(["USDC", "ETH"])
    );

    await act(async () => {
      firstFilter.resolve({ data: [pool("USDC")], totalCount: 1 });
      await firstFilter.promise;
    });
    expect(result.current.pools.map((item) => item.symbol)).toEqual(["USDC", "ETH"]);
  });
});
