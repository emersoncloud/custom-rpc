"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { UsePublicClientReturnType, useAccount, usePublicClient } from "wagmi";
import { useWeb3Config } from "./useWeb3Config";

function getActiveUrl(provider: UsePublicClientReturnType) {
  if (provider?.transport?.transports?.length) {
    return provider.transport.transports[0].value.url;
  } else {
    return provider?.transport?.url;
  }
}

export function CoreComponent() {
  const provider = usePublicClient();
  const { transports, updateTransports } = useWeb3Config();
  const { chain } = useAccount();
  const [newRpc, setNewRpc] = useState<string>("");
  const [showAddRpc, setShowAddRpc] = useState<boolean>(false);

  const chainId = chain?.id ?? "1";

  const handleAddRpc = () => {
    const updatedTransports = {
      ...transports,
      [chainId]: [newRpc, ...transports[chainId]],
    };
    updateTransports(updatedTransports);
    setNewRpc("");
    setShowAddRpc(false);
  };

  const handleRemoveRpc = (rpcUrl: string) => {
    const rpcExists = transports?.[chainId]?.includes(rpcUrl);

    if (!rpcExists) {
      setShowAddRpc(false);
    } else {
      const updatedTransports = {
        ...transports,
        [chainId]: transports[chainId].filter((url: string) => url !== rpcUrl),
      };
      updateTransports(updatedTransports);
    }
  };

  const activeUrl = getActiveUrl(provider);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-center",
        padding: 12,
      }}
    >
      <div style={{ margin: "auto" }}>
        <ConnectButton />
        <div>
          <div>
            <>
              <div>
                <h4>RPC Settings</h4>
              </div>

              <div>
                {showAddRpc ? (
                  <div>
                    <input
                      type="text"
                      placeholder={"Add a custom RPC URL"}
                      value={newRpc}
                      onChange={(e) => setNewRpc(e.target.value)}
                      className="flex-grow"
                    />
                    <div>
                      <button
                        name="add-rpc"
                        onClick={handleAddRpc}
                        disabled={!newRpc}
                      >
                        (add rpc)
                      </button>
                      <button onClick={() => setShowAddRpc(false)}>
                        (remove)
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full"
                    onClick={() => setShowAddRpc(true)}
                  >
                    Add Custom RPC
                  </button>
                )}

                {transports?.[chainId]
                  ?.slice(0, -1)
                  .map((rpcUrl: string, _index: number) => (
                    <div key={rpcUrl}>
                      <div>
                        <input type="text" value={rpcUrl} />
                        <button
                          name="remove-rpc-listed"
                          onClick={() => handleRemoveRpc(rpcUrl)}
                        >
                          (remove)
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label htmlFor="rpcUrl">Active RPC: {activeUrl}</label>
        </div>
      </div>
    </div>
  );
}
