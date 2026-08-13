import { formatZScore } from "@/lib/utils";

/**
 * @module gemini
 * @description AI-powered clinical nutrition recommendation engine for SimGizi.
 * Integrates with Google Gemini API to provide evidence-based nutritional assessments
 * following Kemenkes RI & WHO guidelines.
 * @lastUpdated 2026-08-13
 */

/**
 * Generates clinical AI recommendations for child nutritional assessments.
 * Uses Google Gemini API with multi-model fallback (gemini-2.0-flash → gemini-1.5-flash
 * → gemini-2.0-flash-lite → gemini-1.5-pro), or falls back to a parameter-driven
 * local clinical analysis engine if the API is unavailable or rate-limited.
 */
export async function generateAIRecommendation({
  nama,
  usiaBulan,
  beratBadan,
  tinggiBadan,
  zScoreBB_U,
  zScoreTB_U,
  zScoreBB_TB,
  statusGizi,
}: {
  nama?: string;
  usiaBulan: number;
  beratBadan: number;
  tinggiBadan: number;
  zScoreBB_U: number;
  zScoreTB_U: number;
  zScoreBB_TB: number;
  statusGizi: string;
}): Promise<string> {
  const nameLabel = nama && nama.trim() !== "" ? nama.trim() : "Balita";
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    const prompt = `Anda adalah Dokter Spesialis Anak & Konsultan Utama Gizi Kemenkes RI. Berikan analisis klinis medis real-time yang 100% patuh pada Keputusan Menteri Kesehatan RI No. 2/2020 & Pedoman WHO Management of Malnutrition untuk balita berikut:
- Nama: ${nameLabel} (${usiaBulan} Bulan)
- Pengukuran Fisik: BB ${beratBadan} kg, TB ${tinggiBadan} cm
- Z-Score BB/U: ${formatZScore(zScoreBB_U)} | Z-Score TB/U: ${formatZScore(zScoreTB_U)} | Z-Score BB/TB: ${formatZScore(zScoreBB_TB)}
- Diagnosa Status Gizi: ${statusGizi}

Pedoman Diagnostik Klinis Resmi (Kemenkes RI & WHO):
1. Jika Obesitas (BB/TB atau BB/U > +3 SD): Terjadi kelebihan akumulasi lemak ekstrem. Wajib evaluasi komorbiditas kardiovaskular/metabolik, rujuk ke Dokter Spesialis Anak, dan atur restrukturisasi pola makan MPASI/Gizi Seimbang serta aktivitas fisik.
2. Jika Gizi Lebih / Overweight (> +2 SD s/d +3 SD): Risiko obesitas tinggi. Kurangi asupan gula/lemak jenuh, ganti dengan serat & protein murni, serta pantau pertumbuhan bulanan.
3. Jika Stunting (TB/U < -2 SD): Hambatan kronis pertumbuhan tulang. Segera rujuk ke Puskesmas/Spesialis Anak untuk pemindaian penyakit penyerta (TBC/cacingan/ISK) & resepkan PMT tinggi Protein Hewani (1-2 telur/hari, ikan, susu PKMK).
4. Jika Gizi Buruk (BB/TB atau BB/U < -3 SD): Kegawatan gizi akut. Terapkan Protokol 10 Langkah Tata Laksana Gizi Buruk: Fase Stabilisasi (Formula F-75) lanjut Transisi (F-100 / RUTF). Rujuk darurat ke TFC / Puskesmas Rawat Inap.
5. Jika Gizi Kurang (< -2 SD): Defisit energi kronis. Berikan suplemen Zink 10-20 mg/hari selama 14 hari, PMT Berbasis Pangan Lokal tinggi protein hewani.
6. Jika Normal (-2 SD s/d +2 SD): Pertahankan pola Isi Piringku Balita, ASI Eksklusif/MPASI kaya zat besi, dan penimbangan rutin bulanan.

Tuliskan analisis medis dalam 2-3 kalimat yang sangat spesifik, mengutip angka Z-score balita ini (${formatZScore(zScoreBB_U)} / ${formatZScore(zScoreTB_U)}), dan memberikan rekomendasi tindakan klinis langsung.`;

    const candidateModels = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-pro",
    ];

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText && aiText.trim() !== "") {
            return aiText.trim();
          }
        }
      } catch (err) {
        console.warn(`Gemini API call model ${model} failed:`, err);
      }
    }
  }

  // Parameter-driven dynamic clinical analysis engine (for fallback when rate-limited)
  if (statusGizi === "Obesitas") {
    return `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nameLabel} (${usiaBulan} Bulan) terindikasi Obesitas Berat dengan Z-Score BB/TB ${formatZScore(zScoreBB_TB)} (BB ${beratBadan} kg pada TB ${tinggiBadan} cm). Berisiko tinggi terhadap sindrom metabolik dan gangguan kardiovaskular dini. Segera rujuk ke Dokter Spesialis Anak untuk resep evaluasi diet klinis & restrukturisasi asupan kalori murni tanpa mengganggu tumbuh kembang.`;
  } else if (statusGizi === "Gizi Lebih") {
    return `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nameLabel} (${usiaBulan} Bulan) terindikasi Gizi Lebih (Overweight) dengan Z-Score BB/U ${formatZScore(zScoreBB_U)}. Disarankan penghentian konsumsi makanan tinggi gula/soda, meningkatkan aktivitas fisik harian balita, serta mengganti camilan olahan dengan protein hewani & serat buah utuh.`;
  } else if (statusGizi === "Stunting") {
    return `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nameLabel} (${usiaBulan} Bulan) terindikasi Stunting (TB/U ${formatZScore(zScoreTB_U)}, TB ${tinggiBadan} cm). Berisiko tinggi terhadap hambatan kognitif permanen. Segera lakukan rujukan ke Puskesmas/Spesialis Anak untuk skrining TBC/ISK/Cacingan dan resepkan PMT Pemulihan tinggi Protein Hewani (telur, ikan, susu PKMK).`;
  } else if (statusGizi === "Gizi Buruk") {
    return `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nameLabel} (${usiaBulan} Bulan) terindikasi Gizi Buruk Akut (BB/TB ${formatZScore(zScoreBB_TB)}). Lakukan rujukan darurat ke TFC/Puskesmas Rawat Inap untuk penanganan Protokol 10 Langkah Gizi Buruk (Fase Stabilisasi F-75 & F-100).`;
  } else if (statusGizi === "Gizi Kurang") {
    return `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nameLabel} (${usiaBulan} Bulan) terindikasi Gizi Kurang (Z-Score BB/U ${formatZScore(zScoreBB_U)}). Berikan suplemen Zink 10-20 mg/hari selama 14 hari, tingkatkan asupan PMT Lokal kaya protein hewani, dan lakukan pemantauan berat badan per 2 minggu.`;
  }

  return `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nameLabel} (${usiaBulan} Bulan) dalam Status Gizi Normal (Z-Score BB/U ${formatZScore(zScoreBB_U)}, TB/U ${formatZScore(zScoreTB_U)}). Pertahankan pola konsumsi Isi Piringku Balita, pastikan asupan ASI/MPASI kaya zat besi, dan lanjutkan penimbangan rutin bulanan di Posyandu.`;
}
