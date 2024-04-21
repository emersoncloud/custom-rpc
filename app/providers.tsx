"use client"

import * as React from "react"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Web3Provider } from "./_components/useWeb3Config"
import { State } from "wagmi"

const queryClient = new QueryClient()

export function Providers({ children, initialState }: { children: React.ReactNode; initialState?: State | undefined }) {
    return (
        <Web3Provider initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </Web3Provider>
    )
}
