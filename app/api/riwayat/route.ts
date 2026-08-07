import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    const [totalItems, history] = await Promise.all([
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

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/riwayat Error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat mengambil riwayat pemeriksaan." },
      { status: 500 }
    );
  }
}
