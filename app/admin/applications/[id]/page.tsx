import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ApplicationDetails from "@/components/admin/application-details"
import AdminHeader from "@/components/admin/admin-header"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Application Details",
  description: "View and manage application details",
}

export default async function ApplicationDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  try {
    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      include: {
        course: true,
      },
    })

    if (!application) {
      notFound()
    }

    return (
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-1 container mx-auto py-8 px-4">
          <ApplicationDetails application={application} />
        </main>
      </div>
    )
  } catch (error) {
    console.error("Error fetching application:", error)
    notFound()
  }
}
