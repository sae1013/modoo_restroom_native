import * as Location from "expo-location";

export const getLocationPermission = async (callback) => {
    const {status} = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
        return callback(false)
    }
    return callback(true)
}

export const requestLocPermission = async (callback?) => {
    const {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        if (callback) {
            callback(false)
        }

        console.log("위치 권한이 변경되어 허용되지 않음");
        // setShowModal(true)
        // setHasLocPermission(false)
    } else {
        console.log("위치 권한이 허용됨");
        if (callback) {
            callback(true)
        }
        // setShowModal(false)
        // setHasLocPermission(true)
    }
}
