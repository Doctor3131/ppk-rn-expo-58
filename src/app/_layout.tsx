import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getAuth, onAuthStateChanged, type User } from '@react-native-firebase/auth';

// Bagikan pengguna aktif ke halaman lain tanpa membuat listener Firebase tambahan.
export const AuthContext = createContext<User | null>(null);

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Pantau sesi di satu tempat; fungsi yang dikembalikan melepas listener saat layout ditutup.
  useEffect(() => onAuthStateChanged(getAuth(), (currentUser) => {
    setUser(currentUser);
    setAuthReady(true);
  }), []);

  // Tunggu Firebase memulihkan sesi tersimpan sebelum menentukan halaman yang boleh dibuka.
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
        {/* Proteksi rute mengganti halaman mengikuti sesi, tanpa redirect dari tiap layar. */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        {/* Seluruh tab hanya tersedia selama pengguna sudah login. */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="+not-found" options={{ title: 'Halaman tidak ditemukan' }} />
      </Stack>
    </AuthContext.Provider>
  );
}
