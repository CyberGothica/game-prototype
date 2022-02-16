import { UnityContext } from "react-unity-webgl";
import { delay, getNFTDataFromLink } from "../../utils";

export async function transferHarmonyNftsToGame(unityContext: UnityContext, contract: any, account: any, nftAddress: string) {
    const tokenIds = await contract.methods
        .walletOfOwner(account)
        .call();

    for(let i = 0; i < tokenIds.length; i++) { 
        const result = await contract.methods.tokenURI(tokenIds[i]).call();
        
        const fetchedData = await getNFTDataFromLink(result);
        const nftJsonData = JSON.stringify({ Address: `${nftAddress}__${tokenIds[i]}`, Name: fetchedData.name, ImageUrl: fetchedData.image, Image: null });

        unityContext.send("UserWallet", "ReceiveNft", nftJsonData);
        delay(300);
    }
}