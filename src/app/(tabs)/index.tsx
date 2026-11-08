import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../_layout';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { styles } from '../../theme';

export default function HomeScreen() {
  // Gunakan sesi milik layout utama agar data akun dan proteksi rute tetap selaras.
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
      // Jika logout gagal, pengguna bisa mencoba lagi dan pesan kesalahan tetap terlihat.
      setMessage('Logout gagal. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  // Hindari menampilkan data akun saat sesi sudah berakhir dan navigasi sedang berganti.
  if (!user) return null;

  return (
    <View style={styles.screen}>
      <View style={styles.background} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.peach} />
        <View style={styles.teal} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.shadow}>
          <View style={styles.card}>
            <Text style={[styles.title, localStyles.title]}>Login Berhasil</Text>
            <Text style={styles.label}>Email akun</Text>
            <Text style={styles.text} selectable>{user.email ?? 'Tidak tersedia'}</Text>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.muted} selectable>{user.uid}</Text>
            {/* Tombol dinonaktifkan selama logout diproses untuk menghindari permintaan berulang. */}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: busy }}
              style={({ pressed }) => [styles.button, { opacity: busy ? 0.5 : pressed ? 0.8 : 1 }]}
              onPress={logout}
              disabled={busy}
            >
              <Text style={styles.buttonLabel}>{busy ? 'Memproses...' : 'Logout'}</Text>
            </Pressable>
            {!!message && <Text style={styles.error} accessibilityRole="alert">{message}</Text>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Rata tengah hanya diterapkan pada judul halaman ini.
const localStyles = StyleSheet.create({
  title: { textAlign: 'center' },
});
