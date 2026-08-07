import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const anak = await prisma.anak.findUnique({
      where: { id: params.id },
      include: {
        pemeriksaan: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!anak) {
      return NextResponse.json({ error: "Data balita tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: anak });
  } catch (error) {
    console.error("GET /api/anak/[id] Error:", error);
    return NextResponse.json({ error: "Terjadi kendala saat mengambil data." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.anak.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Data balita berhasil dihapus." });
  } catch (error) {
    console.error("DELETE /api/anak/[id] Error:", error);
    return NextResponse.json({ error: "Terjadi kendala saat menghapus data." }, { status: 500 });
  }
}
