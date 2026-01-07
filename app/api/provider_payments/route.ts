import db from "@/lib/db";
import { Provider } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const payment = await db.providerPayment.create({
      data: {
        providerId: body.providerId,
        amount: body.amount,
        reference: body.reference ?? null,
        payMethod: body.payMethod,
        paidAt: body.paidAt,
        image: body.image ?? null,
        registered_by: body.registered_by ?? null,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Error al registrar pago al proveedor" },
      { status: 500 }
    )
  }
}

