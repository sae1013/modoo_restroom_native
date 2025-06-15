// 리팩토링
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import {triggerHaptic} from "@/message/handler/hatptic";
import {addWatchLocationListener, getCurrentLocation, removeWatchLocationListener} from "@/message/handler/location";
import {
    getLocationPermission,
    requestLocPermission,
    watchForeGroundLocationPermission
} from "@/message/handler/permission";
import {linkToLocationSetting} from "@/message/handler/popup";

export const messageHandler = (event, webviewRef, subscriptionRef) => {
    const message = JSON.parse(event?.nativeEvent?.data) || '';
    const command = message?.command;
    const param = message?.param || {};

    console.log('메시지, 파라미터', command, param)
    switch (command) {
        case 'TRIGGER_HAPTIC':
            triggerHaptic()
            break

        /**
         * callback: getCurrentLocation
         * 현재위치 겟
         */
        case 'GET_CURRENT_LOCATION' :
            getCurrentLocation(webviewRef, param);
            break
        /**
         * 네이티브 위치권한 요청 & GPS 권한정보 획득
         * callback: requestLocationPermission
         */
        case 'REQUEST_LOCATION_PERMISSION':
            requestLocPermission(webviewRef, param)
            break

        /**
         * GPS 위치추적기 리스너 등록
         * callback: watchLocationListener
         */
        case 'ADD_LISTENER_WATCH_LOCATION':
            addWatchLocationListener(webviewRef, param, subscriptionRef)
            break

        /**
         * GPS 위치추적 해제
         */
        case 'REMOVE_LISTENER_WATCH_LOCATION':
            // subscription 객체는 current안에 종류별로 달도록 수정.
            removeWatchLocationListener(webviewRef, param, subscriptionRef)
            break

        /**
         * 백그라운드 -> Active 상태시 위치권한 체크
         * callback: requestLocationPermission (위 위치권한과 동일한 콜백 사용.)
         */
        case 'WATCH_FOREGROUND_LOCATION_PERMISSION' :
            watchForeGroundLocationPermission(webviewRef, param, subscriptionRef)
            break

        /**
         * 위치 설정으로 이동
         */
        case 'LINK_TO_LOCATION_SETTING':
            linkToLocationSetting()
            break
        default :
            break

    }

}
