import { UnityContext } from "react-unity-webgl";
import { HARMONY_WARRIOR_TESTNET_ADDRESS } from "./config";

export async function transferHarmonyNftsToGame(unityContext: UnityContext, smartContract: any, account: any) {
    console.log(smartContract);
    const tokenIds = await smartContract.methods
        .walletOfOwner(account)
        .call();

    console.log(tokenIds);

    for(let i = 0; i < tokenIds.length; i++) {
        const result = await smartContract.methods.tokenURI(tokenIds[i]).call();
        
        const fetchedData = await getNFTDataFromLink(result);
        const nftJsonData = JSON.stringify({ Address: `${HARMONY_WARRIOR_TESTNET_ADDRESS}__${tokenIds[i]}`, Name: fetchedData.name, ImageUrl: fetchedData.image, Image: null });
        console.log(nftJsonData);
        unityContext.send("UserWallet", "ReceiveNft", nftJsonData);
    }
}

const getNFTDataFromLink = async (link: string) => {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", link, false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);     
}