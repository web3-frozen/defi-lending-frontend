import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "../components/FilterBar";
import type { Filters, ChainInfo, SymbolInfo } from "../types";

const mockChains: ChainInfo[] = [
  { name: "ethereum", poolCount: 100 },
  { name: "solana", poolCount: 50 },
];

const mockSymbols: SymbolInfo[] = [
  { symbol: "USDC", poolCount: 20 },
  { symbol: "ETH", poolCount: 15 },
];

const defaultFilters: Filters = {
  chain: "",
  symbols: [],
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

  it("adds multiple assets as chips", async () => {
    const { rerender } = render(
      <FilterBar
        filters={defaultFilters}
        chains={mockChains}
        symbols={mockSymbols}
        onFilterChange={onFilterChange}
      />
    );

    await userEvent.type(screen.getByLabelText("Assets"), "USDC{Enter}");
    expect(onFilterChange).toHaveBeenCalledWith({ symbols: ["USDC"] });

    rerender(
      <FilterBar
        filters={{ ...defaultFilters, symbols: ["USDC"] }}
        chains={mockChains}
        symbols={mockSymbols}
        onFilterChange={onFilterChange}
      />
    );

    await userEvent.type(screen.getByLabelText("Assets"), "ETH{Enter}");
    expect(onFilterChange).toHaveBeenLastCalledWith({ symbols: ["USDC", "ETH"] });
  });

  it("removes a selected asset chip", async () => {
    render(
      <FilterBar
        filters={{ ...defaultFilters, symbols: ["USDC"] }}
        chains={mockChains}
        symbols={mockSymbols}
        onFilterChange={onFilterChange}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Remove USDC" }));
    expect(onFilterChange).toHaveBeenCalledWith({ symbols: [] });
  });

  it("adds the exact asset from the input button or blur", async () => {
    const { rerender } = render(
      <FilterBar
        filters={defaultFilters}
        chains={mockChains}
        symbols={mockSymbols}
        onFilterChange={onFilterChange}
      />
    );

    await userEvent.type(screen.getByLabelText("Assets"), "USDC");
    await userEvent.click(screen.getByRole("button", { name: "Add asset" }));
    expect(onFilterChange).toHaveBeenCalledWith({ symbols: ["USDC"] });

    rerender(
      <FilterBar
        filters={defaultFilters}
        chains={mockChains}
        symbols={mockSymbols}
        onFilterChange={onFilterChange}
      />
    );
    await userEvent.type(screen.getByLabelText("Assets"), "ETH");
    await userEvent.tab();
    expect(onFilterChange).toHaveBeenLastCalledWith({ symbols: ["ETH"] });
  });
});
