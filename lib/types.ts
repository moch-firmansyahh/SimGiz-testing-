export interface ChildRecord {
  id: string;
  nama: string;
  nik: string;
  usiaBulan: number;
  jenisKelamin: 'L' | 'P';
  namaOrangTua: string;
  alamat: string;
  beratBadan: number;
  tinggiBadan: number;
  zScoreBB_U: number;
  zScoreTB_U: number;
  zScoreBB_TB: number;
  statusGizi: 'Normal' | 'Gizi Kurang' | 'Gizi Buruk' | 'Stunting' | 'Obesitas' | 'Gizi Lebih';
  tanggalPemeriksaan: string;
  risikoLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
  rekomendasiAI: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface HealthWorker {
  id?: string;
  nama: string;
  nip: string;
  email: string;
  posyandu: string;
  kelurahan: string;
  avatar?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
