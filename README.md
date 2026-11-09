# Uangku

Aplikasi catatan keuangan pribadi yang simpel. Gratis, tanpa iklan, bisa offline, dan **tidak wajib daftar**.
Berbentuk **web app (PWA)**, jadi bisa dipasang di **Android** maupun **iPhone** tanpa Play Store / App Store.

👉 **Buka:** <https://doniahmadpermana-commits.github.io/uangku/>

## Cara pakai
1. Buka alamat di atas.
2. Ikuti perkenalan singkat: pilih di mana uangmu disimpan (Cash, BCA, GoPay, …) dan isi saldonya.
3. Tekan **Keluar** / **Masuk** setiap ada uang keluar atau masuk. Selesai.

**Pasang di layar utama** supaya seperti aplikasi biasa:
- **Android (Chrome):** menu ⋮ → **Install app / Tambahkan ke layar utama**.
- **iPhone (Safari):** tombol **Share** ⬆ → **Add to Home Screen**.

## Fitur
- Catat pengeluaran & pemasukan dalam beberapa ketukan (jumlah, kategori, dompet, catatan)
- **Dompet**: bank, e-wallet, uang tunai — saldo masing-masing & total uang langsung kelihatan
- **Pindah uang** antar dompet (mis. tarik tunai, top up e-wallet) — tidak dihitung sebagai pengeluaran
- Kategori bawaan + **kategori sendiri**
- Riwayat dengan pencarian & filter, ketuk catatan untuk ubah / hapus
- Laporan bulanan per kategori, budget bulanan
- Backup / pulihkan (`.json`) dan export ke Excel (`.csv`)
- **Akun opsional** (email + password): data aman di cloud & sama di semua HP yang masuk
- Mode gelap otomatis

Tanpa akun, data tersimpan di HP itu saja. Dengan akun, data yang sudah dicatat ikut terunggah saat
mendaftar, dan setiap akun hanya bisa membaca datanya sendiri (dijaga oleh [`firestore.rules`](firestore.rules)).

## Untuk developer
- Semua kode ada di `index.html` (tanpa build step). Dideploy otomatis ke GitHub Pages oleh
  `.github/workflows/pages.yml` setiap push.
- Kalau mengubah file, naikkan versi `CACHE` di `sw.js` supaya HP mengambil versi terbaru
  (halaman otomatis dimuat ulang sekali saat versi baru aktif).
- Firebase (project `moneysalsa-5a3125`): Auth Email/Password + Firestore `asia-southeast2`.
  Konfigurasi web ada di `firebase-config.js` (memang boleh publik). Set ke `null` untuk mode tanpa akun saja.
  Deploy rules / pengaturan auth: `firebase deploy --only firestore:rules,auth`.
- SDK Firebase (v12.19.0) disimpan di `vendor/firebase/` dan font Plus Jakarta Sans (OFL) di `vendor/fonts/`
  supaya bisa di-cache untuk offline.
- Uji lokal dengan emulator: `firebase emulators:start --only auth,firestore --project demo-moneysalsa` lalu set
  `window.__MONEYSALSA_EMULATOR__ = true` sebelum aplikasi dimuat.

## Biaya
- GitHub Pages: gratis untuk repo publik.
- Firebase paket Spark: gratis (50.000 baca & 20.000 tulis per hari, 1 GB data). Kalau penggunanya
  sudah sangat banyak, batas ini bisa tercapai — pantau di Firebase Console → Usage.
