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
// 아래 로직은, AOS에서 무한 요청으로 삭제.
export const watchForeGroundLocationPermission2 = (webviewRef, param, subscriptionRef) => {
    console.log('watchforeGroundLocationPermission', param);
    // 기존 구독 있을 시 무시.
    if (subscriptionRef.current.watchChangeLocationPermission) return

    const subscription = AppState.addEventListener("change", async (nextAppState) => {
        if (nextAppState === "active") {
            await requestLocPermission(webviewRef, param)
        }
    });
    subscriptionRef.current.watchChangeLocationPermission = subscription;
    console.log('foreground sub객체', subscriptionRef.current.watchChangeLocationPermission)
}

export const watchForeGroundLocationPermission = (webviewRef, param, subscriptionRef) => {
    const handler = async (nextAppState) => {
        const callback = param?.callback

        if (nextAppState === 'active') {
            // 이벤트 리스너 해제 (순간 단절)
            subscriptionRef.current.watchChangeLocationPermission.remove();
            subscriptionRef.current.watchChangeLocationPermission = null;

            const {status} = await Location.getForegroundPermissionsAsync();
            const result = status === 'granted';
            // 권한 요청
            if(!result) {
                await requestLocPermission(webviewRef, param);
            }

            // 권한 요청 후 리스너 재등록
            if(subscriptionRef.current.watchChangeLocationPermission) return
            const newSub = AppState.addEventListener('change', handler);
            subscriptionRef.current.watchChangeLocationPermission = newSub;
        }
    }

    if (subscriptionRef.current.watchChangeLocationPermission) return;

    // 최초 구독
    const sub = AppState.addEventListener('change', handler);
    subscriptionRef.current.watchChangeLocationPermission = sub;
}

// TODO: 종료될 때 foreground permit 취소하기. (앱의 루트 에서)
