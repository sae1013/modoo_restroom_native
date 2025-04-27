import * as Location from "expo-location";
import {AppState} from "react-native";

export const getLocationPermission = async (webviewRef, param) => {
    const {status} = await Location.getForegroundPermissionsAsync();
    const callback = param?.callback

    const result = status === 'granted';
    const script = `
    if (window['${callback}']) {
      window['${callback}'](${result});
    } else {
      console.warn('${callback} is not defined on window.');
    }
    true;
  `;
    if (webviewRef && webviewRef.current) {
        webviewRef.current.injectJavaScript(script);
    }
}

export const requestLocPermission = async (webviewRef, param) => {
    const {status} = await Location.requestForegroundPermissionsAsync();
    const callback = param?.callback
    const result = status === 'granted';
    const script = `
    if (window['${callback}']) {
      window['${callback}'](${JSON.stringify(result)});
    } else {
      console.warn('${callback} is not defined on window.');
    }
    true;
  `;
    console.log('위치권한 result:', result)
    if (webviewRef && webviewRef.current) {
        webviewRef.current.injectJavaScript(script);
    }
}

/**
 *
 * @param webviewRef
 * @param param
 * 권한이 바뀔 때마다 location T/F 를 Check를 하고 웹뷰로 전송
 */
export const watchForeGroundLocationPermission = (webviewRef, param, subscriptionRef) => {
    console.log('watchforeGroundLocationPermission', param);
    // 기존 구독 있을 시 무시.
    if (subscriptionRef.current.watchChangeLocationPermission) return

    const subscription = AppState.addEventListener("change", async (nextAppState) => {
        if (nextAppState === "active") {
            await requestLocPermission(webviewRef, param)
        }
    });
    subscriptionRef.current.watchChangeLocationPermission = subscription;
    console.log('foreground sub객체',subscriptionRef.current.watchChangeLocationPermission)
}

// TODO: 종료될 때 foreground permit 취소하기. (앱의 루트 에서)
