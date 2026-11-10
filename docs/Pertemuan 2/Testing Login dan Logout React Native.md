# Testing Login dan Logout React Native

Panduan ini membuat alur uji autentikasi Email/Password dari layar login hingga halaman utama setelah login. Tujuannya memastikan akun dapat masuk dan keluar, menampilkan kondisi sesi secara tepat, serta memberi umpan balik yang jelas saat login gagal. Navigasi memakai Expo Router dengan proteksi rute (`Stack.Protected`), sedangkan UI memakai komponen bawaan React Native dengan tema bersama di `src/theme.js`.

## Prasyarat

1. Selesaikan [Setup Project Firebase](Setup%20Project%20Firebase.md), [Setup Authentication](Setup%20Authentication.md), dan [Hubungkan Firebase ke React Native](Hubungkan%20Firebase%20ke%20React%20Native.md).
2. Buat akun uji di Firebase Console → **Authentication** → **Users**.
3. Pastikan `google-services.json` sudah ditempatkan di root project.

## Pasang dan samakan package

Install Expo dev client beserta Firebase App dan Authentication (versi otomatis disesuaikan dengan SDK 58):

```bash
npx expo install expo-dev-client @react-native-firebase/app @react-native-firebase/auth
```

Setelah install, samakan versi package dengan SDK Expo yang dipakai agar tidak ada package yang tertinggal atau diganti manual versinya:

```bash
# Periksa mismatch antara package.json dan versi rekomendasi Expo SDK
npx expo install --check

# Perbaiki otomatis semua package yang versinya tidak cocok dengan SDK
npx expo install --fix

# Diagnosis menyeluruh: dependensi, konfigurasi native, dan masalah umum lain
npx expo-doctor
```

Jalankan `npx expo install --check` lagi setelah `--fix`; hasilnya harus tidak ada lagi package yang ditandai. `npx expo-doctor` dipakai sebagai pemeriksaan akhir sebelum build.

## Konfigurasi `app.json`

Firebase App dan Auth perlu didaftarkan sebagai plugin agar native module ikut terpasang saat build development. Selain itu default Kotlin Expo 58 adalah 2.2; plugin `plugins/withFirebaseBom.js` pada project ini memaksa versi firebase-bom yang lebih baru (menaikkan versi Kotlin build Gradle ke 2.4) agar konsisten dengan versi React Native Firebase.

Buat folder baru di root project `plugins/` lalu buat file bernama `withFIrebaseBom.js`. Copas code di bawah ke file tersebut. 

```js
// plugins/withFirebaseBom.js
const { withProjectBuildGradle } = require('expo/config-plugins')

module.exports = function withFirebaseBom(config, { bom }) {
  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents += `
project.ext {
  set('react-native', [versions: [firebase: [bom: '${bom}']]])
}
`
    return config
  })
}
```

Di `app.json`, tambahkan kode di bawah ke bagian plugins
```json

[
  "./plugins/withFirebaseBom.js",
  {
    "bom": "34.19.0"
  }
],
```

Berikut lokasi untuk copas code nya
```json
{
  "expo": {
    "plugins": [

      [
        "./plugins/withFirebaseBom.js",
        {
          "bom": "34.19.0"
        }
      ],

      // line configurasi plugin lainya
    ]
}
```

Lihat [**app.json**](/app.json) untuk implementasi dari step di atas 

## Build development client

React Native Firebase memakai native module, jadi aplikasi harus dijalankan sebagai development build, bukan di Expo Go.

Build development client untuk Android:

```bash
eas build --profile development --platform android
```

Setelah build selesai, buka tautan build di HP Android dan instal aplikasi development client. Build ulang jika menambah native package atau mengubah konfigurasi native seperti `app.json`.

## Struktur file

Gunakan Expo Router dengan susunan berikut: `_layout.tsx` menangani sesi dan proteksi rute, grup `(tabs)` berisi beranda dan halaman AI, `login.tsx` berisi form login serta modal error, dan `theme.js` menyimpan warna serta style bersama.

```text
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── testAi.tsx
│   ├── +not-found.tsx
│   ├── _layout.tsx
│   └── login.tsx
└── theme.js
```

### `src/app/_layout.tsx` — sesi dan proteksi rute

Buat file `src/app/_layout.tsx`. `onAuthStateChanged` dipasang di satu tempat; hasilnya dibagikan lewat `AuthContext`, dan `Stack.Protected` beralih antara halaman login dan tab meski sesi berubah, tanpa redirect dari tiap layar.

```tsx
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
```

### `src/app/login.tsx` — login dan modal gagal

Buat atau ganti isi file `src/app/login.tsx`. Modal hanya muncul ketika validasi form atau Firebase menolak login. Style `styles`/`colors` berasal dari `src/theme.js`; tema menampilkan daftar style bersama pada bagian akhir halaman ini.

```tsx
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
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
```

### `src/app/(tabs)/_layout.tsx` — tab beranda dan AI

Buat file `src/app/(tabs)/_layout.tsx`. Warna aktif tab mengikuti tema bersama.

