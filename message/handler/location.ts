import Location from "expo-location";

type GetCurrentLocationReturnType = {
    lat: number;
    lng: number;
}
export const getCurrentLocation = async (callback: (data: GetCurrentLocationReturnType) => any) => {
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
    return callback({
        lat: location?.coords?.latitude,
        lng: location?.coords?.longitude
    });

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

