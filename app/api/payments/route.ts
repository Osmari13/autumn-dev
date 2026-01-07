import db from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data)
    // Check if the branch name already exists
    const transaction = await db.transaction.findFirst({
      where: {
        id: data.transactionId,
      },
      include: { payments: true },
    });

    if (!transaction) {
      return NextResponse.json(
        {
          message: "Transaccion no encontrada.",
        },
        {
          status: 400, // Set 400 status code for a validation error
        }
      );
    }

    const payments = await db.payment.findMany({
      where: { reference_number: data.reference_number },
    });
    if (payments.length > 0) {
      return NextResponse.json(
        {   message: "El número de referencia ya existe" },
        { status: 400 }
      );
    }

    const paid = transaction.payments.reduce((s, p) => s + p.amount, 0)
    const remaining = transaction.total - paid

    if (data.amount > remaining) {
      return Response.json(
        { message: "El abono supera el saldo pendiente" },
        { status: 400 }
      )
    }

    // Create a new branch if the name is unique
    const payment = await db.payment.create({
      data: {
        reference_number: data.reference_number,
        amount: data.amount,
        payMethod: data.payMethod,
        transactionId: data.transactionId,
        registered_by: data.registered_by ?? null,
        paidAt: data.paidAt,
        image: data.image ?? null,
      },
    });

    // const newPaid = paid + data.amount
    // await db.transaction.update({
    //   where: { id: data.transactionId },
    //   data: {
    //     status: newPaid === transaction.total ? "PAGADO" : "PENDIENTE",
    //   },
    // });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error creating client:", error);
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



