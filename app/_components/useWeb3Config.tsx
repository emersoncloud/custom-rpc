"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { mainnet } from "@wagmi/core/chains";
import { fallback, http } from "viem";
import type { Config } from "wagmi";
import { createConfig, WagmiProvider } from "wagmi";
import { web3Config } from "./baseWeb3Config";
import { useLocalStorage } from "./useLocalStorage";

const Web3Context = createContext<any>({});

export const useWeb3Config = () => {
  const { wagmiConfig, updateTransports, transports } =
    useContext<any>(Web3Context);

  return {
    wagmiConfig,
    transports,
    updateTransports,
  };
};

interface Web3ProvidersProps {
  children: React.ReactNode;
  initialState?: any;
}
const appName = "Demo App";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rabbyWallet],
    },
    {
      groupName: "Other",
      wallets: [
        trustWallet,
        argentWallet,
        ledgerWallet,
        injectedWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName,
    projectId: "2f61f2ec9b3b4dd0712345a1acdda1a7",
  },
);

const config = createConfig({
  connectors: [...connectors],
  multiInjectedProviderDiscovery: false,
  ...web3Config,
});

const DEFAULT_TRANSPORTS = {
  [mainnet.id]: [process.env.NEXT_PUBLIC_DEFAULT_ETHER_RPC],
};

console.log("DEFAULT_TRAPNSOERPT", DEFAULT_TRANSPORTS);

export function Web3Provider(props: Web3ProvidersProps) {
  const { children, initialState } = props;
  const [transports, setTransports] = useLocalStorage<any>(
    "custom.transports",
    DEFAULT_TRANSPORTS,
  );

  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);

  useEffect(() => {
    console.log("RUNING USER EFFECT");
    if (Object.keys(transports).length > 0) {
      console.log("object.keys", transports);
      setWagmiConfig(
        // @ts-expect-error: todo fix
        createConfig({
          connectors: [...connectors],
          multiInjectedProviderDiscovery: false,
          ...web3Config,
          transports: Object.fromEntries(
            Object.entries(transports).map(([chainId, urls]) => [
              chainId,
              fallback((urls || []).map((url) => http(url))),
            ]),
          ),
        }),
      );
    } else {
      setWagmiConfig(config);
    }
  }, [transports]);

  const updateTransports = (newTransports: any) => {
    setTransports(newTransports);
  };

  if (!wagmiConfig) {
    return null;
  }

  return (
    <Web3Context.Provider
      value={{
        wagmiConfig,
        transports,
        updateTransports,
      }}
    >
      <WagmiProvider initialState={initialState} config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </Web3Context.Provider>
  );
}
