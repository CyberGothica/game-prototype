export const delay = (ms: number) => {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export const getNFTDataFromLink = async (link: string) => {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", link, false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);     
}