import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const NETWORK = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
export const CONNECTION = new anchor.web3.Connection(process.env.REACT_APP_SOLANA_RPC_HOST!);
export const TREASURY = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);
export const SPIRIT_TOKEN_ADDRESS = new anchor.web3.PublicKey("9bPoFPCwGCVGDMC5gvzisPdjgKC6tRLRDhirJvcktgVh");
export const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const HARMONY_WARRIOR_TESTNET_ADDRESS = "0x2BaB6c2E8499139031a1835F30cfC87d61DF88eB";