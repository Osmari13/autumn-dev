import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.category.findMany()
    return NextResponse.json(data,{
      status:200
    })
  } catch (error) {
    return NextResponse.json({
      error: error
    }, {
      status: 500
    })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data)
  // Check if the branch name already exists
  const nameFound = await db.category.findFirst({
    where: {
      name: data.name,
    },
  });

  if (nameFound) {
    return NextResponse.json(
      {
        message: "La categoria ya existe.",
      },
      {
        status: 400, // Set 400 status code for a validation error
      }
    );
  }

    // Create a new branch if the name is unique
    const newCategory = await db.category.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json(newCategory);
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
