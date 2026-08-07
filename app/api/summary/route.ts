import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalAnak = await prisma.anak.count();
    const anakBerisiko = await prisma.anak.count({
      where: {
        statusGizi: { in: ["Stunting", "Gizi Buruk", "Gizi Kurang"] },
      },
    });
    const normalCount = await prisma.anak.count({
      where: { statusGizi: "Normal" },
    });
    const giziKurangCount = await prisma.anak.count({
      where: { statusGizi: "Gizi Kurang" },
    });
    const giziBurukCount = await prisma.anak.count({
      where: { statusGizi: "Gizi Buruk" },
    });
    const stuntingCount = await prisma.anak.count({
      where: { statusGizi: "Stunting" },
    });

    const pemeriksaanCount = await prisma.pemeriksaan.count();
    const persentaseNormal = totalAnak > 0 ? parseFloat(((normalCount / totalAnak) * 100).toFixed(1)) : 0;

    const highRiskList = await prisma.anak.findMany({
      where: {
        statusGizi: { in: ["Stunting", "Gizi Buruk", "Gizi Kurang"] },
      },
      orderBy: { createdAt: "desc" },
    });

    const trendData = [
      { kategori: "Normal", jumlah: normalCount, fill: "#10b981" },
      { kategori: "Gizi Kurang", jumlah: giziKurangCount, fill: "#f59e0b" },
      { kategori: "Gizi Buruk", jumlah: giziBurukCount, fill: "#ef4444" },
      { kategori: "Stunting", jumlah: stuntingCount, fill: "#e11d48" },
    ];

    return NextResponse.json({
      success: true,
      summary: {
        totalAnak,
        anakBerisiko,
        pemeriksaanBulanIni: pemeriksaanCount,
        persentaseNormal,
        perubahanTotalAnak: "+6 anak bulan ini",
        perubahanBerisiko: "-2 anak dari bulan lalu",
        perubahanPemeriksaan: "+12 sesi dibanding minggu lalu",
        perubahanPersentase: "+1.8% perbaikan gizi",
      },
      highRiskList,
      trendData,
    });
  } catch (error) {
    console.error("GET /api/summary Error:", error);
    return NextResponse.json({ error: "Terjadi kendala saat mengambil data ringkasan." }, { status: 500 });
  }
}
