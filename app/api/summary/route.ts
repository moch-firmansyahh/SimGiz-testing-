import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDynamicSummary } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let totalAnak = 0;
    let anakBerisiko = 0;
    let pemeriksaanBulanIni = 0;
    let persentaseNormal = 100;

    try {
      totalAnak = await prisma.anak.count();
      anakBerisiko = await prisma.anak.count({
        where: {
          statusGizi: {
            in: ["Stunting", "Gizi Buruk", "Gizi Kurang"],
          },
        },
      });
      pemeriksaanBulanIni = await prisma.pemeriksaan.count();

      const normalCount = totalAnak - anakBerisiko;
      persentaseNormal =
        totalAnak > 0 ? parseFloat(((normalCount / totalAnak) * 100).toFixed(1)) : 100;
    } catch (dbErr) {
      console.warn("GET /api/summary DB lookup fallback:", dbErr);
    }

    // Fallback to store dynamic metrics if DB returned zero
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
    });
  } catch (error) {
    console.error("GET /api/summary Error:", error);
    return NextResponse.json({
      success: true,
      summary: getDynamicSummary(),
    });
  }
}
