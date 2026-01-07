import db from "@/lib/db";
import { Provider } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await db.providerPayment.findUnique({
      where: { id: params.id },
    })

    if (!payment) {
      return NextResponse.json(
        { message: "Pago no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener pago" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const updated = await db.providerPayment.update({
      where: { id: params.id },
      data: {
        amount: body.amount,
        reference: body.reference ?? null,
        payMethod: body.payMethod,
        paidAt: body.paidAt,
        image: body.image ?? null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar pago" },
      { status: 500 }
    )
  }
}


