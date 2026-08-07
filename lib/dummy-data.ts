export interface ChildRecord {
  id: string;
  nama: string;
  nik: string;
  usiaBulan: number;
  jenisKelamin: 'L' | 'P';
  namaOrangTua: string;
  alamat: string;
  beratBadan: number; // dalam kg
  tinggiBadan: number; // dalam cm
  zScoreBB_U: number; // BB menurut Usia
  zScoreTB_U: number; // TB menurut Usia
  zScoreBB_TB: number; // BB menurut TB
  statusGizi: 'Normal' | 'Gizi Kurang' | 'Gizi Buruk' | 'Stunting';
  tanggalPemeriksaan: string;
  risikoLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
  rekomendasiAI: string;
}

export interface HealthWorker {
  nama: string;
  nip: string;
  role: string;
  posyandu: string;
  kelurahan: string;
  avatar: string;
}

export interface SummaryMetric {
  totalAnak: number;
  anakBerisiko: number;
  pemeriksaanBulanIni: number;
  persentaseNormal: number;
  perubahanTotalAnak: string;
  perubahanBerisiko: string;
  perubahanPemeriksaan: string;
  perubahanPersentase: string;
}

export interface NutritionTrend {
  kategori: string;
  jumlah: number;
  fill: string;
}

export const currentWorker: HealthWorker = {
  nama: "Bidan Sri Wahyuni, S.Tr.Keb",
  nip: "19880412 201403 2 004",
  role: "Petugas Kesehatan Utama",
  posyandu: "Posyandu Melati 03",
  kelurahan: "Cilandak Barat, Jakarta Selatan",
  avatar: "https://images.unsplash.com/photo-1594824813566-78a9c2409f7a?auto=format&fit=crop&q=80&w=200",
};

export const summaryMetrics: SummaryMetric = {
  totalAnak: 148,
  anakBerisiko: 14,
  pemeriksaanBulanIni: 42,
  persentaseNormal: 86.5,
  perubahanTotalAnak: "+6 anak bulan ini",
  perubahanBerisiko: "-2 anak dari bulan lalu",
  perubahanPemeriksaan: "+12 sesi dibanding minggu lalu",
  perubahanPersentase: "+1.8% perbaikan gizi",
};

