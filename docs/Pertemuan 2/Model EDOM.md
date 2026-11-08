# Model Analisis Sentimen (EDOM)

Halaman ini menyediakan paket model analisis sentimen lokal yang dipakai pada layar **Test Integrasi AI**. Model berjalan murni di JavaScript tanpa koneksi jaringan maupun dependency native.

## Download

- [model-edom.zip](download/model-edom.zip)

## Isi paket

```text
model-edom.zip
├── model-edom.json     # Model sentimen (unigram/bigram, TF-L2) siap inferensi
├── sentiment.js        # Fungsi createSentimentClassifier(model) untuk inferensi lokal
├── README.md           # Penjelasan format model
└── requirements.txt    # Dependensi pelatihan (tidak dipakai saat runtime aplikasi)
```

## Cara pakai di project

1. Unduh dan ekstrak `model-edom.zip`.
2. Letakkan isi hasil ekstrak ke folder `ai/` di root project sehingga menjadi:

   ```text
   project/
   └── ai/
       ├── model-edom.json
       ├── sentiment.js
       ├── README.md
       └── requirements.txt
   ```

3. Gunakan dari layar, contohnya seperti pada `src/app/(tabs)/testAi.tsx`:

   ```tsx
   import { createSentimentClassifier } from '../../../ai/sentiment.js';
   import model from '../../../ai/model-edom.json';

   // Model dibuat sekali di luar komponen agar tidak dibuat ulang setiap render.
   const classify = createSentimentClassifier(model);

   const prediction = classify('komentar untuk dianalisis');
   // prediction.label berisi sentimen hasil analisis
   ```