```tsx
import { Tabs } from 'expo-router';
import { colors } from '../../theme';

export default function TabsLayout() {
  return (
    // Gunakan palet yang sama untuk navigasi; warna aktif menandai tab yang sedang dibuka.
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: colors.navy },
      headerTintColor: colors.white,
      headerShadowVisible: false,
      tabBarActiveTintColor: colors.teal,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.peach },
      tabBarLabelStyle: { fontWeight: '600' },
    }}>
      {/* Header disembunyikan karena setiap halaman sudah menampilkan judul di dalam kartu. */}
      <Tabs.Screen name="index" options={{ title: 'Beranda', headerShown: false }} />
      <Tabs.Screen name="testAi" options={{ title: 'Analisis AI', headerShown: false }} />
    </Tabs>
  );
}
```

### `src/app/(tabs)/index.tsx` — halaman setelah login

Buat file `src/app/(tabs)/index.tsx`. Halaman ini menampilkan identitas akun yang sedang login dan menyediakan tombol logout; pengguna dibawa ke halaman login oleh proteksi rute saat sesi berakhir.

```tsx
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
```

### `src/app/+not-found.tsx` — halaman tidak ditemukan

Opsional namun direkomendasikan: Expo Router memakai halaman ini saat alamat tidak dikenal, misalnya saat membuka `/home` yang sudah tidak ada setelah logout.

```tsx
import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../theme';

// Expo Router menampilkan halaman ini saat alamat yang dibuka tidak memiliki rute.
export default function NotFoundScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.background} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.peach} />
        <View style={styles.teal} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.shadow}>
          <View style={styles.card}>
            <Text style={styles.eyebrow}>404</Text>
            <Text style={styles.title}>Halaman tidak ditemukan.</Text>
            {/* Ganti alamat yang salah agar tombol Back tidak kembali ke halaman yang tidak ada. */}
            <Link href="/" replace style={styles.text}>Kembali ke halaman utama</Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
```

### `src/theme.js` — warna dan style bersama

File `src/theme.js` berisi palet warna dan style yang dipakai bersama oleh semua halaman:

```js
import { StyleSheet } from 'react-native';

// Ubah palet di sini agar warna layar, input, dan navigasi tetap konsisten.
export const colors = {
  navy: '#17324D',
  peach: '#FFD2B8',
  teal: '#007F78',
  softTeal: '#B8DEDA',
  background: '#F5F7FA',
  muted: '#536779',
  error: '#A32939',
  white: '#FFFFFF',
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  background: { ...StyleSheet.absoluteFill },
  peach: { position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: colors.peach, top: -80, right: -100 },
  teal: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: colors.softTeal, bottom: -60, left: -120 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 40 },
  shadow: {
    width: '100%', maxWidth: 520, alignSelf: 'center', borderRadius: 28,
    boxShadow: '0 12px 36px rgba(23,50,77,0.10)',
  },
  // Efek kaca berasal dari warna transparan dan border tipis, tanpa modul blur.
  card: {
    padding: 24, gap: 16, borderRadius: 28, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', backgroundColor: 'rgba(255,255,255,0.48)',
  },
  button: { minHeight: 54, padding: 16, borderRadius: 16, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { color: colors.white, fontSize: 16, fontWeight: '600' },
  eyebrow: { color: colors.teal, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '700', letterSpacing: -0.8 },
  subtitle: { color: colors.navy, fontSize: 22, fontWeight: '700' },
  text: { color: colors.navy, fontSize: 16, lineHeight: 24 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  label: { color: colors.navy, fontSize: 14, fontWeight: '600' },
  input: {
    color: colors.navy, backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1, borderColor: 'rgba(23,50,77,0.16)', borderRadius: 16,
    padding: 16, fontSize: 16, minHeight: 54,
  },
  error: { color: colors.error, fontSize: 14, lineHeight: 22 },
});
```

## Cara menguji

0. Download file build terbaru dari expo 
1. Pastikan HP Android dan komputer berada pada jaringan Wi-Fi/LAN yang sama.
2. Jalankan server pengembangan dari root project:

   ```bash
   npx expo start
   ```

3. Buka development client yang telah diinstal di HP, lalu pindai QR code dari terminal/browser Expo. Jangan buka proyek ini dengan Expo Go.
4. Masukkan email dan password akun uji dari Firebase Console, lalu tekan **Login**.
5. Jika berhasil, aplikasi membuka tab **Beranda** dan menampilkan email serta UID akun. Tekan **Logout** untuk kembali ke halaman login.
6. Coba password yang salah atau kosong untuk melihat modal kegagalan login.

Jika HP tidak dapat terhubung, pastikan kedua perangkat benar-benar berada pada LAN yang sama, matikan isolasi client/guest Wi-Fi jika aktif, dan izinkan koneksi Metro melalui firewall komputer.

---

[Kembali: Hubungkan Firebase ke React Native](Hubungkan%20Firebase%20ke%20React%20Native.md)

[Awal: Beranda Firebase](Firebase%20Console.md)

[Lanjut: Integrasi local AI](Model%20EDOM.md)
