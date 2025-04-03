export const sendLocationToWebView = (webviewRef, coords) => {
    const {latitude, longitude} = coords;
    if (webviewRef.current) {
        // 웹뷰 내에 정의된 updateCurrentLocation 함수를 호출
        const jsCode = `
          if(window.updateCurrentLocation) {
            window.updateCurrentLocation(${latitude}, ${longitude});
          }
        `;
        webviewRef.current.injectJavaScript(jsCode);
    }
};