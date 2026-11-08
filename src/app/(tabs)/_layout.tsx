import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="testAi" options={{ title: 'Analisis AI' }} />
    </Tabs>
  );
}
