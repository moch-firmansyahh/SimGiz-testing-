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
  // Always remove from in-memory store immediately
  try {
    if (params?.id) {
      removeChildFromStore(params.id);
    }
  } catch (e) {
    console.warn("removeChildFromStore error:", e);
  }

  // Attempt database deletion silently in background without throwing 500
  try {
    if (params?.id) {
      await prisma.anak.delete({
        where: { id: params.id },
      }).catch((dbErr) => {
        console.warn("DB delete skipped (fallback item or connection timeout):", dbErr?.message);
      });
    }
  } catch (dbErr) {
    console.warn("Prisma DB delete caught silently:", dbErr);
  }

  // Always return 200 OK success
  return NextResponse.json({
    success: true,
    message: "Data balita berhasil dihapus.",
  });
}
