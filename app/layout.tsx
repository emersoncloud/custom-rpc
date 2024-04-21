import "../styles/global.css"
import "@rainbow-me/rainbowkit/styles.css"
import { Providers } from "./providers"
import { headers } from "next/headers"
import { cookieToInitialState } from "wagmi"
import { baseConfig } from "./_components/baseWeb3Config"

function RootLayout({ children }: { children: React.ReactNode }) {
    const initialState = cookieToInitialState(baseConfig, headers().get("cookie"))

    return (
        <html lang="en">
            <body>
                <Providers initialState={initialState}>{children}</Providers>
            </body>
        </html>
    )
}

export default RootLayout
