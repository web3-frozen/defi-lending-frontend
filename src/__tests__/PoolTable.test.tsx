import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PoolTable } from "../components/PoolTable";
import type { Pool } from "../types";

const mockPools: Pool[] = [
  {
    id: "pool-1",
    chain: "ethereum",
    project: "aave-v3",
    symbol: "USDC",
    tvl: 2_000_000,
    apyBase: 3.5,
    apyReward: 0.5,
    apy: 4.0,
    apyBaseBorrow: 5.0,
    apyRewardBorrow: 0,
    apyBorrow: 5.0,
    ltv: 0.8,
    category: "lending",
    stablecoin: true,
  },
  {
    id: "pool-2",
    chain: "solana",
    project: "marginfi",
    symbol: "SOL",
    tvl: 500_000,
    apyBase: 6.0,
    apyReward: 1.0,
    apy: 7.0,
    apyBaseBorrow: 8.0,
    apyRewardBorrow: 0,
    apyBorrow: 8.0,
    ltv: 0.65,
    category: "lending",
    stablecoin: false,
  },
];

describe("PoolTable", () => {
  it("renders pool rows", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("aave-v3")).toBeInTheDocument();
    expect(screen.getByText("marginfi")).toBeInTheDocument();
  });

  it("shows stablecoin badge", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("Stable")).toBeInTheDocument();
  });

  it("shows empty state when no pools", () => {
    render(<PoolTable pools={[]} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText(/no lending pools found/i)).toBeInTheDocument();
  });

  it("formats TVL correctly", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("$2.00M")).toBeInTheDocument();
    expect(screen.getByText("$500.0K")).toBeInTheDocument();
  });

  it("displays chain badges", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("ethereum")).toBeInTheDocument();
    expect(screen.getByText("solana")).toBeInTheDocument();
  });
});
