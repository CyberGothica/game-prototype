import * as anchor from "@project-serum/anchor";
import { CONNECTION, TOKEN_METADATA_PROGRAM_ID } from "./config";
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID,  } from '@solana/spl-token';
import { UnityContext } from "react-unity-webgl";
import axios from "axios";

export async function getNftsForOwner(ownerAddress: anchor.web3.PublicKey) {
	const allTokens: any = []
	const tokenAccounts = await CONNECTION.getParsedTokenAccountsByOwner(ownerAddress, {
	  programId: TOKEN_PROGRAM_ID
	});

	for (let index = 0; index < tokenAccounts.value.length; index++) {
	  const tokenAccount = tokenAccounts.value[index];
	  const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;

    console.log(tokenAccount.account.data.parsed.info);
      
	  if (tokenAmount.amount == "1" && tokenAmount.decimals == "0") {
		try {
            let [pda] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                (new anchor.web3.PublicKey(tokenAccount.account.data.parsed.info.mint)).toBuffer(),
              ], TOKEN_METADATA_PROGRAM_ID);
              const accountInfo: any = await CONNECTION.getParsedAccountInfo(pda);
        
              const metadata: any = new Metadata(ownerAddress.toString(), accountInfo.value);
              const { data }: any = await axios.get(metadata.data.data.uri)
      
              if(data.collection.family != "CyberGothica") continue;

			  allTokens.push({ Address: tokenAccount.account.data.parsed.info.mint, Name: data.name, ImageUrl: data.image, Image: null })
        }
        catch (error: any) {
            console.log(error.toString());
        }
	  }
	  allTokens.sort(function (a: any, b: any) {
		if (a.name < b.name) { return -1; }
		if (a.name > b.name) { return 1; }
		return 0;
	  })
	}
  
	return allTokens
  }

  export async function transferNftsToGame(unityContext: UnityContext, ownerAddress: anchor.web3.PublicKey) {
	const tokenAccounts = await CONNECTION.getParsedTokenAccountsByOwner(ownerAddress, {
	  programId: TOKEN_PROGRAM_ID
	});

	for (let index = 0; index < tokenAccounts.value.length; index++) {
	  const tokenAccount = tokenAccounts.value[index];
	  const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;

    console.log(tokenAccount.account.data.parsed.info);
      
	  if (tokenAmount.amount == "1" && tokenAmount.decimals == "0") {
		try {
            let [pda] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                (new anchor.web3.PublicKey(tokenAccount.account.data.parsed.info.mint)).toBuffer(),
              ], TOKEN_METADATA_PROGRAM_ID);
              const accountInfo: any = await CONNECTION.getParsedAccountInfo(pda);
        
              const metadata: any = new Metadata(ownerAddress.toString(), accountInfo.value);
              const { data }: any = await axios.get(metadata.data.data.uri)
      
              if(data.collection.family != "CyberGothica") continue;
			  const nftJsonData = JSON.stringify({ Address: tokenAccount.account.data.parsed.info.mint, Name: data.name, ImageUrl: data.image, Image: null });
          	  unityContext.send("UserWallet", "ReceiveNft", nftJsonData);
        }
        catch (error: any) {
            console.log(error.toString());
        }
	  }
	}
  }
