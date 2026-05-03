import db from "@/lib/db";
import { Article } from "@/types";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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
        id: id,
      },
      include: {
        category: { select: { id: true, name: true } },
        provider: { select: { id: true, name: true } },
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

    const article = await db.article.findUnique({ where: { id } });

    if (!article) {
      return NextResponse.json(
        { message: "Artículo no encontrado." },
        { status: 404 }
      );
    }

    // Delete image from UploadThing if it exists
    if (article.image) {
      try {
        // UploadThing file key is the last segment of the URL
        const fileKey = article.image.split("/").pop();
        if (fileKey) await utapi.deleteFiles(fileKey);
      } catch (utError) {
        console.error("Error al eliminar imagen de UploadThing:", utError);
        // Non-fatal: proceed with article deletion
      }
    }

    const deletedArticle = await db.article.delete({
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

    // If a new image is being set, delete the old one from UploadThing
    if (data.image) {
      const existing = await db.article.findUnique({ where: { id }, select: { image: true } });
      if (existing?.image && existing.image !== data.image) {
        try {
          const fileKey = existing.image.split("/").pop();
          if (fileKey) await utapi.deleteFiles(fileKey);
        } catch (utError) {
          console.error("Error al eliminar imagen anterior de UploadThing:", utError);
        }
      }
    }

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
