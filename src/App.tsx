import React, { DOMElement, useEffect, useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import {
	getPhantomWallet,
	getSlopeWallet,
	getSolflareWallet,
	getSolletWallet
} from "@solana/wallet-adapter-wallets";
import { getNftsForOwner, transferNftsToGame } from "./lib/solana/nft-utils";
import { getTokenBalance } from "./lib/solana/utils";
import { SPIRIT_TOKEN_ADDRESS } from "./lib/solana/config";

//New Harmony

import Web3 from 'web3'

declare var window: any

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
  const [account, setAccount]=useState<any>('')

  const [displayWallets, setdisplayWallets] = useState(false);
  let userWallet: any;
  
  useEffect(function () {
    unityContext.on("ConnectWallet", async function () {
      setdisplayWallets(true);
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

    unityContext.on("RegisterNewNft", function (nftAddress, nftName) {
        console.log(nftAddress);
        console.log(nftName);
        var url = process.env.REACT_APP_LEADERBOARD_DB_URI;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url + "/register");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }};

        var data = `{"token_address": "${nftAddress}", "character_name": "${nftName}"}`;

        xhr.send(data);
    });

    return function () {
      unityContext.removeEventListener("progress");
    };

  }, []);
  
   
    
  const onClickMetamask = async () =>{
    //await provider();
    
    await loadWeb3();
    await loadBlockchainData()
  }
    
  
  const loadWeb3 = async () => {
  //you code here
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  
  const loadBlockchainData = async () => {
    //you code here
      const web3 = window.web3
      // Load account
      const accounts = await web3.eth.getAccounts()
  
      setAccount(accounts[0])
     
      console.log(accounts[0])
      setdisplayWallets(false);
    }
    
 

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
        const spiritTokenAmount = await getTokenBalance(userWallet.publicKey, SPIRIT_TOKEN_ADDRESS); 
        
        unityContext.send("UserWallet", "SetSpiritAmount", spiritTokenAmount);
        setdisplayWallets(false);

        transferNftsToGame(unityContext, userWallet.publicKey);
        // const nftsData = await getNftsForOwner(userWallet.publicKey);

        // for(let i = 0; i < nftsData.length; i++) {
        //   const nftJsonData = JSON.stringify(nftsData[i]);
        //   unityContext.send("UserWallet", "ReceiveNft", nftJsonData);
        // }
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
                <button className="wallet-adapters-list-button" onClick={() => connectWalletToBuild(getSolflareWallet())}>
                    Solflare
                </button>
                <button className="wallet-adapters-list-button" onClick={() => connectWalletToBuild(getSolletWallet())}>
                    Sollet
                </button>
                <button className="wallet-adapters-list-button" onClick={() => onClickMetamask()}>
                    Metamask
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


