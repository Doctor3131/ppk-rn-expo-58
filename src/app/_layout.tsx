import { Stack } from 'expo-router';

export default function RootLayout() {
  // Expo Router menggunakan Stack untuk berpindah antara login dan beranda.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="home" options={{ title: 'Beranda' }} />
    </Stack>
  );
}
