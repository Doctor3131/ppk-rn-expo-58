import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getAuth, onAuthStateChanged, type User } from '@react-native-firebase/auth';
export const AuthContext = createContext<User | null>(null);

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => onAuthStateChanged(getAuth(), (currentUser) => {
    setUser(currentUser);
    setAuthReady(true);
  }), []);

  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Memeriksa sesi...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={user}>
      <Stack>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="+not-found" options={{ title: 'Halaman tidak ditemukan' }} />
      </Stack>
    </AuthContext.Provider>
  );
}
