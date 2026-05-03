import db from "@/lib/db";
import { Category } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Extract ID from the URL

  if (!id) {
    return NextResponse.json(
      {
        message: "ID de sucursal es requerido",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const category: Category | null = await db.category.findUnique({
      where: {
        id: id, // Ensure the ID is a number
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          message: "No se encontró la categorua.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(category, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {
        message: "Error al obtener la categoria.",
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
          message: 'ID de sucursal es requerido',
        },
        {
          status: 400,
        }
      );
    }

    // Delete the category by its ID
    const deletedCategory = await db.category.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Categoria eliminada exitosamente',
      deletedCategory,
    });
  } catch (error) {
    console.error('Error al eliminar la cliente:', error);

    return NextResponse.json(
      {
        message: 'Ha ocurrido un error al eliminar la cliente.',
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

    // Update the category
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error al actualizar la cliente:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar la cliente.",
      },
      {
        status: 500,
      }
    );
  }
}
