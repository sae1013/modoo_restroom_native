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
import {Alert, AppState, Button, Linking, Modal, SafeAreaView, StyleSheet} from "react-native";
import {useColorScheme} from "@/hooks/useColorScheme";
import WebView from "react-native-webview";
import * as Location from 'expo-location'
import * as Haptics from "expo-haptics";
import {handleMessage} from '../utils/messages'
import {sendLocationToWebView} from "@/utils/bridges";
import {View, Text} from "react-native";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const colorScheme = useColorScheme();
    // const [isGrantedLocation, setIsGrantedLocation] = useState<boolean>(true);
    // const [isWebViewLoaded, setIsWebViewLoaded] = useState<boolean>(false);
    //

    // const subscriptionRef = useRef<any>(null);
    const webviewRef = useRef<WebView>(null);

    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setHasPermission(false);
            } else {
                setHasPermission(true);
            }
        })();
    }, []);

    //
    // console.log('[위치동의]', isGrantedLocation)
    //
    // const handleLoadedWebView = () => {
    //     setIsWebViewLoaded(true);
    // }
    //
    // const addWatchLocationListener = async () => {
    //     console.log('위치구독활성화')
    //     if (subscriptionRef.current) return
    //     subscriptionRef.current = await Location.watchPositionAsync({
    //         accuracy: Location.Accuracy.High,
    //         timeInterval: 3000,      // 1초마다 업데이트 (밀리초)
    //         distanceInterval: 3,     // 1미터 이상 이동 시 업데이트
    //     }, (location) => {
    //         sendLocationToWebView(webviewRef.current, location.coords)
    //     })
    // }
    //
    // const removeWatchLocationListener = () => {
    //     if (!subscriptionRef.current) return
    //     console.log('기등록된 리스너', subscriptionRef.current)
    //     subscriptionRef.current.unsubscribe();
    // }
    //
    // const checkGrantedLocation = async () => {
    //     const {status} = await Location.getForegroundPermissionsAsync();
    //     return status === "granted"
    // }
    //

    const handleConfirm = () => {
        Linking.openSettings().catch(() => {
            Alert.alert('Error', '설정 페이지를 열 수 없습니다.');
        });
    }

    const PermissionAlert = () => {
        const openAppSettings = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Error', '설정 페이지를 열 수 없습니다.');
            });
        };
    }

    const requestGrantedLocation = async () => {
        const {status} = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            console.error('위치 권한 거부')
            // setIsGrantedLocation(false)
            return
        } else {
            console.log('승인!')
        }
        // setIsGrantedLocation(true)
    }
    useEffect(() => {

    })
    //
    // // isGranted 일 때 이벤트리스너 등록
    // useEffect(() => {
    //     if (!isWebViewLoaded) return
    //     // isGranted 일때 웹뷰로 이벤트전달.
    //     if (!isGrantedLocation) {
    //         removeWatchLocationListener()
    //     }
    //     addWatchLocationListener();
    //
    // }, [isGrantedLocation, isWebViewLoaded])
    //
    // useEffect(() => {
    //     if (!isGrantedLocation) {
    //         requestGrantedLocation()
    //     }
    // }, [isGrantedLocation])
    //
    // // 앱이 처음 로드되었을 때, 위치 권한여부 체크
    // useEffect(() => {
    //     const processGrantedLocation = async () => {
    //         const isGranted = await checkGrantedLocation()
    //         if (!isGranted) {
    //             await requestGrantedLocation()
    //             return
    //         } else {
    //             setIsGrantedLocation(true)
    //         }
    //     }
    //
    //     if (!isWebViewLoaded) return
    //     // 위치권한과 관련된 로직을 수행한다.
    //     processGrantedLocation()
    // }, [isWebViewLoaded])
    //
    // // 위치 권한 여부를 active상태일때마다 검사.
    // useEffect(() => {
    //     const subscription = AppState.addEventListener("change", async (nextAppState) => {
    //         if (nextAppState === "active") {
    //             const {status} = await Location.getForegroundPermissionsAsync();
    //             if (status !== "granted") {
    //                 console.log("위치 권한이 변경되어 허용되지 않음");
    //                 setIsGrantedLocation(false)
    //             } else {
    //                 console.log("위치 권한이 허용됨");
    //                 setIsGrantedLocation(true)
    //             }
    //         }
    //     });
    //
    //     return () => {
    //         subscription.remove();
    //         // 앱이 종료될때 구독취소
    //         removeWatchLocationListener()
    //     };
    // }, []);

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
                    // onLoad={handleLoadedWebView}
                />
                {/* Modal 컴포넌트 */}
                <Modal
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>모달 팝업</Text>
                            <Text style={styles.modalMessage}>이것은 WebView 위에 띄워진 모달 팝업입니다.</Text>
                            <Button title="닫기" onPress={handleConfirm}/>
                        </View>
                    </View>
                </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 오버레이
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5, // Android 그림자 효과
        shadowColor: '#000', // iOS 그림자 효과
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },

});
