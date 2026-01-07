import db from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(request: Request) {

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Extract ID from the URL

  if (!id) {
    return NextResponse.json(
      {
        message: "ID de transaccion es requerido",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const payments = await db.payment.findMany({
      where:{ transactionId: id },
      include: {
        transaction: true,
      },
    });
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      {
        message: "Error al obtener los pagos.",
      },
      {
        status: 500,
      }
    );
  } 
}

