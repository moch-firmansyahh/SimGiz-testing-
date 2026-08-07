import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { globalChildrenStore, getDynamicSummary, getChartData } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let totalAnak = 0;
    let anakBerisiko = 0;
    let pemeriksaanBulanIni = 0;
    let persentaseNormal = 100;
    let highRiskList: any[] = [];
    let chartData: any[] = [];

    try {
      const [countTotal, countBerisiko, countPemeriksaan, highRisk, countNormal, countKurang, countBuruk, countStunting] = await Promise.all([
        prisma.anak.count(),
        prisma.anak.count({
          where: {
            statusGizi: { in: ["Stunting", "Gizi Buruk", "Gizi Kurang"] },
          },
        }),
        prisma.pemeriksaan.count(),
        prisma.anak.findMany({
          where: {
            statusGizi: { in: ["Stunting", "Gizi Buruk", "Gizi Kurang"] },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.anak.count({ where: { statusGizi: "Normal" } }),
        prisma.anak.count({ where: { statusGizi: "Gizi Kurang" } }),
        prisma.anak.count({ where: { statusGizi: "Gizi Buruk" } }),
        prisma.anak.count({ where: { statusGizi: "Stunting" } }),
      ]);

      totalAnak = countTotal;
      anakBerisiko = countBerisiko;
      pemeriksaanBulanIni = countPemeriksaan;
      highRiskList = highRisk;

      if (totalAnak > 0) {
        chartData = [
          { kategori: "Normal", jumlah: countNormal, fill: "#10b981" },
          { kategori: "Gizi Kurang", jumlah: countKurang, fill: "#f59e0b" },
          { kategori: "Gizi Buruk", jumlah: countBuruk, fill: "#ef4444" },
          { kategori: "Stunting", jumlah: countStunting, fill: "#e11d48" },
        ];
        const normalCount = totalAnak - anakBerisiko;
        persentaseNormal = parseFloat(((normalCount / totalAnak) * 100).toFixed(1));
      }
    } catch (dbErr) {
      console.warn("GET /api/summary DB lookup fallback:", dbErr);
    }

    // Fallback high risk list & chart data from global store if DB was empty
    const storeHighRisk = globalChildrenStore.filter(
      (c) => c.statusGizi && c.statusGizi !== "Normal"
    );

    const finalHighRiskList = highRiskList.length > 0 ? highRiskList : storeHighRisk;
    const finalChartData = chartData.length > 0 ? chartData : getChartData();
    const storeSummary = getDynamicSummary();

    const summary = {
      totalAnak: totalAnak || storeSummary.totalAnak,
      anakBerisiko: totalAnak ? anakBerisiko : storeSummary.anakBerisiko,
      pemeriksaanBulanIni: totalAnak ? pemeriksaanBulanIni : storeSummary.pemeriksaanBulanIni,
      persentaseNormal: totalAnak ? persentaseNormal : storeSummary.persentaseNormal,
    };

    return NextResponse.json({
      success: true,
      summary,
      highRiskList: finalHighRiskList,
      chartData: finalChartData,
    });
  } catch (error) {
    console.error("GET /api/summary Error:", error);
    const storeHighRisk = globalChildrenStore.filter(
      (c) => c.statusGizi && c.statusGizi !== "Normal"
    );

    return NextResponse.json({
      success: true,
      summary: getDynamicSummary(),
      highRiskList: storeHighRisk,
      chartData: getChartData(),
    });
  }
}
