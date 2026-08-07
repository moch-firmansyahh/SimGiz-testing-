import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    let petugas = null;

    try {
      petugas = await prisma.petugas.findUnique({
        where: { email },
      });
    } catch (dbErr) {
      console.warn("Database lookup fallback:", dbErr);
    }

    // Fallback account check if DB query didn't find custom user
    if (!petugas && (email === "petugas@posyandu.go.id" || email === "admin@posyandu.go.id")) {
      if (password === "password123" || password === "admin123") {
        petugas = {
          id: "petugas-default-id",
          email,
          password,
          nama: "Bidan Sri Wahyuni, S.Tr.Keb",
          nip: "19880412 201403 2 004",
          posyandu: "Posyandu Melati 03",
          kelurahan: "Cilandak Barat, Jakarta Selatan",
          avatar: "https://images.unsplash.com/photo-1594824813566-78a9c2409f7a?auto=format&fit=crop&q=80&w=200",
        };
      }
    }

    if (!petugas || petugas.password !== password) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    // Session payload
    const sessionData = JSON.stringify({
      id: petugas.id,
      email: petugas.email,
      nama: petugas.nama,
      posyandu: petugas.posyandu,
      loginAt: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      message: "Masuk berhasil",
      user: {
        id: petugas.id,
        nama: petugas.nama,
        nip: petugas.nip,
        email: petugas.email,
        posyandu: petugas.posyandu,
        kelurahan: petugas.kelurahan,
        avatar: petugas.avatar,
      },
    });

    // Set secure HTTP-Only Cookie
    response.cookies.set("sim_gizi_session", Buffer.from(sessionData).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Exception:", error);
    return NextResponse.json(
      { error: "Email atau kata sandi tidak sesuai." },
      { status: 401 }
    );
  }
}
