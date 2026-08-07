import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { globalChildrenStore } from "@/lib/store";

export const dynamic = "force-dynamic";

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

    // Map store records to history format if database returned empty
    const storeHistory = globalChildrenStore.map((child, index) => ({
      id: `hist-${child.id}`,
      anakId: child.id,
      beratBadan: child.beratBadan,
      tinggiBadan: child.tinggiBadan,
      zScoreBB_U: child.zScoreBB_U,
      zScoreTB_U: child.zScoreTB_U,
      zScoreBB_TB: child.zScoreBB_TB,
      statusGizi: child.statusGizi,
      rekomendasiAI: child.rekomendasiAI,
      tanggalPemeriksaan: child.tanggalPemeriksaan,
      anak: {
        nama: child.nama,
        nik: child.nik,
        usiaBulan: child.usiaBulan,
        jenisKelamin: child.jenisKelamin,
        namaOrangTua: child.namaOrangTua,
      },
    }));

    const finalHistory = history.length > 0 ? history : storeHistory.slice(skip, skip + limit);
    const finalTotalItems = totalItems || storeHistory.length;
    const totalPages = Math.ceil(finalTotalItems / limit) || 1;

    return NextResponse.json({
      success: true,
      data: finalHistory,
      pagination: {
        page,
        limit,
        totalItems: finalTotalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/riwayat Error:", error);

    const storeHistory = globalChildrenStore.map((child) => ({
      id: `hist-${child.id}`,
      anakId: child.id,
      beratBadan: child.beratBadan,
      tinggiBadan: child.tinggiBadan,
      zScoreBB_U: child.zScoreBB_U,
      zScoreTB_U: child.zScoreTB_U,
      zScoreBB_TB: child.zScoreBB_TB,
      statusGizi: child.statusGizi,
      rekomendasiAI: child.rekomendasiAI,
      tanggalPemeriksaan: child.tanggalPemeriksaan,
      anak: {
        nama: child.nama,
        nik: child.nik,
        usiaBulan: child.usiaBulan,
        jenisKelamin: child.jenisKelamin,
        namaOrangTua: child.namaOrangTua,
      },
    }));

    return NextResponse.json({
      success: true,
      data: storeHistory.slice(0, 8),
      pagination: { page: 1, limit: 8, totalItems: storeHistory.length, totalPages: Math.ceil(storeHistory.length / 8) },
    });
  }
}
