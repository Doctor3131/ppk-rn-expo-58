import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../_layout';
import { getAuth, signOut } from '@react-native-firebase/auth';

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
      <Text style={styles.title}>Beranda</Text>
      <Text>Login berhasil.</Text>
      <Text>Email: {user.email ?? 'Tidak tersedia'}</Text>
      <Text selectable>UID: {user.uid}</Text>
      <Button
        title={busy ? 'Memproses...' : 'Logout'}
        onPress={logout}
        disabled={busy}
      />
      {!!message && <Text>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 14 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
