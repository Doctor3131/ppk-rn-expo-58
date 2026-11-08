import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createSentimentClassifier } from '../../../ai/sentiment.js';
import model from '../../../ai/model-edom.json';
import { colors, styles } from '../../theme';

// Siapkan model sekali di luar komponen agar tidak dibuat ulang setiap kali pengguna mengetik.
const classify = createSentimentClassifier(model);

export default function TestAiScreen() {
  const [comment, setComment] = useState('');
  const [result, setResult] = useState('');

  function analyze() {
    // Analisis berjalan lokal menggunakan model JSON yang disertakan dalam aplikasi.
    const prediction = classify(comment);
    // Jelaskan keterbatasan hasil eksperimen dan beri pesan pengganti jika label tidak tersedia.
    const note = prediction.experimental ? '\n\n(integrasi berhasil)\nHasil ini bersifat eksperimental.' : '';
    setResult(
      prediction.label
        ? `Sentimen: ${prediction.label}${note}`
        : 'Komentar belum dapat dianalisis. Coba tulis komentar lain.',
    );
  }

  return (
    // Form tetap dapat digulir saat keyboard mengurangi ruang layar.
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.background} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.peach} />
        <View style={styles.teal} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.shadow}>
          <View style={styles.card}>
            <Text style={[styles.title, localStyles.title]}>Test Integrasi AI</Text>
            <Text style={styles.muted}>Tulis komentar dan temukan sentimen di dalamnya.</Text>
            <TextInput
              accessibilityLabel="Komentar untuk analisis sentimen"
              style={[styles.input, localStyles.multiline]}
              placeholderTextColor={colors.muted}
              selectionColor={colors.teal}
              value={comment}
              onChangeText={setComment}
              placeholder="Tulis komentar di sini..."
              multiline
              textAlignVertical="top"
            />
            <Pressable accessibilityRole="button" onPress={analyze} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}>
              <Text style={styles.buttonLabel}>Analisis komentar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Hasil disimpan terpisah dari komentar; menutup modal tidak menghapus input pengguna. */}
      <Modal
        transparent
        animationType="fade"
        visible={!!result}
        onRequestClose={() => setResult('')}
      >
        <View style={styles.screen}>
          <View style={styles.background} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={styles.peach} />
            <View style={styles.teal} />
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.shadow}>
              <View style={styles.card}>
                <Text style={styles.subtitle}>Ringkasan sentimen</Text>
                <Text style={styles.text}>{result}</Text>
                <Pressable accessibilityRole="button" onPress={() => setResult('')} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}>
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

// Area komentar dibuat lebih tinggi karena menerima teks beberapa baris.
const localStyles = StyleSheet.create({
  title: { textAlign: 'center' },
  multiline: { minHeight: 150 },
});
