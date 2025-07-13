import db from "@/lib/db";
import { Transaction } from "@/types";
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
    const transaction = await db.transaction.findUnique({
      where: {
        id: id, // Ensure the ID is a number
      },
    });

    if (!transaction) {
      return NextResponse.json(
        {
          message: "No se encontró la transaccion.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(transaction, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      {
        message: "Error al obtener la trasaccion.",
      },
      {
        status: 500,
      }
    );
  }
}



export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Get ID from URL parameters

    if (!id) {
      return NextResponse.json(
        {
          message: 'ID de trasanccion es requerido',
        },
        {
          status: 400,
        }
      );
    }

    const deletedTransaction= await db.transaction.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'trasanccion eliminada exitosamente',
      deletedTransaction,
    });
  } catch (error) {
    console.error('Error al eliminar la trasanccion:', error);

    return NextResponse.json(
      {
        message: 'Ha ocurrido un error al eliminar la trasanccion.',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {

    const data = await request.json()

    const { id } = params

    const updatedTransaction = await db.transaction.update({
      where: { id },
      data: {
        ...data
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error al actualizar la transaccion:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar la transaccion.",
      },
      {
        status: 500,
      }
    );
  }
}
