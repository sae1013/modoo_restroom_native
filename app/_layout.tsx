import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import {useFonts} from "expo-font";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";
import {useEffect, useMemo, useRef, useState} from "react";
import "react-native-reanimated";
import {Alert, AppState, Button, Linking, Modal, SafeAreaView, StyleSheet} from "react-native";
import {useColorScheme} from "@/hooks/useColorScheme";
import WebView from "react-native-webview";
import {View, Text} from "react-native";
import {requestLocPermission} from "@/message/handler/permission";
import {messageHandler} from "@/message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
    const [showModal, setShowModal] = useState(false);
    const colorScheme = useColorScheme();
    const webviewRef = useRef<WebView | null>(null);
    const subscriptionRef = useRef<any>({});

    const [hasWebviewLoaded, setHasWebviewLoaded] = useState(false)

    const handleLoadedWebView = () => {
        setHasWebviewLoaded(true);
    }

    // const handleConfirm = () => {
    //     Linking.openSettings().catch(() => {
    //         Alert.alert('Error', '설정 페이지를 열 수 없습니다.');
    //     });
    // }
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
                <WebView ref={webviewRef} source={{uri: "http://192.168.219.124:3000/test"}}
                         webviewDebuggingEnabled={true}
                         onMessage={(e) => {
                             messageHandler(e, webviewRef, subscriptionRef)
                         }}

                         onLoad={handleLoadedWebView}
                />
                {/* Modal 컴포넌트 */}
                {showModal &&
                    <Modal
                        transparent={true}
                        animationType="slide"
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>위치권한 허용안내</Text>
                                <Text style={styles.modalMessage}>위치를 사용하는 서비스입니다. 활성화 시켜주세요</Text>
                                <Button title="닫기" onPress={() => {
                                    // handleConfirm()
                                }}/>
                            </View>
                        </View>
                    </Modal>
                }

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
