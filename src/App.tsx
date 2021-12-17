import React, { useEffect, useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import {
	getPhantomWallet,
	getSlopeWallet,
	getSolflareWallet,
	getSolletWallet,
	getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";
import { getNftMetadata } from "./lib/nft-utils";

const unityContext = new UnityContext({
  loaderUrl: "Build/cg-build.loader.js",
  dataUrl: "Build/cg-build.data",
  frameworkUrl: "Build/cg-build.framework.js",
  codeUrl: "Build/cg-build.wasm",
  webglContextAttributes: {
    preserveDrawingBuffer: true,
  },
});

export const App = () => {
  
  const [displayWallets, setdisplayWallets] = useState(false);
  let userWallet: any;

  useEffect(function () {
    unityContext.on("ConnectWallet", async function () {
      setdisplayWallets(true);

      console.log(getNftMetadata("43oFFmtR4CWyEaReX3jVKAwm51AiyThshnGBQcsttXKa"));
    });
    
    unityContext.on("progress", function (progression) {
      const loadingPanel = document.getElementById("#unity-loading-bar");
      const progressBarFull = document.getElementById("#unity-progress-bar-full");
      
      if(loadingPanel !== null && progressBarFull !== null) {
        loadingPanel.style.display = "block";  
        progressBarFull.style.width = 100 * progression + "%";

        if(progression >= 1) {
          loadingPanel.style.display = "none";
        }
      } 
    });
    return function () {
      unityContext.removeEventListener("progress");
    };

  }, []);

  const connectWalletToBuild = async (wallet: any) => {
    if(wallet == null || wallet == undefined) {
      console.log("Wallet not found!");
      return;
    }

    const adapter = wallet.adapter();
    await adapter.connect();
    userWallet = adapter;

    if(userWallet.publicKey !== null) {
        unityContext.send("UserWallet", "ReceiveWalletInfo", userWallet.publicKey.toString());
        setdisplayWallets(false);
    }
  }

  return (
    <>
      { displayWallets ? 
        <div id="wallet-connector">
          <div id="wallet-adapters-holder">
            <div id="wallet-adapters-title">SELECT WALLET</div>
            <div id="wallet-adapters-list">
              <button className="wallet-adapters-list-button" onClick={() => connectWalletToBuild(getPhantomWallet())}>
                  Phantom
              </button>
              <button className="wallet-adapters-list-button" onClick={() => connectWalletToBuild(getSlopeWallet())}>
                  Slope
              </button>
          </div>
          </div>
        </div>
      : null }
      <Unity devicePixelRatio={1} unityContext={unityContext} className="unity-canvas" /> 
      <div id="unity-loading-bar">
        <img id="game-logo" src="logo.png" />
        <div id="unity-progress-bar-empty">
          <div id="unity-progress-bar-full"></div>
        </div>
      </div>
    </>
  );
}

export default App;