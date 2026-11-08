import { useState } from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createSentimentClassifier } from '../../../ai/sentiment.js';
import model from '../../../ai/model-edom.json';

const classify = createSentimentClassifier(model);

export default function TestAiScreen() {
  const [comment, setComment] = useState('');
  const [result, setResult] = useState('');

  function analyze() {
    const prediction = classify(comment);
    setResult(
      prediction.label
        ? `Sentimen: ${prediction.label}${prediction.experimental ? '\n\nHasil ini bersifat eksperimental.' : ''}`
        : 'Komentar belum dapat dianalisis. Coba tulis komentar lain.',
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Analisis Sentimen</Text>
        <Text>Masukkan komentar untuk dianalisis:</Text>
        <TextInput
          accessibilityLabel="Komentar untuk analisis sentimen"
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Tulis komentar di sini..."
          multiline
          textAlignVertical="top"
        />
        <Button title="Analisis komentar" onPress={analyze} />
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={!!result}
        onRequestClose={() => setResult('')}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Hasil Analisis</Text>
            <Text>{result}</Text>
            <Button title="Tutup" onPress={() => setResult('')} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { gap: 14 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: { minHeight: 120, borderWidth: 1, borderColor: '#888', borderRadius: 6, padding: 12 },
  backdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modal: { gap: 14, padding: 20, borderRadius: 8, backgroundColor: 'white' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
});
