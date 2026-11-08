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
