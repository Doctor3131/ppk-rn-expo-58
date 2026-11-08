# PPK — React Native Expo 58

Contoh aplikasi React Native (Expo SDK 58) dengan Firebase Auth, analisis sentimen lokal, dan UI modern. Untuk setup pertama kali, ikuti [PPK 101](docs/Pertemuan%201/PPK%20101.md).

## Folder Pertemuan Praktikum PPK
- [Pertemuan 1](docs/Pertemuan%201/)
- [Pertemuan 2](docs/Pertemuan%202/)

## Struktur project (Current Commit)

```text
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Navigasi tab Beranda & Analisis AI
│   │   ├── index.tsx       # Beranda: info akun & logout
│   │   └── testAi.tsx      # Analisis sentimen lokal
│   ├── _layout.tsx         # Sesi Firebase & proteksi rute
│   ├── login.tsx           # Form login
│   └── +not-found.tsx      # Halaman 404
├── theme.js                # Warna & style bersama
└── ai/
    ├── model-edom.json     # Model sentimen
    └── sentiment.js        # Inferensi lokal (tanpa jaringan)

plugins/
└── withFirebaseBom.js      # Config plugin Firebase BOM (Kotlin 2.4)
```

## Mulai cepat

```bash
npm install

# Jalankan dev server (development build, bukan Expo Go)
npx expo start --dev-client
```

```bash
# Samakan package dengan SDK
npx expo install --check
npx expo install --fix
npx expo-doctor

# Cek kualitas kode
npx expo lint
npx tsc --noEmit

# Build development client Android via EAS
eas build --profile development --platform android
```

## Dokumentasi Lengkap

- [PPK 101](docs/Pertemuan%201/PPK%20101.md) — membuat project Expo dan setup EAS
- [Mobile Environment Configuration](docs/Pertemuan%201/Mobile%20Environment%20Configuration.md) — opsi koneksi dev (EAS/ADB)
- [Firebase Console](docs/Pertemuan%202/Firebase%20Console.md) — alur lengkap Firebase, berurutan:
    1. [Setup Project Firebase](docs/Pertemuan%202/Setup%20Project%20Firebase.md)
    2. [Setup Cloud Firestore](docs/Pertemuan%202/Setup%20Cloud%20Firestore.md)
    3. [Setup Authentication](docs/Pertemuan%202/Setup%20Authentication.md)
    4. [Hubungkan Firebase ke React Native](docs/Pertemuan%202/Hubungkan%20Firebase%20ke%20React%20Native.md)
    5. [Testing Login dan Logout React Native](docs/Pertemuan%202/Testing%20Login%20dan%20Logout%20React%20Native.md)
- [Model EDOM](docs/Pertemuan%202/Model%20EDOM.md) — download model sentimen untuk `ai/`