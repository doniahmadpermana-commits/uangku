# Uangku — catatan untuk Claude Code

Aplikasi catatan keuangan pribadi (PWA) untuk umum, berbahasa Indonesia. Live di
<https://doniahmadpermana-commits.github.io/uangku/>. Pemilik: Doni (komunikasi santai, bahasa Indonesia).

## Struktur
- `index.html` — **seluruh aplikasi** (HTML + CSS + JS modul dalam satu file, tanpa build step / npm).
- `privasi.html` — Kebijakan Privasi (halaman statis, gaya sama dengan app).
- `sw.js` — service worker untuk offline. **Naikkan `CACHE`** (sekarang `uangku-v2`) setiap kali file app berubah,
  dan tambahkan file baru ke `ASSETS`. Halaman otomatis reload sekali saat SW baru aktif.
- `firebase-config.js` — config web Firebase (boleh publik). `null` = mode tanpa akun saja.
- `firebase.json`, `.firebaserc`, `firestore.rules` — konfigurasi Firebase (project `moneysalsa-5a3125`).
- `vendor/firebase/` — Firebase JS SDK v12.19.0 (di-vendor supaya bisa offline). `vendor/fonts/` — Plus Jakarta Sans (OFL).
- `icons/` — `icon.svg` sumber; PNG 180/192/512 dirender dari SVG (full-bleed, tanpa sudut bulat, untuk maskable).
- `.github/workflows/pages.yml` — deploy ke GitHub Pages setiap push ke `main` atau `claude/ecstatic-mccarthy-nz8a88`
  (branch default repo saat ini adalah `claude/ecstatic-mccarthy-nz8a88`).

## Model data
- Tanpa akun: `localStorage['moneysalsa.v1'] = { tx, wallets, cats, budget }`. Kunci `moneysalsa.*` sengaja
  dipertahankan dari nama lama supaya data lama tetap terbaca — jangan diganti tanpa migrasi.
- Dengan akun: Firestore `users/{uid}/tx/{id}`, `users/{uid}/wallets/{id}`, `users/{uid}/cats/{id}`, dan field
  `budget` di `users/{uid}`. Rules: tiap user hanya baca/tulis `users/{uid}/**` miliknya.
- Field yang disimpan dibatasi whitelist `COLS` di `index.html` — tambah field baru di situ juga.
- `tx.type`: `out` (keluar), `in` (masuk), `tr` (pindah antar dompet: `wallet` = asal, `to` = tujuan; tidak dihitung
  sebagai pemasukan/pengeluaran). `tx.wallet` opsional untuk in/out.
- Saldo dompet = `initial` + masuk − keluar − pindah keluar + pindah masuk (semua waktu, bukan per bulan).
  Form dompet meminta **saldo sekarang**, lalu disimpan sebagai `initial = saldo sekarang − efek transaksi`.
- Kategori bawaan ada di `CATS` (id stabil, jangan diubah); kategori buatan user di `db.cats`.

## Alur penting
- Guest-first: app langsung jalan tanpa akun; perkenalan (onboarding) 3 langkah pilih dompet + saldo.
- Akun opsional (email/password, daftar sendiri). Saat **daftar**, data lokal diunggah ke akun; saat **masuk** ke
  akun lama, data lokal hanya diunggah jika ada transaksi (supaya dompet onboarding tidak dobel). Setelah masuk,
  localStorage dikosongkan; saat keluar, HP itu kosong lagi.
- Verifikasi email dikirim saat daftar (tidak memblokir pemakaian). Hapus akun: hapus semua dokumen cloud lalu
  `user.delete()`; butuh login < 5 menit terakhir.
- Pengingat backup muncul di Beranda jika ada catatan dan > 30 hari sejak backup (× = tunda 7 hari).

## Konvensi
- Teks UI: bahasa Indonesia santai ("kamu"), singkat, ramah untuk orang awam.
- Desain: token warna di `:root` (+ dark mode via `prefers-color-scheme`), font Jakarta, ikon SVG `<symbol>` di atas
  `<body>`, emoji untuk kategori/dompet. Mobile-first, lebar maks 520px.
- Jaga tetap tanpa dependensi/build. Jangan tambah analitik/pelacak (dijanjikan di Kebijakan Privasi).
- Kalau mengubah perilaku data/privasi, perbarui `privasi.html` (dan tanggal berlakunya).

## Menguji
- Jalankan lokal: `python3 -m http.server 8765` di root repo, buka `http://localhost:8765/`.
- Mode akun dengan emulator: `firebase emulators:start --only auth,firestore --project demo-moneysalsa`, lalu
  sebelum app dimuat set `window.__MONEYSALSA_EMULATOR__ = true` dan config dummy dengan `projectId: "demo-moneysalsa"`
  (mis. lewat Playwright `page.route('**/firebase-config.js', ...)`). Link verifikasi/reset ada di
  `http://127.0.0.1:9099/emulator/v1/projects/demo-moneysalsa/oobCodes`.
- Pengujian sebelumnya dilakukan dengan Playwright (alur onboarding, catat keluar/masuk/pindah, saldo, edit,
  daftar/masuk dua "HP", verifikasi, hapus akun) di viewport 390×844, mode terang & gelap.

## Firebase
- Project `moneysalsa-5a3125` (paket Spark gratis), milik akun Google Doni (login dulu: `firebase login`).
- Auth Email/Password aktif; authorized domain `doniahmadpermana-commits.github.io` sudah ditambahkan.
- Firestore `(default)` di `asia-southeast2`. Deploy rules/auth: `firebase deploy --only firestore:rules,auth`.

## Status terakhir & yang belum beres (per 9 Nov 2026)
- Terakhir: commit "Add email verification, monthly backup reminder, privacy policy" sudah di-push dan dideploy.
- [ ] Doni perlu set **Public-facing name = Uangku** di Firebase Console → Project settings (dipakai di email
      verifikasi/reset; tidak bisa lewat CLI).
- [ ] Doni perlu membaca & menyetujui isi `privasi.html` (ditulis atas nama "pengelola Uangku"; kontak = GitHub Issues).
- [ ] Satu akun lama dari versi MoneySalsa masih ada di Firebase Auth — hapus hanya jika Doni minta.
- [ ] Alamat lama `/moneysalsa/` sudah 404 sejak repo di-rename; belum ada halaman pengalihan.
- [ ] Opsional: ganti branch default ke `main` (workflow sudah mendukung `main`).
- Ide yang pernah ditawarkan tapi belum dibuat: kolom "ulangi password" saat daftar, biaya admin untuk transfer,
  saldo awal minus (kartu kredit) di form dompet.
