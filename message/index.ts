// 리팩토링
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import {triggerHaptic} from "@/message/handler/hatptic";
import {getCurrentLocation} from "@/message/handler/location";
import {getLocationPermission, requestLocPermission} from "@/message/handler/permission";
import {useListener} from "@/hooks/useListener";

export const handleMessage = async (event, webviewRef, callback: () => any) => {
    const {addWatchLocationListener, removeWatchLocationListener} = useListener();


    const message = event.nativeEvent.data.trim();
    console.log('message:', message)
    switch (message) {
        case 'TRIGGER_HAPTIC':
            triggerHaptic()
            break
        // 현재위치 획득
        case 'GET_CURRENT_LOCATION' :
            getCurrentLocation(callback);
            break
        // 현재 GPS 권한 정보 획득
        case 'CHECK_LOCATION_PERMISSION':
            getLocationPermission(callback);
            break

        // 네이티브 위치권한 요청 & GPS 권한정보 획득
        case 'REQUEST_LOCATION_PERMISSION':
            requestLocPermission(callback)
            break

        // GPS 위치추적기 리스너 등록
        case 'ADD_LISTENER_WATCH_LOCATION':
            addWatchLocationListener(callback)
            break

        // GSP 위치추적기 리스너 해제
        case 'REMOVE_LISTENER_WATCH_LOCATION':
            removeWatchLocationListener()
            break

        default :
            break
    }
}
