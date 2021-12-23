import { CONNECTION } from "../config";
import { PublicKey } from "@solana/web3.js";

const SPIRIT_TOKEN_ADDRESS = new PublicKey("9bPoFPCwGCVGDMC5gvzisPdjgKC6tRLRDhirJvcktgVh");

export const getSpiritBalance = async (wallet: PublicKey) => {
    const response = await CONNECTION.getParsedTokenAccountsByOwner(wallet, 
        {mint: SPIRIT_TOKEN_ADDRESS}    
    );

    if(!response) return 0;
    
    return response.value[0].account.data.parsed.info.tokenAmount.uiAmount;
}