import type { CreateConfigParameters } from "@wagmi/core"
import { createConfig, http } from "@wagmi/core"
import { mainnet } from "@wagmi/core/chains"
import { fallback, type Chain, type Transport } from "viem"
import { cookieStorage, createStorage } from "wagmi"

export const web3Config: CreateConfigParameters<readonly [Chain, ...Chain[]], Record<number, Transport>> = {
    chains: [mainnet],
    transports: {
        [mainnet.id]: fallback([http(process.env.NEXT_PUBLIC_DEFAULT_ETHER_RPC)]),
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
}

export const baseConfig = createConfig(web3Config)
