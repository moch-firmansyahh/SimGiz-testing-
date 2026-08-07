export async function generateAIRecommendation({
  nama,
  usiaBulan,
  beratBadan,
  tinggiBadan,
  zScoreTB_U,
  statusGizi,
}: {
  nama: string;
  usiaBulan: number;
  beratBadan: number;
  tinggiBadan: number;
  zScoreTB_U: number;
  statusGizi: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    const prompt = `Anda adalah AI Asisten Dokter Spesialis Gizi Posyandu Indonesia. Berikan rekomendasi intervensi gizi singkat (2 kalimat, maksimal 35 kata), sangat jelas, dan aplikatif untuk balita bernama ${nama}, usia ${usiaBulan} bulan, BB ${beratBadan} kg, TB ${tinggiBadan} cm, Z-Score TB/U ${zScoreTB_U} SD, dengan status gizi: ${statusGizi}.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
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
      console.warn("Gemini API call fallback:", err);
    }
  }

  // Clinical Rule Fallback
  if (statusGizi === "Stunting") {
    return `Indikasi Stunting Berat (${zScoreTB_U} SD). Segera rujuk ke Puskesmas & berikan PMT Pemulihan tinggi protein hewani (telur, ikan, susu khusus).`;
  } else if (statusGizi === "Gizi Buruk") {
    return `Indikasi Gizi Buruk. Berikan konseling ASI Eksklusif/MPASI padat gizi & pemantauan kenaikan BB secara mingguan di posyandu.`;
  } else if (statusGizi === "Gizi Kurang") {
    return `Indikasi Gizi Kurang. Berikan Makanan Tambahan (PMT) lokal berbasis protein hewani dan konseling nutrisi keluarga.`;
  }
  return `Status gizi normal ideal WHO. Pertahankan pola makan gizi seimbang dan penimbangan rutin posyandu bulan depan.`;
}
