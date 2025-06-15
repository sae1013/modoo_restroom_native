import * as Location from "expo-location";

type GetCurrentLocationReturnType = {
    lat: number;
    lng: number;
}

export const getCurrentLocation = async (webviewRef, param) => {
    let location;
    const {callback} = param;

    try {
        // 캐시 위치 반환
        location = await getLastCacheLocation();
        if (!location) {
            // 없으며 새로요청
            location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
        }
        console.log('getLastLoaction 결과:', location)

    } catch (err) {
        console.log(err);
    }
    const script = `
          if (window['${callback}']) {
            window['${callback}'](${location?.coords?.latitude}, ${location?.coords?.longitude});
          } 
          true;
        `;
    webviewRef.current.injectJavaScript(script);


}

/**
 * @desc 캐시된 마지막 위치를 받아오고싶을 때 (getCurrnetLocation의 내부적 사용 용도)
 */
const getLastCacheLocation = async () => {
    try {
        const location = await Location.getLastKnownPositionAsync();
        return location
    } catch (err) {
        console.log(err)
    }
};


// 위치추적 리스너를 달 때.
export const addWatchLocationListener = async (webviewRef, param, subscriptionRef) => {
    const callback = param?.callback
    const {status} = await Location.requestForegroundPermissionsAsync()
    console.log('status', status)

    // watchLocation Subscription 기존 구독 있으면 무시.
    if (subscriptionRef.current.watchLocation) return

    subscriptionRef.current.watchLocation = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,      // 1초마다 업데이트 (밀리초)
        distanceInterval: 3,     // 1미터 이상 이동 시 업데이트
    }, (location) => {
        console.log('location', location)
        const script = `
            if (window['${callback}']) {
              window['${callback}'](${location?.coords?.latitude}, ${location?.coords?.longitude});
            } else {
              console.warn('${callback} is not defined on window.');
            }
            true;
          `;
        if (webviewRef && webviewRef.current) {
            webviewRef.current.injectJavaScript(script);
        }
    })
}

export const removeWatchLocationListener = (webviewRef, param, subscriptionRef) => {

    //watchLocation Subscription 해제
    if (!subscriptionRef.current.watchLocation) return
    console.log('리스너 해제, 기존 등록된 구독', subscriptionRef.current.watchLocation)
    subscriptionRef.current.remove();
    subscriptionRef.current = null
}

