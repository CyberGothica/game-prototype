var buildUrl = "Build";
var loaderUrl = buildUrl + "/UnitySolanaBuild.loader.js";
var config = {
    dataUrl: buildUrl + "/UnitySolanaBuild.data.gz",
    frameworkUrl: buildUrl + "/UnitySolanaBuild.framework.js.gz",
    codeUrl: buildUrl + "/UnitySolanaBuild.wasm.gz",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "UnityJSWebGLTest",
    productVersion: "0.1",
};

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");

container.className = "unity-mobile";
config.devicePixelRatio = 1;

loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((unityInstance) => {
      loadingBar.style.display = "none";
    }).catch((message) => {
        alert(message);
    });
};

document.body.appendChild(script);