"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet
} from "@rainbow-me/rainbowkit/wallets";
import { avalanche, mainnet } from "@wagmi/core/chains";
import type { Config } from "wagmi";
import { createConfig, http, WagmiProvider } from "wagmi";
import { web3Config } from "./baseWeb3Config";

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
      wallets: [metaMaskWallet],
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
  [avalanche.id]: [process.env.NEXT_PUBLIC_DEFAULT_ETHER_RPC],
};

console.log("DEFAULT_TRAPNSOERPT", DEFAULT_TRANSPORTS);

export function Web3Provider(props: Web3ProvidersProps) {
  const { children, initialState } = props;
  // const [transports, setTransports] = useLocalStorage<any>(
  //   "custom.transports",
  //   DEFAULT_TRANSPORTS,
  // );
  const [transports, setTransports] = useState<any>([]);

  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);

  useEffect(() => {
    // local stroage is updated automaticallty with wagmi config
    // create the chain here with defineChain
    // use the chain
    // set the transport with http(ourRpcUrl)
    if (Object.keys(transports).length > 0) {
      console.log("transports is longer so doing something about it")
      setWagmiConfig(
        createConfig({
          connectors: [...connectors],
          multiInjectedProviderDiscovery: false,
          chains: [...web3Config.chains, avalanche],
          transports: {
    [mainnet.id]: http(), // eth.alchemhy
    [avalanche.id]: http(), // api.avax
    // doing this dynamically
          }
          // chains: [mainnet, avalanche],
          // transports: Object.fromEntries(
          //   Object.entries(transports).map(([chainId, urls]) => [
          //     chainId,
          //     fallback((urls || []).map((url) => {
          //       http(url)
          //     })),
          //   ]),
          // ),
        }),
      );
    } else {
      console.log("transports not long so not doing anything")
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
