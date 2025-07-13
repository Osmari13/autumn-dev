import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
      const data = await request.json();
      const newTransaction = await db.transaction.create({
        data: {
          ...data
        },
      });

    return NextResponse.json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      {
        message: "Error en el servidor.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const data = await db.transaction.findMany({
      include: {
        article: {
          select: {
            name: true,
            serial: true
          },
        },
        client: {
          select: {
            first_name: true,
            last_name: true
          },
        },
      },
    });
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      {
        message: "Error al obtener las transacciones.",
      },
      {
        status: 500,
      }
    );
  }
}
