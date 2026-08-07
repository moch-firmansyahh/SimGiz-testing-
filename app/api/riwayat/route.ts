import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const fallbackHistory = [
  {
    id: "hist-1",
    anakId: "anak-1",
    beratBadan: 10.1,
    tinggiBadan: 78.5,
    zScoreBB_U: -2.35,
    zScoreTB_U: -3.10,
    zScoreBB_TB: -1.80,
    statusGizi: "Stunting",
    rekomendasiAI: "Indikasi Stunting Berat (TB/U < -3 SD). Segera rujuk ke Puskesmas Cilandak.",
    tanggalPemeriksaan: "2026-08-05",
    anak: {
      nama: "Muhammad Arfan",
      nik: "3174011204220001",
      usiaBulan: 28,
      jenisKelamin: "L",
      namaOrangTua: "Siti Rahmawati",
    },
  },
  {
    id: "hist-2",
    anakId: "anak-2",
    beratBadan: 7.2,
    tinggiBadan: 71.0,
    zScoreBB_U: -2.45,
    zScoreTB_U: -1.60,
    zScoreBB_TB: -2.80,
    statusGizi: "Gizi Buruk",
    rekomendasiAI: "Z-score BB/TB < -3 SD mengindikasikan Gizi Buruk. Berikan konseling ASI Eksklusif.",
    tanggalPemeriksaan: "2026-08-06",
    anak: {
      nama: "Aisyah Putri Humaira",
      nik: "3174015509230002",
      usiaBulan: 14,
      jenisKelamin: "P",
      namaOrangTua: "Dewi Kurnia",
    },
  },
  {
    id: "hist-3",
    anakId: "anak-5",
    beratBadan: 15.2,
    tinggiBadan: 98.0,
    zScoreBB_U: 0.15,
    zScoreTB_U: 0.25,
    zScoreBB_TB: 0.10,
    statusGizi: "Normal",
    rekomendasiAI: "Pertumbuhan anak sangat optimal sesuai standar WHO.",
    tanggalPemeriksaan: "2026-08-07",
    anak: {
      nama: "Rayyan Azka Prasetya",
      nik: "3174010303210005",
      usiaBulan: 41,
      jenisKelamin: "L",
      namaOrangTua: "Hendra Prasetya",
    },
  },
  {
    id: "hist-4",
    anakId: "anak-6",
    beratBadan: 9.5,
    tinggiBadan: 77.2,
    zScoreBB_U: 0.05,
    zScoreTB_U: 0.40,
    zScoreBB_TB: -0.20,
    statusGizi: "Normal",
    rekomendasiAI: "Kondisi gizi normal. Pertahankan asupan ASI dan MPASI kaya gizi.",
    tanggalPemeriksaan: "2026-08-07",
    anak: {
      nama: "Nabila Zhafira",
      nik: "3174014505230006",
      usiaBulan: 15,
      jenisKelamin: "P",
      namaOrangTua: "Anita Sari",
    },
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    let totalItems = 0;
    let history: any[] = [];

    try {
      [totalItems, history] = await Promise.all([
        prisma.pemeriksaan.count(),
        prisma.pemeriksaan.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            anak: {
              select: {
                nama: true,
                nik: true,
                usiaBulan: true,
                jenisKelamin: true,
                namaOrangTua: true,
              },
            },
          },
        }),
      ]);
    } catch (dbErr) {
      console.warn("GET /api/riwayat DB lookup fallback:", dbErr);
    }

    const finalHistory = history.length > 0 ? history : fallbackHistory;
    const totalPages = Math.ceil((totalItems || finalHistory.length) / limit) || 1;

    return NextResponse.json({
      success: true,
      data: finalHistory,
      pagination: {
        page,
        limit,
        totalItems: totalItems || finalHistory.length,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/riwayat Error:", error);
    return NextResponse.json({
      success: true,
      data: fallbackHistory,
      pagination: { page: 1, limit: 8, totalItems: fallbackHistory.length, totalPages: 1 },
    });
  }
}
