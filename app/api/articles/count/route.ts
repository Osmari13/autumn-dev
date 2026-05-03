import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await db.article.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error counting articles:", error);
    return NextResponse.json({ message: "Error en el servidor." }, { status: 500 });
  }
}
