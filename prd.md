# PRD - SimGizi
Sistem Informasi Gizi Anak dan Deteksi Dini Stunting

## 1. Overview Produk

SimGizi adalah aplikasi berbasis web yang membantu petugas posyandu melakukan deteksi dini gizi buruk dan stunting pada anak usia 0 sampai 59 bulan. Aplikasi ini menggantikan proses pencatatan dan perhitungan manual (KMS, kalkulasi Z-score manual) dengan sistem digital yang cepat, akurat, dan terintegrasi AI.

Scope pengerjaan saat ini: frontend saja, menggunakan dummy data. Belum terhubung ke backend atau database asli.

## 2. Target Pengguna

- Petugas Kesehatan (posyandu) sebagai pengguna utama aktif
- Orang Tua/Wali Balita sebagai penerima manfaat tidak langsung (bukan pengguna sistem)

## 3. Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- lucide-react untuk ikon
- recharts untuk grafik

## 4. Struktur Fitur (Functional Requirements)

| Kode | Nama Fitur | Deskripsi |
|------|-----------|-----------|
| FR-01 | Login | Petugas masuk ke sistem menggunakan akun resmi yang terdaftar |
| FR-02 | Pencatatan Data Anak | Tambah, ubah, hapus data anak (nama, usia, jenis kelamin, berat badan, tinggi badan) per sesi pengukuran |
| FR-03 | Perhitungan Z-Score Otomatis | Sistem menghitung Z-score (BB/U, TB/U, BB/TB) otomatis sesuai standar WHO |
| FR-04 | Rekomendasi AI | Sistem menghasilkan rekomendasi tindak lanjut berbasis hasil Z-score |
| FR-05 | Rekap Data Gizi | Menampilkan rekap data gizi anak yang telah tercatat |
| FR-06 | Peringatan Dini (Alert) | Menandai anak yang terindikasi berisiko gizi buruk/stunting |
| FR-07 | Riwayat Pemeriksaan | Petugas dapat melihat kembali riwayat pemeriksaan tiap anak |
| FR-08 | Export Laporan | Unduh rekap data gizi dalam format PDF |

## 5. Halaman yang Dikerjakan (Frontend Only)

### 5.1 Halaman Dashboard (prioritas utama)

Route: `app/dashboard/page.tsx`

Komponen yang dibutuhkan, ditaruh di `components/dashboard/`:
- `Header.tsx`
- `Sidebar.tsx`
- `SummaryCard.tsx`
- `AlertList.tsx`
- `TrendChart.tsx`

Isi halaman dashboard:

**a. Header**
- Nama aplikasi "SimGizi" di kiri
- Info petugas yang login (nama + avatar kecil) di kanan
- Tombol logout

**b. Ringkasan Cepat (Summary Cards)**
Grid responsif berisi 4 card:
- Total anak terdaftar
- Jumlah anak berisiko (alert aktif)
- Jumlah pemeriksaan bulan ini
- Persentase anak dengan status gizi normal

**c. Daftar Peringatan Dini (Alert List)**
List anak yang terindikasi berisiko, tiap item menampilkan:
- Nama anak
- Usia
- Status gizi terakhir (pakai Badge, warna sesuai tingkat risiko: merah untuk gizi buruk/stunting, kuning untuk gizi kurang, hijau untuk normal)
- Tombol lihat detail

**d. Grafik Tren Gizi**
Bar chart menggunakan recharts, menampilkan jumlah anak per kategori status gizi (normal, gizi kurang, gizi buruk, stunting)

**e. Sidebar Navigasi**
Link ke halaman:
- Dashboard
- Pencatatan Data Anak
- Rekap Data Gizi
- Riwayat Pemeriksaan
- Export Laporan

Setiap menu pakai ikon dari lucide-react.

### 5.2 Halaman Lain (jika diminta menyusul)

- Pencatatan Data Anak: form tambah/edit data anak
- Rekap Data Gizi: tabel/list seluruh data anak
- Riwayat Pemeriksaan: detail riwayat per anak
- Export Laporan: halaman untuk generate/unduh PDF

## 6. Dummy Data

Taruh di `lib/dummy-data.ts`, mencakup:
- Data petugas yang sedang login (nama, avatar)
- List anak (minimal 10 data), dengan atribut: nama, usia, jenis kelamin, berat badan, tinggi badan, Z-score, status gizi, tanggal pemeriksaan terakhir
- Data ringkasan untuk summary card
- Data untuk grafik tren (jumlah anak per kategori status gizi)

## 7. Gaya Desain (Design Guidelines)

- Bersih, minimalis, profesional
- Warna utama hijau dan putih (tema kesehatan)
- Card dengan sudut rounded dan shadow lembut
- Responsif untuk desktop dan tablet
- Badge warna status gizi:
  - Normal: hijau
  - Gizi Kurang: kuning
  - Gizi Buruk / Stunting: merah

## 8. Batasan (Out of Scope untuk saat ini)

- Tidak ada integrasi backend/API asli
- Tidak ada autentikasi asli (login cukup UI saja, tanpa validasi ke database)
- Tidak ada penyimpanan data permanen, semua dari dummy data
- Model AI belum diimplementasikan, rekomendasi AI cukup ditampilkan sebagai dummy text

## 9. Prompt Siap Pakai

Berikut prompt yang bisa langsung dipakai untuk generate kode:

```
Buatkan halaman dashboard untuk aplikasi kesehatan bernama SimGizi menggunakan Next.js 14 (App Router), TypeScript, Tailwind CSS, dan Shadcn UI.

Konteks aplikasi: SimGizi adalah aplikasi untuk petugas posyandu dalam mendeteksi dini gizi buruk dan stunting pada anak usia 0 sampai 59 bulan. Dashboard ini adalah halaman pertama yang muncul setelah petugas login.

Struktur file:
- app/dashboard/page.tsx sebagai halaman utama
- components/dashboard/ untuk komponen Header, Sidebar, SummaryCard, AlertList, TrendChart
- lib/dummy-data.ts untuk seluruh data dummy

Layout dashboard terdiri dari:

1. Header: nama aplikasi SimGizi di kiri, info petugas yang login (nama dan avatar kecil) di kanan, tombol logout.

2. Ringkasan cepat berupa 4 summary card berjajar (grid responsif): total anak terdaftar, jumlah anak berisiko, jumlah pemeriksaan bulan ini, persentase anak status gizi normal.

3. Daftar peringatan dini: list anak berisiko gizi buruk/stunting, tiap item menampilkan nama anak, usia, status gizi terakhir (Badge dengan warna sesuai risiko), dan tombol lihat detail.

4. Grafik tren gizi memakai recharts, bar chart jumlah anak per kategori status gizi (normal, gizi kurang, gizi buruk, stunting).

5. Sidebar navigasi kiri berisi link ke Dashboard, Pencatatan Data Anak, Rekap Data Gizi, Riwayat Pemeriksaan, Export Laporan, tiap menu pakai ikon dari lucide-react.

Gaya desain: bersih, minimalis, profesional, warna utama hijau dan putih. Card rounded dengan shadow lembut. Responsif untuk desktop dan tablet.

Gunakan data dummy dari lib/dummy-data.ts untuk mengisi seluruh komponen.
```
