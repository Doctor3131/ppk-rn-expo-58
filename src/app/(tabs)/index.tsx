import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../_layout';
import {
  getAuth,
  signOut,
} from '@react-native-firebase/auth';

export default function HomeScreen() {
  const user = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

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

  if (!user) return null;

  return (
    <View style={styles.container}>
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
    </View>
  );
}

// Gaya halaman beranda juga menggunakan StyleSheet bawaan React Native.
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { gap: 14 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
