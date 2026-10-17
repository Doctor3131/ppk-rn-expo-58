# Mobile Environment Configuration

Sebagaimana ketika web development kita bisa langsung mengecek perubahan kode pada browser via development setup, pada mobile (terutama react native) kita juga bisa membuat aplikasi untuk **hot reload** yang terkoneksi dengan kode kita di desktop (server).

Berikut list cara setup mobile development pada dokumentasi ini:
- [#RN Configuration dengan EAS](#rn-configuration-dengan-eas)
	- [#Catatan](#catatan)
	- [#Trivia](#trivia)
	- [#Useful command (Commonly Used)](#useful-command-commonly-used)
	- [#Dokumentasi](#dokumentasi)
- [#RN Configuration Over ADB](#rn-configuration-over-adb)
	- [#Catatan](#catatan)
	- [#Trivia](#trivia)
	- [#Useful command (Commonly Used)](#useful-command-commonly-used)
	- [#Dokumentasi](#dokumentasi)

---
## RN Configuration dengan EAS

(20 - 30 menit setup)

Expo menawarkan dua cara untuk configurasi antara mobile dan desktop, yang dimana nantinya akan terinstal aplikasi di mobile sebagai development environment. Keduanya yaitu Expo Go dan Development Build. Expo Go menang di kemudahan setup nya, tetapi tidak bisa menambah library di luar config Expo. Oleh karena itu kita menggunakan opsi Development Build via EAS (Expo Aplications Services). Pastikan memilih Android / IOS device dengan opsi **Development build**.

https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build

### Catatan
- pastikan baca setup di terminal nya. ada beberapa user promt. enter saja / ketik y
- pastikan handphone dan laptop ada di satu jaringan yang sama (i.e. wifi yang sama)
- pastikan port yang digunakan rn dibuka (biasanya default di blokir firewall)
- karena membuka port pada desktop, maka rentan untuk serangan. Selain itu orang lain bisa saja membuka apps yang kita develop (karena share network / over wifi)

### Trivia
- kita bisa menggunakan command berikut untuk menjalankan koneksi ke server i.e. (desktop dan mobile) tanpa harus  berada di satu network yang sama. Throwback nya adalah koneksi hot reload (update dari kode ke development environment) akan terasa lebih lambat:
  ```bash
  # Gunakan QR-code pada mobile agar mempermudah
  # koneksi
  
  npx expo start --tunnel
  ```

### Useful command (Commonly Used)
```bash
# Start dev server
npx expo start

# Start dev server dengan clean cache
npx expo start --clear

# Complete command untuk start app di EAS Build
npx expo start --dev-client
```

### Dokumentasi
#### Expo Landing Page
![Expo landing page](images/Pasted%20image%2020261017223750.png)

#### Expo App Build Succesful
![Expo app build successful](images/Pasted%20image%2020261017224051.png)

---

## RN Configuration Over ADB
(30 - 90 menit setup)

Terdapat dua cara untuk menjalankan via ADB ini, yaitu dengan cable USB dari desktop ke mobile, dan virtualisasi android. Berbeda dengan EAS, cara ini merupakan cara defaut dalam menjalankan react native tanpa framework expo. Kekurangan terbesar nya adalah dibutuhkan resource (ram & disk) yang jauh lebih besar dibanding expo. Hal ini dikarenakan compiling kita lakukan local desktop kita, berbeda dengan expo yang dimana kita menggunakan server mereka untuk compiling.

Berikut merupakan link dokumentasi untuk men-setup nya:
https://reactnative.dev/docs/set-up-your-environment

### Catatan
- Recommended device dengan RAM 16gb atau lebih tinggi
- 10 - 20gb free disk
- Pastikan java 17 se terinstall dan terbaca di terminal (official docs state harus java 17)

### Trivia
- Konsumsi RAM bisa kita tekan dengan tanpa menggunakan virtualisasi android (cable usb ke mobile). Cek bagan **Using a physical device** pada laman di atas
- Jika menggunakan pysical device (poin pertama) opsi AVD (Android Virtual Device) pada saat awal instalasi android studio, bisa kita un-check aja 

### Useful command (Commonly Used)
```bash

```

### Dokumentasi