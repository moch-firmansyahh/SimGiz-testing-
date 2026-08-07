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
    const prompt = `Anda adalah Dokter Spesialis Anak & Konsultan Utama Gizi Kemenkes RI. Berikan rekomendasi medis klinis yang 100% patuh pada Keputusan Menteri Kesehatan RI No. 2/2020 & Pedoman WHO Management of Malnutrition untuk balita berikut:
- Nama: ${nama} (${usiaBulan} Bulan)
- Hasil Fisik: BB ${beratBadan} kg, TB ${tinggiBadan} cm
- Z-Score TB/U: ${zScoreTB_U} SD | Status Gizi: ${statusGizi}

Panduan Klinis Resmi (Kemenkes RI & WHO):
1. **Jika Stunting (TB/U < -2 SD)**:
   - Rujukan ke Puskesmas/Spesialis Anak untuk rujukan medis mendeteksi penyakit penyerta/red flags (TBC Paru, ISK, Cacingan).
   - Resepkan PMT Pemulihan tinggi Protein Hewani (telur 1-2 butir/hari, ikan, susu formula khusus PKMK) guna mencegah hambatan kognitif.
2. **Jika Gizi Buruk (BB/TB < -3 SD)**:
   - Terapkan Protokol 10 Langkah Tata Laksana Gizi Buruk: Fase Stabilisasi (Formula F-75) lanjut Fase Transisi (Formula F-100 / RUTF).
   - Segera rujuk ke Puskesmas Rawat Inap / TFC (Therapeutic Feeding Center).
3. **Jika Gizi Kurang (BB/U < -2 SD)**:
   - Berikan PMT Berbasis Pangan Lokal kaya protein hewani & Suplementasi Zink 10-20 mg/hari selama 14 hari.
4. **Jika Normal (-2 SD s/d +2 SD)**:
   - Anjurkan konsistensi Isi Piringku Balita & penimbangan bulanan di Posyandu untuk mencegah growth faltering.

Tuliskan dalam 2-3 kalimat medis yang sangat presisi, akurat, dan menuntut tindakan klinis langsung.`;

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

  // Official Kemenkes RI & WHO Clinical Fallbacks
  if (statusGizi === "Stunting") {
    return `[STANDAR KEMENKES RI & WHO] Terindikasi Stunting (TB/U ${zScoreTB_U} SD). Segera rujuk ke Dokter Spesialis Anak/Puskesmas untuk pemindaian penyakit penyerta (TBC/cacingan) dan berikan PMT Pemulihan tinggi Protein Hewani (1-2 telur/hari + susu PKMK).`;
  } else if (statusGizi === "Gizi Buruk") {
    return `[STANDAR KEMENKES RI & WHO] Terindikasi Gizi Buruk Akut. Lakukan rujukan darurat ke Puskesmas Rawat Inap/TFC untuk Tatalaksana Gizi Buruk 10 Langkah (Fase Stabilisasi Formula F-75 dilanjutkan F-100/RUTF).`;
  } else if (statusGizi === "Gizi Kurang") {
    return `[STANDAR KEMENKES RI & WHO] Terindikasi Gizi Kurang. Berikan suplemen Zink 10-20 mg/hari selama 14 hari, PMT Pemulihan Berbasis Pangan Lokal tinggi protein hewani, dan evaluasi penimbangan mingguan.`;
  }
  return `[STANDAR KEMENKES RI & WHO] Status Gizi Normal. Pertahankan pola makan seimbang berbasis Isi Piringku Balita, ASI Eksklusif/MPASI kaya zat besi, dan penimbangan rutin bulanan di Posyandu.`;
}
