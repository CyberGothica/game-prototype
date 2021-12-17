import * as anchor from "@project-serum/anchor";
import { CONNECTION, TREASURY as CYBERGOTHICA_WALLET } from "../config";
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

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