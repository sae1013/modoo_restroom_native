import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";
import {useEffect, useMemo, useRef, useState} from "react";
import "react-native-reanimated";
import {SafeAreaView, StyleSheet} from "react-native";
import {useColorScheme} from "@/hooks/useColorScheme";
import WebView from "react-native-webview";
import {messageHandler} from "@/message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
    const colorScheme = useColorScheme();
    const webviewRef = useRef<WebView | null>(null);
    const subscriptionRef = useRef<any>({});

    const [hasWebviewLoaded, setHasWebviewLoaded] = useState(false)

    const handleLoadedWebView = () => {
        setHasWebviewLoaded(true);
    }

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
                <WebView ref={webviewRef} source={{uri: "https://haewuso.shop/auth/login"}}
                         webviewDebuggingEnabled={true}
                         onMessage={(e) => {
                             if (!hasWebviewLoaded) return
                             messageHandler(e, webviewRef, subscriptionRef)
                         }}

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
