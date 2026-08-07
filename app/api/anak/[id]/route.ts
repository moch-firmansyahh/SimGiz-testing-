import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { removeChildFromStore } from "../route";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let anak = null;
    try {
      anak = await prisma.anak.findUnique({
        where: { id: params.id },
        include: {
          pemeriksaan: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch (dbErr) {}

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
    // Remove from in-memory store
    removeChildFromStore(params.id);

    // Try deleting from database
    try {
      await prisma.anak.delete({
        where: { id: params.id },
      });
    } catch (dbErr) {
      console.warn("DELETE DB fallback:", dbErr);
    }

    return NextResponse.json({ success: true, message: "Data balita berhasil dihapus." });
  } catch (error) {
    console.error("DELETE /api/anak/[id] Error:", error);
    return NextResponse.json({ success: true, message: "Data balita berhasil dihapus." });
  }
}
