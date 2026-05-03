import db from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
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
    const [data, session] = await Promise.all([
      request.json(),
      getServerSession(authOptions),
    ]);

    const registeredBy = session?.user?.username?.trim() || data.registered_by?.trim();

    if (!registeredBy) {
      return NextResponse.json(
        { message: "No se pudo identificar el usuario autenticado." },
        { status: 401 }
      );
    }

    const transaction = await db.transaction.create({
      data: {
        reference: data.reference?.trim() || null,
        subtotal: data.subtotal,
        total: data.total,
        status: data.status,
        clientId: data.clientId,
        registered_by: registeredBy,
        transaction_date: data.transaction_date,
        items: {
          create: data.items.map((item: any) => ({
            articleId: item.articleId,
            quantity: item.quantity,
            priceUnit: item.priceUnit,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
        client: true,
      },
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
