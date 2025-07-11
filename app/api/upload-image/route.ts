
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
   const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo de imagen." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, uint8Array);

    const imageUrl = `/uploads/${filename}`; // URL pública de la imagen
    console.log("Imagen guardada en:", imageUrl);
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error en la API de subida de imagen:", error);
    return NextResponse.json({ error: "Error interno del servidor al subir la imagen." }, { status: 500 });
  }
}
