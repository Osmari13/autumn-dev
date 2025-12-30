import db from "@/lib/db";
import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//       const data = await request.json();
//       const newTransaction = await db.transaction.create({
//         data: {
//           ...data
//         },
//       });

//     return NextResponse.json(newTransaction);
//   } catch (error) {
//     console.error("Error creating transaction:", error);
//     return NextResponse.json(
//       {
//         message: "Error en el servidor.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const transaction = await db.$transaction(async (tx) => {
      const data = await request.json();
  
      // 1. Crear la transacción principal
      const newTransaction = await tx.transaction.create({
        data: {
          reference: data.reference || null,
          subtotal: data.subtotal,
          total: data.total,
          status: data.status,
          clientId: data.clientId,
          registered_by: data.registered_by,
          transaction_date: data.transaction_date,
        },
        include: {
          items: true, // incluir ítems creados
          client: true
        }
      });

      // 2. Crear TransactionItems relacionados (nested writes)
      await tx.transactionItem.createMany({
        data: data.items.map((item: any) => ({
          transactionId: newTransaction.id,
          articleId: item.articleId,
          quantity: item.quantity,
          priceUnit: item.priceUnit,
          subtotal: item.subtotal,
        }))
      });
      return newTransaction;
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Error al crear la transacción" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const data = await db.transaction.findMany({
      include: {
        client: {
          select: {
            first_name: true,
            last_name: true,
            debt: true,
          },
        },
        payments: true,
        items: {                         // relación TransactionItem[]
          include: {
            article: {                   // relación Article dentro de cada ítem
              select: {
                name: true,
                serial: true,
                priceUnit: true,
                price: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { message: "Error al obtener las transacciones." },
      { status: 500 },
    );
  }
}
