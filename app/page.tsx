import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Applicant Registration System</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/apply">
                  <Button variant="default">Apply Now</Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/applications">
                  <Button variant="outline">Admin Panel</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">Welcome to Our Application Portal</h2>
          <p className="text-xl text-muted-foreground">
            Apply for our courses and programs to advance your career and skills.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/apply">
              <Button size="lg">Start Your Application</Button>
            </Link>
            <Link href="/admin/applications">
              <Button variant="outline" size="lg">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Applicant Registration System. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
