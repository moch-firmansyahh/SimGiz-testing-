import { PrismaClient } from "@prisma/client";
import { globalChildrenStore } from "../lib/store";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 36 complete balita records to Supabase PostgreSQL database...");

  // 1. Seed Petugas Kesehatan
  const petugas = await prisma.petugas.upsert({
    where: { email: "petugas@posyandu.go.id" },
    update: {},
    create: {
      email: "petugas@posyandu.go.id",
      password: "password123",
      nama: "Bidan Sri Wahyuni, S.Tr.Keb",
      nip: "19880412 201403 2 004",
      posyandu: "Posyandu Melati 03",
      kelurahan: "Cilandak Barat, Jakarta Selatan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SriWahyuni",
    },
  });

  console.log(`Petugas seeded: ${petugas.nama} (${petugas.email})`);

  // 2. Seed 36 Complete Balita Records
  for (const child of globalChildrenStore) {
    const createdAnak = await prisma.anak.upsert({
      where: { nik: child.nik },
      update: child,
      create: child,
    });

    await prisma.pemeriksaan.create({
      data: {
        anakId: createdAnak.id,
        beratBadan: child.beratBadan,
        tinggiBadan: child.tinggiBadan,
        zScoreBB_U: child.zScoreBB_U,
        zScoreTB_U: child.zScoreTB_U,
        zScoreBB_TB: child.zScoreBB_TB,
        statusGizi: child.statusGizi,
        rekomendasiAI: child.rekomendasiAI,
        tanggalPemeriksaan: child.tanggalPemeriksaan,
      },
    });
  }

  console.log(`Successfully seeded ${globalChildrenStore.length} child records to Supabase!`);
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
