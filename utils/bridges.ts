export const sendLocationToWebView = (webview, coords) => {
    const {latitude, longitude} = coords;
    console.log('latitude, longitude...', latitude, longitude)
    if (webview) {
        // 웹뷰 내에 정의된 updateCurrentLocation 함수를 호출
        const jsCode = `
          if(window.updateCurrentLocation) {
            window.updateCurrentLocation(${latitude}, ${longitude});
          }
        `;
        webview.injectJavaScript(jsCode);
    }
};

export const sendLocPermissionToWebView = (webview, permission) => {
    if (!webview) return
    const jsCode = `
    if(window.getLocPermission) {
        window.getLocPermission(${permission});
    }
    `
    webview.injectJavaScript(jsCode);

}