import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#EAF4F2' },
          headerTintColor: '#14213D',
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="survey" options={{ title: '자가 선별', headerBackVisible: false }} />
        <Stack.Screen name="result" options={{ title: '선별 결과', headerBackVisible: false }} />
        <Stack.Screen name="crisis" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="resources" options={{ title: '도움받을 곳' }} />
        <Stack.Screen name="history" options={{ title: '나의 변화 추이' }} />
        <Stack.Screen name="centers" options={{ title: '가까운 센터' }} />
      </Stack>
    </>
  );
}
