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
    const prompt = `Anda adalah Dokter Spesialis Anak & Konsultan Utama Gizi Kemenkes RI. Berikan analisis klinis kritis & instruksi intervensi medis tegas untuk bidan/kader posyandu menangani balita berikut:
- Nama: ${nama} (${usiaBulan} Bulan)
- Pengukuran: BB ${beratBadan} kg, TB ${tinggiBadan} cm
- Indikator WHO: Z-Score TB/U ${zScoreTB_U} SD | Status Gizi: ${statusGizi}

Instruksi Analisis Kritis:
1. Jika Stunting / Gizi Buruk (Z-Score < -2 SD / < -3 SD): Berikan evaluasi klinis tajam tentang risiko keterlambatan kognitif/perkembangan, serta instruksi langsung rujukan medis ke Puskesmas Rujukan, pemeriksaan penyakit penyerta (tbc/cacingan), dan penambahan protein hewani intensif (2 telur/hari + susu tinggi kalori).
2. Jika Normal: Berikan arahan krusial pencegahan penurunan kurva tumbuh kembang di usia ${usiaBulan} bulan.
Tuliskan 2-3 kalimat yang sangat kritis, ilmiah, dan berorientasi pada tindakan medis darurat.`;

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

  // Clinical Rule Fallback (Kritis & Spesifik)
  if (statusGizi === "Stunting") {
    return `[KRITIS] Indikasi Stunting Berat (Z-Score TB/U ${zScoreTB_U} SD). Berisiko tinggi terhadap hambatan kognitif permanen. Segera rujukan medis darurat ke Puskesmas, evaluasi infeksi penyerta (TBC/ISPA), dan resepkan PMT Pemulihan tinggi protein hewani (2 telur/hari + ikan).`;
  } else if (statusGizi === "Gizi Buruk") {
    return `[KRITIS] Indikasi Gizi Buruk Akut. Potensi komplikasi penurunan sistem imun dan atrofi otot. Wajib rujukan ke Poli Tumbuh Kembang, berikan terapi F-75/F-100 dan pemantauan kenaikan BB secara ketat setiap 3 hari.`;
  } else if (statusGizi === "Gizi Kurang") {
    return `[PERINGATAN KLINIS] Indikasi Gizi Kurang (BB/U di bawah -2 SD). Berisiko jatuh ke gizi buruk dalam 1 bulan jika tidak diintervensi. Berikan suplemen zink, MPASI kaya zat besi & protein hewani lokal secara intensif.`;
  }
  return `[EVALUASI OPTIMAL] Pertumbuhan fisik sesuai kurva WHO. Lanjutkan pengawasan tumbuh kembang rutin tiap bulan untuk mencegah kegagalan pertumbuhan (growth faltering) di usia ${usiaBulan} bulan.`;
}
