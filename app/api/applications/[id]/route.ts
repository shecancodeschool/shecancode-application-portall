import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      include: {
        course: true,
      },
    })

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ message: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validate application exists
    const existingApplication = await prisma.application.findUnique({
      where: {
        id,
      },
    })

    if (!existingApplication) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: {
        id,
      },
      data: {
        status: body.status,
        reviewerComments: body.reviewerComments,
        interviewDate: body.interviewDate,
        decisionDate: body.decisionDate,
        technicalInterviewMarks: body.technicalInterviewMarks,
      },
    })

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ message: "Failed to update application" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Validate application exists
    const existingApplication = await prisma.application.findUnique({
      where: {
        id,
      },
    })

    if (!existingApplication) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Delete application
    await prisma.application.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Application deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ message: "Failed to delete application" }, { status: 500 })
  }
}
