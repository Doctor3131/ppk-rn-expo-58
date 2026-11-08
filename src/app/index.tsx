import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(
    () =>
      // Pulihkan sesi tersimpan dan arahkan pengguna yang sudah login ke beranda.
      onAuthStateChanged(getAuth(), (user) => {
        setAuthReady(true);
        if (user) router.replace('/home');
      }),
    [router],
  );

  async function login() {
    // Cegah request Firebase jika form belum lengkap.
    if (!email.trim() || !password) {
      setLoginError('Email dan password wajib diisi.');
      return;
    }

    setBusy(true);
    setLoginError('');
    try {
      // Perubahan sesi akan ditangani listener dan membuka halaman beranda.
      await signInWithEmailAndPassword(getAuth(), email.trim(), password);
    } catch {
      // Modal menampilkan pesan aman tanpa membocorkan detail internal Firebase.
      setLoginError('Login gagal. Periksa email dan password akun uji, lalu coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {!authReady ? (
        <View style={styles.content}>
          <ActivityIndicator />
          <Text>Memeriksa sesi...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Login Firebase</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title={busy ? 'Memproses...' : 'Login'}
            onPress={login}
            disabled={busy}
          />
        </View>
      )}

      {/* Tampilkan feedback login gagal atau validasi form sebagai modal. */}
      <Modal
        transparent
        animationType="fade"
        visible={!!loginError}
        onRequestClose={() => setLoginError('')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Login tidak berhasil</Text>
            <Text>{loginError}</Text>
            <Button title="Tutup" onPress={() => setLoginError('')} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Semua gaya layar login dan modal dikelola lewat StyleSheet bawaan React Native.
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { gap: 14 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#888', borderRadius: 6, padding: 12 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: { gap: 14, padding: 20, borderRadius: 8, backgroundColor: 'white' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
});