export const childrenData: ChildRecord[] = [
  {
    id: "ANK-001",
    nama: "Muhammad Arfan",
    nik: "3174011204220001",
    usiaBulan: 28,
    jenisKelamin: "L",
    namaOrangTua: "Siti Rahmawati",
    alamat: "RT 04 / RW 02 No. 12",
    beratBadan: 10.1,
    tinggiBadan: 78.5,
    zScoreBB_U: -2.35,
    zScoreTB_U: -3.10,
    zScoreBB_TB: -1.80,
    statusGizi: "Stunting",
    tanggalPemeriksaan: "2026-08-05",
    risikoLevel: "Kritis",
    rekomendasiAI: "Indikasi Stunting Berat (TB/U < -3 SD). Segera rujuk ke Puskesmas Cilandak untuk intervensi PMT Pemulihan tinggi protein (putih telur & susu khusus) serta cek infeksi kronis.",
  },
  {
    id: "ANK-002",
    nama: "Aisyah Putri Humaira",
    nik: "3174015509230002",
    usiaBulan: 14,
    jenisKelamin: "P",
    namaOrangTua: "Dewi Kurnia",
    alamat: "RT 02 / RW 02 No. 45",
    beratBadan: 7.2,
    tinggiBadan: 71.0,
    zScoreBB_U: -2.45,
    zScoreTB_U: -1.60,
    zScoreBB_TB: -2.80,
    statusGizi: "Gizi Buruk",
    tanggalPemeriksaan: "2026-08-06",
    risikoLevel: "Kritis",
    rekomendasiAI: "Z-score BB/TB < -3 SD mengindikasikan Gizi Buruk. Berikan konseling ASI Eksklusif/MPASI padat gizi, suplementasi Zinc & Vitamin A, serta pemantauan kenaikan BB tiap minggu.",
  },
  {
    id: "ANK-003",
    nama: "Kenzo Rafasya",
    nik: "3174011801240003",
    usiaBulan: 31,
    jenisKelamin: "L",
    namaOrangTua: "Budi Santoso",
    alamat: "RT 01 / RW 03 No. 08",
    beratBadan: 11.4,
    tinggiBadan: 84.0,
    zScoreBB_U: -1.85,
    zScoreTB_U: -2.15,
    zScoreBB_TB: -1.10,
    statusGizi: "Stunting",
    tanggalPemeriksaan: "2026-08-04",
    risikoLevel: "Tinggi",
    rekomendasiAI: "Kategori Stunting Sedang (TB/U -2 s/d -3 SD). Edukasi pola asuh nutrisi kaya protein hewani (ikan, ayam, daging). Jadwalkan pendampingan kader posyandu mingguan.",
  },
  {
    id: "ANK-004",
    nama: "Bilqis Anindya",
    nik: "3174016110220004",
    usiaBulan: 22,
    jenisKelamin: "P",
    namaOrangTua: "Rina Wijaya",
    alamat: "RT 05 / RW 01 No. 22",
    beratBadan: 9.2,
    tinggiBadan: 79.5,
    zScoreBB_U: -2.10,
    zScoreTB_U: -1.40,
    zScoreBB_TB: -2.05,
    statusGizi: "Gizi Kurang",
    tanggalPemeriksaan: "2026-08-06",
    risikoLevel: "Sedang",
    rekomendasiAI: "BB/U & BB/TB menunjukkan Gizi Kurang. Berikan makanan tambahan (PMT) lokal berbasis tempe, telur, dan buah segar. Pantau grafik KMS dalam 30 hari ke depan.",
  },
  {
    id: "ANK-005",
    nama: "Rayyan Azka Prasetya",
    nik: "3174010303210005",
    usiaBulan: 41,
    jenisKelamin: "L",
    namaOrangTua: "Hendra Prasetya",
    alamat: "RT 03 / RW 02 No. 19",
    beratBadan: 15.2,
    tinggiBadan: 98.0,
    zScoreBB_U: 0.15,
    zScoreTB_U: 0.25,
    zScoreBB_TB: 0.10,
    statusGizi: "Normal",
    tanggalPemeriksaan: "2026-08-07",
    risikoLevel: "Rendah",
    rekomendasiAI: "Pertumbuhan anak sangat optimal sesuai standar WHO (z-score dalam batas normal -2 s/d +2 SD). Pertahankan pemberian variasi makanan gizi seimbang.",
  },
  {
    id: "ANK-006",
    nama: "Nabila Zhafira",
    nik: "3174014505230006",
    usiaBulan: 15,
    jenisKelamin: "P",
    namaOrangTua: "Anita Sari",
    alamat: "RT 02 / RW 01 No. 31",
    beratBadan: 9.5,
    tinggiBadan: 77.2,
    zScoreBB_U: 0.05,
    zScoreTB_U: 0.40,
    zScoreBB_TB: -0.20,
    statusGizi: "Normal",
    tanggalPemeriksaan: "2026-08-07",
    risikoLevel: "Rendah",
    rekomendasiAI: "Kondisi gizi normal. Pertahankan asupan ASI dilanjutkan MPASI kaya gizi dan imunisasi rutin di posyandu.",
  },
  {
    id: "ANK-007",
    nama: "Davin Alfarizi",
    nik: "3174012011220007",
    usiaBulan: 21,
    jenisKelamin: "L",
    namaOrangTua: "Agus Supriadi",
    alamat: "RT 06 / RW 03 No. 04",
    beratBadan: 9.8,
    tinggiBadan: 80.0,
    zScoreBB_U: -1.95,
    zScoreTB_U: -2.05,
    zScoreBB_TB: -1.50,
    statusGizi: "Gizi Kurang",
    tanggalPemeriksaan: "2026-08-03",
    risikoLevel: "Sedang",
    rekomendasiAI: "Gizi Kurang berisiko stunting jika tidak ditangani. Berikan konseling kebersihan lingkungan rumah dan kecukupan energi harian anak.",
  },
  {
    id: "ANK-008",
    nama: "Kirana Lashira",
    nik: "3174015002240008",
    usiaBulan: 6,
    jenisKelamin: "P",
    namaOrangTua: "Maya Fitriani",
    alamat: "RT 01 / RW 01 No. 50",
    beratBadan: 7.8,
    tinggiBadan: 66.5,
    zScoreBB_U: 0.30,
    zScoreTB_U: 0.50,
    zScoreBB_TB: 0.15,
    statusGizi: "Normal",
    tanggalPemeriksaan: "2026-08-07",
    risikoLevel: "Rendah",
    rekomendasiAI: "Bayi tumbuh sehat. Dorong ibu melanjutkan ASI Eksklusif hingga usia 6 bulan berlalu dan persiapan MPASI bergizi.",
  },
  {
    id: "ANK-009",
    nama: "Arjuna Wibowo",
    nik: "3174010908200009",
    usiaBulan: 48,
    jenisKelamin: "L",
    namaOrangTua: "Doni Wibowo",
    alamat: "RT 04 / RW 03 No. 77",
    beratBadan: 16.5,
    tinggiBadan: 103.0,
    zScoreBB_U: 0.20,
    zScoreTB_U: 0.10,
    zScoreBB_TB: 0.25,
    statusGizi: "Normal",
    tanggalPemeriksaan: "2026-08-02",
    risikoLevel: "Rendah",
    rekomendasiAI: "Status gizi normal dan tinggi badan ideal sesuai kurva WHO. Anjurkan aktivitas fisik aktif outdoor.",
  },
  {
    id: "ANK-010",
    nama: "Zahra Nafeesa",
    nik: "3174016712210010",
    usiaBulan: 32,
    jenisKelamin: "P",
    namaOrangTua: "Nur Hidayah",
    alamat: "RT 03 / RW 01 No. 11",
    beratBadan: 10.0,
    tinggiBadan: 82.0,
    zScoreBB_U: -2.30,
    zScoreTB_U: -3.20,
    zScoreBB_TB: -1.15,
    statusGizi: "Stunting",
    tanggalPemeriksaan: "2026-08-01",
    risikoLevel: "Kritis",
    rekomendasiAI: "Terindikasi Stunting (TB/U < -3 SD). Masukkan dalam skema prioritas bantuan pangan nutrisi daerah dan intervensi medis puskesmas.",
  },
  {
    id: "ANK-011",
    nama: "Gibran Rakabuming",
    nik: "3174011406220011",
    usiaBulan: 26,
    jenisKelamin: "L",
    namaOrangTua: "Titin Marlina",
    alamat: "RT 02 / RW 03 No. 33",
    beratBadan: 12.5,
    tinggiBadan: 89.0,
    zScoreBB_U: 0.10,
    zScoreTB_U: 0.35,
    zScoreBB_TB: -0.15,
    statusGizi: "Normal",
    tanggalPemeriksaan: "2026-08-06",
    risikoLevel: "Rendah",
    rekomendasiAI: "Status pertumbuhan sangat baik. Jadwal penimbangan berikutnya pada penimbangan posyandu bulan depan.",
  },
  {
    id: "ANK-012",
    nama: "Freya Jayawardana",
    nik: "3174015201230012",
    usiaBulan: 19,
    jenisKelamin: "P",
    namaOrangTua: "Chandra Jayawardana",
    alamat: "RT 05 / RW 02 No. 88",
    beratBadan: 8.9,
    tinggiBadan: 76.0,
    zScoreBB_U: -2.15,
    zScoreTB_U: -2.30,
    zScoreBB_TB: -1.75,
    statusGizi: "Gizi Kurang",
    tanggalPemeriksaan: "2026-08-04",
    risikoLevel: "Sedang",
    rekomendasiAI: "Indikasi Gizi Kurang ringan-sedang. Diperlukan penambahan kalori harian dan pemantauan nafsu makan balita.",
  }
];

export const nutritionTrendData: NutritionTrend[] = [
  { kategori: "Normal", jumlah: 128, fill: "#10b981" },
  { kategori: "Gizi Kurang", jumlah: 10, fill: "#f59e0b" },
  { kategori: "Gizi Buruk", jumlah: 4, fill: "#ef4444" },
  { kategori: "Stunting", jumlah: 6, fill: "#e11d48" },
];

export const highRiskChildren = childrenData.filter(child => 
  child.statusGizi === "Stunting" || child.statusGizi === "Gizi Buruk" || child.statusGizi === "Gizi Kurang"
);
