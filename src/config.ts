import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const SPIRIT_CANDY_MACHINE_ID = new anchor.web3.PublicKey(process.env.REACT_APP_SPIRIT_CANDY_MACHINE_ID!);
export const SOL_CANDY_MACHINE_ID = new anchor.web3.PublicKey(process.env.REACT_APP_SOL_CANDY_MACHINE_ID!);
export const START_DATE_SEED = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);
export const NETWORK = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
export const CONNECTION = new anchor.web3.Connection(process.env.REACT_APP_SOLANA_RPC_HOST!);
export const TREASURY = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);

export const TX_TIMEOUT = 30000; // milliseconds (confirm this works for your project)

export const WHITELIST_URL = "https://raw.githubusercontent.com/CyberGothica/GenesisMintLists/main/whitelist.json";