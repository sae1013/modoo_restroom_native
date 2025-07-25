import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// import {StatusBar} from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import "react-native-reanimated";
import {Platform, StyleSheet, StatusBar} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColorScheme} from "@/hooks/useColorScheme";
import WebView from "react-native-webview";
import {messageHandler} from "@/message";

const DEFAULT_AOS_BOTTOM_INSETS = 16

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	const colorScheme = useColorScheme();
	const insets = useSafeAreaInsets()
	const topInset = Platform.OS === "ios" ? insets.top : StatusBar.currentHeight || 0;
	let bottomInset = insets.bottom
	if (Platform.OS === 'android') {
		bottomInset = DEFAULT_AOS_BOTTOM_INSETS;
	}

	const webviewRef = useRef<WebView | null>(null);
	const subscriptionRef = useRef<any>({});
	console.log(topInset, bottomInset)
	const injectedInitScript = `
    (function() {
      window.SAFE_AREA_INSETS_TOP = ${topInset || 0};
      window.SAFE_AREA_INSETS_BOTTOM = ${bottomInset || 0};
    })();
    true;
  `

	const [hasWebviewLoaded, setHasWebviewLoaded] = useState(false)

	const handleLoadedWebView = () => {
		setHasWebviewLoaded(true);
	}

	useEffect(() => {
		if (loaded && hasWebviewLoaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded, hasWebviewLoaded]);

	if (!loaded) {
		return null;
	}


	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<StatusBar barStyle="dark-content" translucent={false}/>
			<WebView ref={webviewRef}
							 source={{uri: __DEV__ ? 'http://localhost:3000/auth/login' : "https://haewuso.shop/auth/login"}}
							 injectedJavaScriptBeforeContentLoaded={injectedInitScript}
							 javaScriptEnabled
							 webviewDebuggingEnabled={true}
							 onMessage={(e) => {
								 if (!hasWebviewLoaded) return
								 messageHandler(e, webviewRef, subscriptionRef)
							 }}
							 onLoad={handleLoadedWebView}
			/>
			{/*</SafeAreaView>*/}
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff', // 필요에 따라 배경색 지정
	},
	webview: {
		flex: 1,
	},

});
