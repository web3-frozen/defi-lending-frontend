import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "../components/FilterBar";
import type { Filters, ChainInfo } from "../types";

const mockChains: ChainInfo[] = [
  { name: "ethereum", poolCount: 100 },
  { name: "solana", poolCount: 50 },
];

const defaultFilters: Filters = {
  chain: "",
  symbol: "",
  assetClass: "",
  sortBy: "tvl",
  order: "desc",
  minTvl: 0,
  limit: 50,
};

describe("FilterBar", () => {
  let onFilterChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFilterChange = vi.fn();
  });

  it("renders chain options", () => {
    render(<FilterBar filters={defaultFilters} chains={mockChains} symbols={[]} onFilterChange={onFilterChange} />);
    expect(screen.getByText("All chains")).toBeInTheDocument();
    expect(screen.getByText("Ethereum (100)")).toBeInTheDocument();
    expect(screen.getByText("Solana (50)")).toBeInTheDocument();
  });

  it("calls onFilterChange when chain is selected", async () => {
    render(<FilterBar filters={defaultFilters} chains={mockChains} symbols={[]} onFilterChange={onFilterChange} />);
    const select = screen.getByLabelText("Chain");
    await userEvent.selectOptions(select, "ethereum");
    expect(onFilterChange).toHaveBeenCalledWith({ chain: "ethereum" });
  });

  it("renders TVL options", () => {
    render(<FilterBar filters={defaultFilters} chains={mockChains} symbols={[]} onFilterChange={onFilterChange} />);
    expect(screen.getByText("Any size")).toBeInTheDocument();
    expect(screen.getByText("> $1M")).toBeInTheDocument();
  });

  it("filters to stablecoins", async () => {
    render(<FilterBar filters={defaultFilters} chains={mockChains} symbols={[]} onFilterChange={onFilterChange} />);
    await userEvent.selectOptions(screen.getByLabelText("Stablecoins"), "stable");
    expect(onFilterChange).toHaveBeenCalledWith({ assetClass: "stable" });
  });
});
