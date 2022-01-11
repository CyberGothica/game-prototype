import { CONNECTION } from "./config";
import { PublicKey } from "@solana/web3.js";

export const getTokenBalance = async (wallet: PublicKey, address: PublicKey) => {
    const response: any = await CONNECTION.getParsedTokenAccountsByOwner(wallet, 
        {mint: address}    
    );

    if(!response || response === undefined) return 0;
    if(!response.value || response.value === undefined || response.value.length === 0) return 0;
    if(!response.value[0] || response.value[0] === undefined) return 0;
    if(!response.value[0].account || response.value[0].account === undefined) return 0;

    return response.value[0].account.data.parsed.info.tokenAmount.uiAmount;
}