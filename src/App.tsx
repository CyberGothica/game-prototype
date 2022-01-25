import React, { DOMElement, useEffect, useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import {
	getPhantomWallet,
	getSlopeWallet,
	getSolflareWallet,
	getSolletWallet
} from "@solana/wallet-adapter-wallets";
import { getNftsForOwner } from "./lib/solana/nft-utils";
import { getTokenBalance } from "./lib/solana/utils";
import { SPIRIT_TOKEN_ADDRESS } from "./lib/solana/config";



//New Harmony

import Web3 from 'web3'

//import './App.css';
//import Color from './contracts/Color.json'
import * as ColorImported from './contracts/Color.json'
// 
import detectEthereumProvider from '@metamask/detect-provider';

const Color: any = ColorImported
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
  /*constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }
  }*/
  const [account, setAccount]=useState<any>('')
  const [contract, setContract]=useState<any>(null)
  const [totalSupply, setTotalSupply]=useState<any>(0)
  const [colors, setColors]=useState<any>([])

  const [displayWallets, setdisplayWallets] = useState(false);
  let userWallet: any;
  console.log(Color)
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
    
  /*
  const provider = async () => {

    await detectEthereumProvider();

    if (provider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      App(provider); // initialize your app
    } 
    else {
      console.log('Please install MetaMask!');
    }
  }
  */
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
    // this.setState({ account: accounts[0] })
      setAccount(accounts[0])
      console.log(accounts[0])
      const networkId = await web3.eth.net.getId()
      //console.log(Color)
      //console.log(ColorImported)
      //console.log(networkId)
      //console.log(Color.networks)
      const networkData:any = Color.networks[networkId]
     
      if(networkData) {
        const abi = Color.abi
        const address = networkData.address
        console.log(networkData.address)
        const contract = new web3.eth.Contract(abi, address)
      // this.setState({ contract })
        setContract(contract)

        const totalSupply = await contract.methods.totalSupply().call()
      // this.setState({ totalSupply })
        setTotalSupply(totalSupply)
        // Load Colors
        for (var i = 1; i <= totalSupply; i++) {
          const color = await contract.methods.colors(i - 1).call()
          //this.setState({
        //   colors: [...this.state.colors, color]
        // })
          setColors([...colors,color])
        }
      } else {
        window.alert('Smart contract not deployed to detected network.')
      }
    
    }
    
     const mint = (color: any) => {
    // this.state.contract.methods.mint(color).send({ from: this.state.account })
    // .once('receipt', (receipt) => {
    //   this.setState({
    //     colors: [...this.state.colors, color]
    //   })
    // })
    contract.methods.mint(color).send({from: account})
      .once('receipt',(receipt: any)=>{
        setColors([...colors,color])
      })
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

        const nftsData = await getNftsForOwner(userWallet.publicKey);

        for(let i = 0; i < nftsData.length; i++) {
          const nftJsonData = JSON.stringify(nftsData[i]);
          unityContext.send("UserWallet", "ReceiveNft", nftJsonData);
        }
    }
  }

  // $('button').addClass("mintButton");

  // let observerTargetDom = document.body;
  // let observerConfig = { attributes: true, childList: true, subtree: true };
  // const mutationHandler = (mutationList: any, observer: any) => {
  //   $('button').addClass("walletButton");
  //   console.log("hi");
  // };
  // let mutationObserver = new MutationObserver(mutationHandler);
  // try {
  //   mutationObserver.observe(observerTargetDom, observerConfig);
  // } catch (e) {
  //   console.log(e);
  // }

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


