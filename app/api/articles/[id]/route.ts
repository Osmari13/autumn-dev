import db from "@/lib/db";
import { Article } from "@/types";
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
    const article = await db.article.findUnique({
      where: {
        id: id, // Ensure the ID is a number
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          message: "No se encontró la sucursal.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(article, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      {
        message: "Error al obtener el articulo.",
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

    const deletedArticle= await db.article.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Sucursal eliminada exitosamente',
      deletedArticle,
    });
  } catch (error) {
    console.error('Error al eliminar la sucursal:', error);

    return NextResponse.json(
      {
        message: 'Ha ocurrido un error al eliminar la sucursal.',
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

    const updatedArticle = await db.article.update({
      where: { id },
      data: {
        ...data
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error al actualizar la sucursal:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar la sucursal.",
      },
      {
        status: 500,
      }
    );
  }
}
