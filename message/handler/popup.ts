import {Alert, Linking} from "react-native";

export const linkToLocationSetting = () => {
    Linking.openSettings().catch(() => {
        Alert.alert('Error', '설정 페이지를 열 수 없습니다.');
    });
}
