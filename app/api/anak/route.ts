import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "Semua";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { nik: { contains: search, mode: "insensitive" } },
        { namaOrangTua: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "Semua") {
      where.statusGizi = status;
    }

    const [totalItems, children] = await Promise.all([
      prisma.anak.count({ where }),
      prisma.anak.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return NextResponse.json({
      success: true,
      data: children,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/anak Error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat mengambil data balita." },
      { status: 500 }
    );
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

    // Backend Input Validation
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

    // Server-Side WHO Standard Z-score Estimation Formula
    const medianTB = 75 + (usia * 0.75);
    const medianBB = 3.5 + (usia * 0.35);

    const zTB = parseFloat(((tb - medianTB) / 3.5).toFixed(2));
    const zBB = parseFloat(((bb - medianBB) / 1.5).toFixed(2));
    const zBB_TB = parseFloat(((zBB - zTB)).toFixed(2));

    let statusGizi: 'Normal' | 'Gizi Kurang' | 'Gizi Buruk' | 'Stunting' = 'Normal';
    let rekomendasiAI = "";
    let risikoLevel = "Rendah";

    if (zTB < -3.0) {
      statusGizi = "Stunting";
      risikoLevel = "Kritis";
      rekomendasiAI = "Indikasi Stunting Berat (TB/U < -3 SD). Segera rujuk ke Puskesmas & berikan PMT Pemulihan tinggi protein hewani.";
    } else if (zBB < -3.0 || zBB_TB < -3.0) {
      statusGizi = "Gizi Buruk";
      risikoLevel = "Kritis";
      rekomendasiAI = "Indikasi Gizi Buruk (BB/TB < -3 SD). Terapi gizi dan pemantauan ketat.";
    } else if (zTB < -2.0) {
      statusGizi = "Stunting";
      risikoLevel = "Tinggi";
      rekomendasiAI = "Indikasi Stunting Sedang (TB/U < -2 SD). Edukasi nutrisi dan pemantauan rutin.";
    } else if (zBB < -2.0 || zBB_TB < -2.0) {
      statusGizi = "Gizi Kurang";
      risikoLevel = "Sedang";
      rekomendasiAI = "Indikasi Gizi Kurang (BB/U < -2 SD). Makanan Tambahan (PMT) lokal.";
    } else {
      statusGizi = "Normal";
      risikoLevel = "Rendah";
      rekomendasiAI = "Status gizi normal ideal WHO. Pertahankan pola makan seimbang.";
    }

    const tgl = new Date().toISOString().split("T")[0];
    const nikFinal = nik && nik.trim() !== "" ? nik.trim() : `3174${Date.now().toString().slice(-12)}`;

    // Upsert Child record
    const anak = await prisma.anak.upsert({
      where: { nik: nikFinal },
      update: {
        nama,
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
      },
      create: {
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
      },
    });

    // Save Inspection Record
    await prisma.pemeriksaan.create({
      data: {
        anakId: anak.id,
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

    return NextResponse.json({ success: true, data: anak });
  } catch (error) {
    console.error("POST /api/anak Error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat menyimpan data balita." },
      { status: 500 }
    );
  }
}
