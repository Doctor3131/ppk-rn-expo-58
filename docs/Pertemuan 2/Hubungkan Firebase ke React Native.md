# Hubungkan Firebase ke React Native

Panduan ini mendaftarkan aplikasi Android React Native/Expo ke Firebase dan memasang file konfigurasi project. Tujuannya agar native Firebase SDK pada aplikasi mengarah ke project Firebase yang benar.

Contoh dan screenshot di bawah menggunakan aplikasi Android.

1. Dari **Project settings**, pilih untuk menambahkan aplikasi Android.
   ![img/firebase-settings-daftarkan-aplikasi.png](img/firebase-settings-daftarkan-aplikasi.png)
   > **Gambar:** Bagian aplikasi pada Project settings. Pilih ikon Android untuk mendaftarkan aplikasi Android.
2. Masukkan Android package name. Untuk project Expo pada screenshot, nilainya diambil dari `android.package` di `app.json`.
   ![img/react-native-form-daftar-android.png](img/react-native-form-daftar-android.png)
   > **Gambar:** Form registrasi Android. Nilai package name harus sama persis dengan ID aplikasi Android di project.

   ![img/react-native-app-json-package-ditandai.png](img/react-native-app-json-package-ditandai.png)
   > **Gambar:** Contoh nilai `android.package` yang perlu disalin ke Firebase Console saat registrasi.
3. Daftarkan aplikasi, unduh `google-services.json`, lalu letakkan file di root project.
   ![img/react-native-google-services-di-root-project.png](img/react-native-google-services-di-root-project.png)
 
4. Tambahkan konfigurasi `googleServicesFile` di bagian `android` pada `app.json`, kemudian lanjutkan langkah berikutnya di Firebase Console.
   ![img/react-native-app-json-google-services-file.png](img/react-native-app-json-google-services-file.png)
   ![img/react-native-app-json-konfigurasi-akhir.png](img/react-native-app-json-konfigurasi-akhir.png)
   > **Gambar:** Contoh konfigurasi akhir `app.json`. Setelah perubahan konfigurasi native, jalankan ulang build aplikasi agar perubahan diterapkan.
