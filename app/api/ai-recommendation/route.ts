import { NextResponse } from "next/server";
import { generateAIRecommendation } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nama,
      usiaBulan,
      beratBadan,
      tinggiBadan,
      zScoreBB_U,
      zScoreTB_U,
      zScoreBB_TB,
      statusGizi,
    } = body;

    const bb = parseFloat(beratBadan);
    const tb = parseFloat(tinggiBadan);
    const usia = parseInt(usiaBulan);

    if (isNaN(bb) || isNaN(tb) || isNaN(usia)) {
      return NextResponse.json(
        { error: "Data pengukuran fisik tidak valid." },
        { status: 400 }
      );
    }

    const rekomendasiAI = await generateAIRecommendation({
      nama,
      usiaBulan: usia,
      beratBadan: bb,
      tinggiBadan: tb,
      zScoreBB_U: zScoreBB_U ?? 0,
      zScoreTB_U: zScoreTB_U ?? 0,
      zScoreBB_TB: zScoreBB_TB ?? 0,
      statusGizi: statusGizi || "Normal",
    });

    return NextResponse.json({ success: true, rekomendasiAI });
  } catch (error) {
    console.error("POST /api/ai-recommendation Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses rekomendasi AI." },
      { status: 500 }
    );
  }
}
