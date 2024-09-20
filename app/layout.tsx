import "@rainbow-me/rainbowkit/styles.css";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "../styles/global.css";
import { baseConfig } from "./_components/baseWeb3Config";
import { Providers } from "./providers";

function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(
    baseConfig,
    headers().get("cookie"),
  );

  return (
    <html lang="en">
      <body>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;
