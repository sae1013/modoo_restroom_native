import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import {useFonts} from "expo-font";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";
import {useEffect, useRef, useState} from "react";
import "react-native-reanimated";
import {SafeAreaView, StyleSheet} from "react-native";
import {useColorScheme} from "@/hooks/useColorScheme";
import WebView from "react-native-webview";
import * as Location from 'expo-location'
import * as Haptics from "expo-haptics";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
    const subscriptionRef = useRef<any>(null);
    const webviewRef = useRef<WebView>(null);

    const [hasLoaded, setHasLoaded] = useState(false);

    const handleLoadedWebView = async () => {
        if (hasLoaded) return
        setHasLoaded(true);

        console.log('[NATIVE]:jhandleLoadedWebView')
        if (subscriptionRef.current) return

        subscriptionRef.current = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,      // 1초마다 업데이트 (밀리초)
            distanceInterval: 3,     // 1미터 이상 이동 시 업데이트
        }, (location) => {
            sendLocationToWebView(location.coords)
        })
    }

    const handleMessage = (event) => {
        const message = event.nativeEvent.data;
        console.log(message)
        if (message === 'triggerHaptic') {
            // Expo Haptics를 이용해 햅틱 피드백 실행 (중간 정도의 강도 예시)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    };

    // 웹뷰에 현재 위치를 전달하는 함수
    const sendLocationToWebView = (coords) => {
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
    useEffect(() => {
        return () => {
            if (!subscriptionRef.current) return
            subscriptionRef.current.unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (!webviewRef.current) return
        let subscription = null
        const getLocationPermission = async () => {
            const {status} = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.error('위치 권한 거부')
                return
            }

        }
        getLocationPermission()
    }, [webviewRef.current])

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }


    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <SafeAreaView style={styles.safeArea}>
                <WebView ref={webviewRef} source={{uri: "http://192.168.219.118:3000/search"}}
                         onMessage={handleMessage}
                         onLoad={handleLoadedWebView}
                />
            </SafeAreaView>
            <StatusBar style="auto"/>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff", // 필요에 따라 배경색 지정
    },
    webview: {
        flex: 1,
    },
});
