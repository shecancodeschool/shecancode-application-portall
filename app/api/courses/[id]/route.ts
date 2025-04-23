import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ message: "Failed to fetch course" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validate course exists
    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!existingCourse) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ message: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!existingCourse) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    // Check if course has applications
    const applicationCount = await prisma.application.count({
      where: {
        courseId: id,
      },
    })

    if (applicationCount > 0) {
      return NextResponse.json({ message: "Cannot delete course with existing applications" }, { status: 400 })
    }

    // Delete course
    await prisma.course.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ message: "Failed to delete course" }, { status: 500 })
  }
}
