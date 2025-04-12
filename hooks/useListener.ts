// 위치 감시하는 Listener를 삽입.
import Location from "expo-location";
import {useRef} from "react";
import {AppState} from "react-native";
import {requestLocPermission} from "@/message/handler/permission";

/**
 * 이벤트 리스너 등록
 * @param callback
 */
// 훅으로 뺴야할듯.
export const useListener = () => {
    const subscriptionRef = useRef<any | null>(null);

    const addWatchLocationListener = async (callback) => {
        subscriptionRef.current = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,      // 1초마다 업데이트 (밀리초)
            distanceInterval: 3,     // 1미터 이상 이동 시 업데이트
        }, (location) => {
            callback(location.coords)
        })
    }

    const removeWatchLocationListener = () => {
        if (!subscriptionRef.current) return
        console.log('subscriptionRef.current', subscriptionRef.current)
        subscriptionRef.current.remove();
        subscriptionRef.current = null
    }

    // 앱 백그라운드 -> 포그라운드 체인지 될 때 올라오는 값. (웹뷰의 root에서)
    const addWatchLocationActiveForeground = () => {
        const subscription = AppState.addEventListener("change", async (nextAppState) => {
            if (nextAppState === "active") {
                await requestLocPermission()
            }
        });
    }
    return {
        addWatchLocationListener,
        removeWatchLocationListener
    }
}



