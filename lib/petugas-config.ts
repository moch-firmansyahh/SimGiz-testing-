export interface HealthWorker {
  id: string;
  nama: string;
  nip: string;
  role: string;
  posyandu: string;
  kelurahan: string;
  avatar: string;
}

export const currentWorker: HealthWorker = {
  id: "petugas-1",
  nama: "Bidan Sri Wahyuni, S.Tr.Keb",
  nip: "19880412 201403 2 004",
  role: "Petugas Kesehatan Utama",
  posyandu: "Posyandu Melati 03",
  kelurahan: "Cilandak Barat, Jakarta Selatan",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SriWahyuni",
};
