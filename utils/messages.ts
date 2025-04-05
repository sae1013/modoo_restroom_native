import * as Haptics from "expo-haptics";
import * as Location from "expo-location";

// 현재 위치를 한 번만 얻고 싶을 때:
const getCurrentLocation = async () => {
    let location;
    try {
        // 캐시 위치 반환
        location = await getLastCacheLocation();
        if (!location) {
            // 없으며 새로요청
            location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
        }
        console.log('getLastLoactino()()', location)

    } catch (err) {
        console.log(err);
    }
    return location
};

// 만약 캐시된 마지막 위치가 있으면 즉시 받아오고 싶을 때:
const getLastCacheLocation = async () => {
    try {
        const location = await Location.getLastKnownPositionAsync();
        return location
    } catch (err) {
        console.log(err)
    }

    // location이 null일 수도 있으니 체크 필요
};

export const checkLocationPermission = async () => {
    const {status} = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
        return false
    }
    return true
}

export const handleMessage = async (event, webviewRef, hasLocPermission) => {
    const message = event.nativeEvent.data.trim();
    console.log('message:', message)
    if (message === 'TRIGGER_HAPTIC') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (message === 'GET_CURRENT_LOCATION') {
        const location = await getCurrentLocation();
        const lat = location?.coords?.latitude;
        const lng = location?.coords?.longitude
        const jsCode = `
            window.getCurrentLocation(${lat}, ${lng})
        `
        webviewRef.current.injectJavaScript(jsCode);
    } else if (message === 'CHECK_LOCATION_PERMISSION') {
        console.log('hasLocPermission mesage', hasLocPermission)
        if (!hasLocPermission) {
            return null
        }
        return await checkLocationPermission();
    }


};
