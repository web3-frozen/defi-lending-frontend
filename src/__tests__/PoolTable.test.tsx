import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PoolTable } from "../components/PoolTable";
import type { Filters, Pool } from "../types";

const mockPools: Pool[] = [
  {
    id: "pool-1",
    chain: "ethereum",
    project: "aave-v3",
    protocolName: "Aave V3",
    protocolUrl: "https://aave.com",
    protocolTwitter: "https://x.com/aave",
    protocolGithub: "https://github.com/aave",
    symbol: "USDC",
    tvl: 2_000_000,
    apyBase: 3.5,
    apyReward: 0.5,
    apy: 4.0,
    apyBaseBorrow: 5.0,
    apyRewardBorrow: 0,
    apyBorrow: 5.0,
    ltv: 0.8,
    totalSupplyUsd: 2_000_000,
    totalBorrowUsd: 1_200_000,
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
    apyRewardBorrow: 0.25,
    apyBorrow: 7.75,
    ltv: 0.65,
    totalSupplyUsd: 500_000,
    totalBorrowUsd: 200_000,
    stablecoin: false,
  },
];

describe("PoolTable", () => {
  it("renders pool rows", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("Aave V3")).toBeInTheDocument();
    expect(screen.getByText("marginfi")).toBeInTheDocument();
  });

  it("copies the filtered table as markdown for AI", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const filters: Filters = {
      chain: "ethereum",
      symbols: ["USDC"],
      assetClass: "",
      sortBy: "tvl",
      order: "desc",
      minTvl: 0,
      limit: 50,
    };

    render(
      <PoolTable
        pools={mockPools}
        sortBy="tvl"
        order="desc"
        onToggleSort={vi.fn()}
        filters={filters}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Copy table" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

    const markdown = writeText.mock.calls[0][0] as string;
    expect(markdown).toContain("| # | Protocol | Asset | Chain | TVL |");
    expect(markdown).toContain("[Aave V3](https://aave.com)");
    expect(markdown).toContain("assets=USDC");
    expect(markdown).toContain("| 1 |");
    expect(markdown).toContain("USDC");
    await screen.findByRole("button", { name: "Copied" });
  });

  it("links the protocol and its social profiles", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByRole("link", { name: "Aave V3" })).toHaveAttribute(
      "href",
      "https://aave.com"
    );
    expect(screen.getByRole("link", { name: "Aave V3 on X" })).toHaveAttribute(
      "href",
      "https://x.com/aave"
    );
    expect(screen.getByRole("link", { name: "Aave V3 on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/aave"
    );
  });

  it("shows the supply equation as base plus reward", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(
      screen.getByRole("cell", { name: "3.50% base plus 0.50% reward, total 4.00%" })
    ).toBeInTheDocument();
  });

  it("shows borrow as interest minus reward", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(
      screen.getByRole("cell", { name: "8.00% interest minus 0.25% reward, total 7.75%" })
    ).toBeInTheDocument();
  });

  it("shows stablecoin badge", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("Stable")).toBeInTheDocument();
  });

  it("shows empty state when no pools", () => {
    render(<PoolTable pools={[]} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText(/no lending pools are available/i)).toBeInTheDocument();
  });

  it("formats TVL correctly", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("$2.00M")).toBeInTheDocument();
    expect(screen.getByText("$500.0K")).toBeInTheDocument();
  });

  it("displays chain names", () => {
    render(<PoolTable pools={mockPools} sortBy="tvl" order="desc" onToggleSort={vi.fn()} />);
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("Solana")).toBeInTheDocument();
  });
});
