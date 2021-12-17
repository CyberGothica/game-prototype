import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const NETWORK = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
export const CONNECTION = new anchor.web3.Connection(process.env.REACT_APP_SOLANA_RPC_HOST!);
export const TREASURY = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);