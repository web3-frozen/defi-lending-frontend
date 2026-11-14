const CHAIN_LABELS: Record<string, string> = {
  ethereum: "Ethereum",
  solana: "Solana",
  base: "Base",
  arbitrum: "Arbitrum",
  "op mainnet": "OP Mainnet",
  monad: "Monad",
  bsc: "BSC",
  hyperliquid: "Hyperliquid",
  sui: "Sui",
  polygon: "Polygon",
  avalanche: "Avalanche",
  plasma: "Plasma",
  tron: "Tron",
  "robinhood chain": "Robinhood Chain",
  algorand: "Algorand",
  katana: "Katana",
  berachain: "Berachain",
  aptos: "Aptos",
  linea: "Linea",
  gnosis: "Gnosis",
  cronos: "Cronos",
  xlayer: "X Layer",
  flare: "Flare",
  ton: "TON",
  ink: "Ink",
  mantle: "Mantle",
  sonic: "Sonic",
  fraxtal: "Fraxtal",
  stacks: "Stacks",
  unichain: "Unichain",
  kava: "Kava",
  megaeth: "MegaETH",
  near: "NEAR",
  flow: "Flow",
  celo: "Celo",
  thorchain: "THORChain",
  stellar: "Stellar",
  "echelon initia": "Echelon Initia",
  sei: "Sei",
  icp: "ICP",
  rsk: "Rootstock",
  "cronos zkevm": "Cronos zkEVM",
  core: "Core",
  zigchain: "ZIGChain",
  bob: "BOB",
  "voi network": "Voi",
  scroll: "Scroll",
  alephium: "Alephium",
};

export function chainLabel(name: string): string {
  return (
    CHAIN_LABELS[name] ??
    name.replace(/(^|[\s-])(\w)/g, (_match, sep: string, ch: string) => sep + ch.toUpperCase())
  );
}

const MINUS = "\u2212";

export function formatPct(value: number): string {
  const sign = value < 0 ? MINUS : "";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

export function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}
