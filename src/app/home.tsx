import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from '@react-native-firebase/auth';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(() => getAuth().currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(
    () =>
      // Jaga halaman beranda tetap hanya bisa diakses selama sesi aktif.
      onAuthStateChanged(getAuth(), (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
        if (!currentUser) router.replace('/');
      }),
    [router],
  );

  async function logout() {
    setBusy(true);
    setMessage('');
    try {
      // Listener sesi akan mengarahkan pengguna kembali ke halaman login.
      await signOut(getAuth());
    } catch {
      setMessage('Logout gagal. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  if (!authReady || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
        <Text>Memeriksa sesi...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Beranda</Text>
        <Text>Login berhasil.</Text>
        <Text>Email: {user.email ?? 'Tidak tersedia'}</Text>
        {/* UID membantu verifikasi akun saat testing; UID bukan pengganti kredensial. */}
        <Text selectable>UID: {user.uid}</Text>
        <Button
          title={busy ? 'Memproses...' : 'Logout'}
          onPress={logout}
          disabled={busy}
        />
        {!!message && <Text>{message}</Text>}
      </View>
    </SafeAreaView>
  );
}

// Gaya halaman beranda juga menggunakan StyleSheet bawaan React Native.
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { gap: 14 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
