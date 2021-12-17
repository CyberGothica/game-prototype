import * as anchor from "@project-serum/anchor";
import { CONNECTION, TREASURY as CYBERGOTHICA_WALLET } from "../config";
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
	'cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ',
);

export const getUserTokenAccounts = async (pubkey: anchor.web3.PublicKey) => {
    
    console.log(
        await CONNECTION.getTokenAccountsByOwner(pubkey, { programId: TOKEN_PROGRAM_ID })
    );
}

export const GetInfoFromUrl = (yourUrl: string) => {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

export const sleep = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export async function getNftMetadata(nftAddress: string) {
	let tokenmetaPubkey = await Metadata.getPDA(new anchor.web3.PublicKey(nftAddress));
	const tokenAccountMeta = await Metadata.load(CONNECTION, tokenmetaPubkey);

	if(CYBERGOTHICA_WALLET.toString() == tokenAccountMeta.data.updateAuthority) {
		const nftInfo = JSON.parse(GetInfoFromUrl(tokenAccountMeta.data.data.uri));

		if(nftInfo.collection.family = "CyberGothica")
			return nftInfo;
	}
	
	console.log("It is not CyberGothica's nft!");
	return null;
}
