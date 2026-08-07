import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { globalChildrenStore, getDynamicSummary } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let totalAnak = 0;
    let anakBerisiko = 0;
    let pemeriksaanBulanIni = 0;
    let persentaseNormal = 100;
    let highRiskList: any[] = [];

    try {
      [totalAnak, anakBerisiko, pemeriksaanBulanIni, highRiskList] = await Promise.all([
        prisma.anak.count(),
        prisma.anak.count({
          where: {
            statusGizi: {
              in: ["Stunting", "Gizi Buruk", "Gizi Kurang"],
            },
          },
        }),
        prisma.pemeriksaan.count(),
        prisma.anak.findMany({
          where: {
            statusGizi: {
              in: ["Stunting", "Gizi Buruk", "Gizi Kurang"],
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      const normalCount = totalAnak - anakBerisiko;
      persentaseNormal =
        totalAnak > 0 ? parseFloat(((normalCount / totalAnak) * 100).toFixed(1)) : 100;
    } catch (dbErr) {
      console.warn("GET /api/summary DB lookup fallback:", dbErr);
    }

    // Fallback high risk list from global store if DB list was empty
    const storeHighRisk = globalChildrenStore.filter(
      (c) => c.statusGizi && c.statusGizi !== "Normal"
    );

    const finalHighRiskList = highRiskList.length > 0 ? highRiskList : storeHighRisk;
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
    });
  }
}
