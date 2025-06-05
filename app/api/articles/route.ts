import db from "@/lib/db";
import { Article } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // Check if the branch name already exists
        console.log(data)
        const articleFound = await db.article.findFirst({
          where: {
            id: data.id,
          },
        });

        if (articleFound) {
          return NextResponse.json(
            {
            message: "El producto ya existe.",
            },
            {
            status: 400, // Set 400 status code for a validation error
            }
          );
        }

        // Create a new branch if the name is unique
       
        const newArticle = await db.article.create({
          data: {
            ...data
          },
        });

      return NextResponse.json(newArticle);
    } catch (error) {
      console.error("Error creating product:", error);
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
    const data = await db.article.findMany()
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        message: "Error al obtener los productos.",
      },
      {
        status: 500,
      }
    );
  }
}

