import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { colors, styles } from '../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [loginError, setLoginError] = useState('');

  async function login() {
    // Tolak form kosong sebelum mengirim permintaan; spasi pada password tetap dipertahankan.
    if (!email.trim() || !password) {
      setLoginError('Email dan password wajib diisi.');
      return;
    }

    // Nonaktifkan tombol selama permintaan berjalan dan bersihkan pesan percobaan sebelumnya.
    setBusy(true);
    setLoginError('');
    try {
      // Perubahan sesi akan ditangani listener dan membuka halaman beranda.
      await signInWithEmailAndPassword(getAuth(), email.trim(), password);
    } catch {
      // Tampilkan pesan umum agar detail internal Firebase tidak muncul ke pengguna.
      setLoginError('Login gagal. Periksa email dan password akun uji, lalu coba lagi.');
    } finally {
      // Aktifkan kembali tombol, termasuk jika permintaan gagal.
      setBusy(false);
    }
  }

  return (
    // Sesuaikan ruang saat keyboard muncul agar input dan tombol tetap bisa dijangkau.
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Dekorasi saja: tidak menangkap sentuhan atau dibaca oleh pembaca layar. */}
      <View style={styles.background} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.peach} />
        <View style={styles.teal} />
      </View>
      {/* Form dapat digulir di layar kecil; tombol tetap menerima ketukan saat keyboard terbuka. */}
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.shadow}>
          <View style={styles.card}>
            <Text style={[styles.title, localStyles.title]}>Login</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
              accessibilityLabel="Email"
              placeholderTextColor={colors.muted}
              selectionColor={colors.teal}
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              accessibilityLabel="Password"
              placeholderTextColor={colors.muted}
              selectionColor={colors.teal}
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: busy }}
              style={({ pressed }) => [styles.button, { opacity: busy ? 0.5 : pressed ? 0.8 : 1 }]}
              onPress={login}
              disabled={busy}
            >
              <Text style={styles.buttonLabel}>{busy ? 'Memproses...' : 'Login'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {/* Pesan validasi dan kegagalan login dapat ditutup lewat tombol Tutup atau Back Android. */}
      <Modal
        transparent
        animationType="fade"
        visible={!!loginError}
        onRequestClose={() => setLoginError('')}
      >
        <View style={styles.screen}>
          <View style={styles.background} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={styles.peach} />
            <View style={styles.teal} />
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.shadow}>
              <View style={styles.card}>
                <Text style={styles.subtitle}>Login tidak berhasil</Text>
                <Text style={styles.error} accessibilityRole="alert">{loginError}</Text>
                <Pressable accessibilityRole="button" onPress={() => setLoginError('')} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}>
                  <Text style={styles.buttonLabel}>Tutup</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// Penyesuaian khusus halaman ini ditambahkan di atas style bersama dari theme.js.
const localStyles = StyleSheet.create({
  title: { textAlign: 'center' },
});
