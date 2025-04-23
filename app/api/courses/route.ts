import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ message: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ message: "Course name is required" }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ message: "Failed to create course" }, { status: 500 })
  }
}
