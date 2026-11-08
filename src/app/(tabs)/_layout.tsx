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
