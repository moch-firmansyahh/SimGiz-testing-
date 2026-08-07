import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAIRecommendation } from "@/lib/gemini";
import { globalChildrenStore, prependChildToStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "Semua";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");

    const skip = (page - 1) * limit;
    let dbChildren: any[] = [];

    try {
      dbChildren = await prisma.anak.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("GET /api/anak DB lookup fallback:", dbErr);
    }

    // Merge database records with global in-memory store cleanly without duplicates
    const combinedMap = new Map();
    globalChildrenStore.forEach((c) => combinedMap.set(c.nik || c.id, c));
    dbChildren.forEach((c) => combinedMap.set(c.nik || c.id, c));

    let allList = Array.from(combinedMap.values());

    // Apply search filter
    if (search) {
      const q = search.toLowerCase();
      allList = allList.filter(
        (c) =>
          c.nama.toLowerCase().includes(q) ||
          (c.nik && c.nik.includes(q)) ||
          (c.namaOrangTua && c.namaOrangTua.toLowerCase().includes(q))
      );
    }

    // Apply status filter
    if (status && status !== "Semua") {
      allList = allList.filter((c) => c.statusGizi === status);
    }

    const totalItems = allList.length;
    const paginatedData = allList.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/anak Error:", error);
    return NextResponse.json({
      success: true,
      data: globalChildrenStore.slice(0, 8),
      pagination: { page: 1, limit: 8, totalItems: globalChildrenStore.length, totalPages: 1 },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nama,
      nik,
      usiaBulan,
      jenisKelamin,
      namaOrangTua,
      alamat,
      beratBadan,
      tinggiBadan,
    } = body;

    if (!nama || nama.trim() === "") {
      return NextResponse.json({ error: "Nama balita wajib diisi." }, { status: 400 });
    }

    const bb = parseFloat(beratBadan);
    const tb = parseFloat(tinggiBadan);
    const usia = parseInt(usiaBulan);

    if (isNaN(bb) || bb <= 0) {
      return NextResponse.json({ error: "Berat badan harus berupa angka lebih dari 0 kg." }, { status: 400 });
    }

    if (isNaN(tb) || tb <= 0) {
      return NextResponse.json({ error: "Tinggi badan harus berupa angka lebih dari 0 cm." }, { status: 400 });
    }

    if (isNaN(usia) || usia < 0 || usia > 59) {
      return NextResponse.json({ error: "Usia balita harus di antara 0 sampai 59 bulan." }, { status: 400 });
    }

    const medianTB = 75 + (usia * 0.75);
    const medianBB = 3.5 + (usia * 0.35);

    const zTB = parseFloat(((tb - medianTB) / 3.5).toFixed(2));
    const zBB = parseFloat(((bb - medianBB) / 1.5).toFixed(2));
    const zBB_TB = parseFloat(((zBB - zTB)).toFixed(2));

    let statusGizi: 'Normal' | 'Gizi Kurang' | 'Gizi Buruk' | 'Stunting' = 'Normal';
    let risikoLevel = "Rendah";

    if (zTB < -3.0) {
      statusGizi = "Stunting";
      risikoLevel = "Kritis";
    } else if (zBB < -3.0 || zBB_TB < -3.0) {
      statusGizi = "Gizi Buruk";
      risikoLevel = "Kritis";
    } else if (zTB < -2.0) {
      statusGizi = "Stunting";
      risikoLevel = "Tinggi";
    } else if (zBB < -2.0 || zBB_TB < -2.0) {
      statusGizi = "Gizi Kurang";
      risikoLevel = "Sedang";
    } else {
      statusGizi = "Normal";
      risikoLevel = "Rendah";
    }

    // Call Google Gemini AI Recommendation Generator
    const rekomendasiAI = await generateAIRecommendation({
      nama,
      usiaBulan: usia,
      beratBadan: bb,
      tinggiBadan: tb,
      zScoreTB_U: zTB,
      statusGizi,
    });

    const tgl = new Date().toISOString().split("T")[0];
    const nikFinal = nik && nik.trim() !== "" ? nik.trim() : `3174${Date.now().toString().slice(-12)}`;

    const newChildRecord = {
      id: `anak-${Date.now()}`,
      nama,
      nik: nikFinal,
      usiaBulan: usia,
      jenisKelamin: jenisKelamin || "L",
      namaOrangTua: namaOrangTua || "Orang Tua Balita",
      alamat: alamat || "Wilayah Posyandu",
      beratBadan: bb,
      tinggiBadan: tb,
      zScoreBB_U: zBB,
      zScoreTB_U: zTB,
      zScoreBB_TB: zBB_TB,
      statusGizi,
      tanggalPemeriksaan: tgl,
      risikoLevel,
      rekomendasiAI,
    };

    // Prepend to global store so it shows up at top of /rekap instantly
    prependChildToStore(newChildRecord);

    try {
      await prisma.anak.upsert({
        where: { nik: nikFinal },
        update: newChildRecord,
        create: newChildRecord,
      });

      await prisma.pemeriksaan.create({
        data: {
          anakId: newChildRecord.id,
          beratBadan: bb,
          tinggiBadan: tb,
          zScoreBB_U: zBB,
          zScoreTB_U: zTB,
          zScoreBB_TB: zBB_TB,
          statusGizi,
          rekomendasiAI,
          tanggalPemeriksaan: tgl,
        },
      });
    } catch (dbErr) {
      console.warn("POST /api/anak DB save fallback:", dbErr);
    }

    return NextResponse.json({ success: true, data: newChildRecord });
  } catch (error) {
    console.error("POST /api/anak Error:", error);
    return NextResponse.json({ error: "Terjadi kendala saat menyimpan data balita." }, { status: 500 });
  }
}
