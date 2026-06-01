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
        <Stack.Screen name="survey" options={{ title: '자가진단', headerBackVisible: false }} />
        <Stack.Screen name="result" options={{ title: '진단 결과', headerBackVisible: false }} />
      </Stack>
    </>
  );
}
