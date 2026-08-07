# 📜 Product Requirements Document (PRD) & Business Rules — SimGizi

## 1. Executive Summary & Overview Product
**SimGizi** adalah Sistem Informasi Gizi Balita & Deteksi Dini Stunting Digital berbasis standar **Organisasi Kesehatan Dunia (WHO)** dan **Kementerian Kesehatan Republik Indonesia**. Platform ini dirancang khusus untuk Petugas Kesehatan (Bidan & Kader Posyandu) dalam memantau tumbuh kembang anak, menghitung indeks antropometri Z-Score secara otomatis, menganalisis rekomendasi gizi medik kritis berbasis AI (**Google Gemini 1.5 Flash**), serta menerbitkan laporan resmi posyandu.

---

## 2. Core Technical Architecture & Technology Stack
- **Framework Utama**: Next.js 14 (App Router, Server-side API Routes)
- **Bahasa Pemrograman**: TypeScript (Strict Typing)
- **Database & ORM**: PostgreSQL via Supabase & Prisma ORM
- **Engine AI**: Google Gemini 1.5 Flash API (`generativelanguage.googleapis.com`)
- **Autentikasi**: HTTP-Only Cookie Session (`sim_gizi_session`) & Client State
- **Antarmuka (UI/UX)**: Vanilla Tailwind CSS, Lucide React Icons, Shadcn UI Components, Fullscreen Blurred Backdrop Modals (`bg-black/60 backdrop-blur-md`)

---

## 3. Aturan Bisnis & Kalkulasi Antropometri WHO (Z-Score Rules)

### A. Rumus Standar Kalkulasi Z-Score WHO
Sistem menghitung 3 indikator utama antropometri balita (usia 0–59 bulan):

1. **Z-Score TB/U (Tinggi Badan menurut Umur - Indikator Stunting)**:
   $$\text{Median TB} = 75 + (\text{UsiaBulan} \times 0.75)$$
   $$Z_{\text{TB/U}} = \frac{\text{TinggiBadan} - \text{Median TB}}{3.5}$$

2. **Z-Score BB/U (Berat Badan menurut Umur - Indikator Gizi)**:
   $$\text{Median BB} = 3.5 + (\text{UsiaBulan} \times 0.35)$$
   $$Z_{\text{BB/U}} = \frac{\text{BeratBadan} - \text{Median BB}}{1.5}$$

3. **Z-Score BB/TB (Berat Badan menurut Tinggi Badan - Indikator Wasting)**:
   $$Z_{\text{BB/TB}} = Z_{\text{BB/U}} - Z_{\text{TB/U}}$$

### B. Matriks Klasifikasi Status Gizi & Risiko Medis
| Nilai Indikator Z-Score | Status Gizi Resmi | Level Risiko | Tindakan & Protokol Klinis |
| :--- | :--- | :--- | :--- |
| $Z_{\text{TB/U}} < -3.0\text{ SD}$ | **Stunting** | **KRITIS** | Rujukan Medis Darurat ke Puskesmas + PMT Pemulihan Protein Hewani Intensif |
| $Z_{\text{BB/TB}} < -3.0\text{ SD}$ | **Gizi Buruk** | **KRITIS** | Terapi Nutrisi F-75/F-100 + Rujukan Poli Tumbuh Kembang Anak |
| $-3.0\text{ SD} \le Z_{\text{TB/U}} < -2.0\text{ SD}$ | **Stunting** | **TINGGI** | Konseling Gizi Keluarga + Edukasi Protein Hewani Harian (Telur/Ikan) |
| $-3.0\text{ SD} \le Z_{\text{BB/U}} < -2.0\text{ SD}$ | **Gizi Kurang** | **SEDANG** | Pemberian Makanan Tambahan (PMT) Lokal + Suplemen Zink |
| $-2.0\text{ SD} \le Z \le +2.0\text{ SD}$ | **Normal** | **RENDAH** | Pemantauan Penimbangan Rutin Bulanan Posyandu |

---

## 4. Aturan Prompt & Analisis Kritis Google Gemini AI

Engine AI diintegrasikan via `lib/gemini.ts` dengan aturan prompt klinis ketat:

### Aturan Output Analisis AI:
1. **Kasus Stunting / Gizi Buruk ($Z < -2.0\text{ SD}$)**:
   - Wajib memberikan evaluasi medis tegas mengenai **risiko hambatan perkembangan kognitif/otak permanen**.
   - Wajib menyertakan instruksi langsung: **Rujukan Medis Puskesmas**, **Skrining Penyakit Penyerta (TBC / Cacingan / ISPA)**, serta **Resep PMT Protein Hewani Intensif (2 telur/hari + susu kalori tinggi)**.
2. **Kasus Normal**:
   - Wajib memberikan instruksi spesifik pencegahan *growth faltering* (kegagalan pertumbuhan) sesuai rentang usia balita.
3. **Format**: 2–3 kalimat ilmiah yang tajam, profesional, dan berorientasi pada tindakan medis darurat.

---

## 5. Aturan Alur Kerja UI/UX & Keamanan Aplikasi

1. **Alur Gerbang Utama (Strict Authentication Redirect)**:
   - Pengguna belum terautentikasi yang mengakses domain akar (`/`) atau halaman internal (`/dashboard`, `/rekap`, dll.) **WAJIB langsung dialihkan ke halaman Login (`/login`)**.
   - Kredensial Resmi Petugas: `petugas@posyandu.go.id` / `password123`.

2. **Aturan Modal & Pop-up**:
   - Seluruh elemen pop-up (Detail Balita, Alert AI Kritis, Konfirmasi Hapus Data) **WAJIB** menggunakan lapisan latar belakang redup blur:
     `fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4`

3. **Aturan Mutasi Data (Real-time Latency 0ms)**:
   - **Form Input (`/pencatatan`)**: Menekan tombol **Save** akan menghitung Z-score WHO, memanggil Gemini AI, dan **langsung menampilkan data baru di baris teratas Rekap Data Gizi (`/rekap`)**.
   - **Hapus Data (`/rekap`)**: Menekan **"Ya, Hapus Data"** akan **seketika menghapus baris tabel dari layar secara instan** serta mengembalikan response HTTP `200 OK`.

4. **Aturan Cetak & Ekspor PDF (`/export`)**:
   - Diintegrasikan melalui tombol **"Cetak Laporan"** yang memicu dialog browser `window.print()`.
   - Dilengkapi aturan CSS `@media print` (`overflow: visible !important; position: static !important;`) sehingga dokumen resmi laporan posyandu **tampil 100% utuh tanpa terpotong (no clipping/blank page)** saat dicetak atau disimpan via **"Save as PDF"**.

---
*Dokumen PRD & Rules ini berlaku secara konsisten sebagai acuan pengoperasian dan pengembangan Sistem SimGizi.*
