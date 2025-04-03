import * as Haptics from "expo-haptics";

export const handleMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log(message)
    if (message === 'triggerHaptic') {
        // Expo Haptics를 이용해 햅틱 피드백 실행 (중간 정도의 강도 예시)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
};