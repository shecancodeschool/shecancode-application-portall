import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, BookOpen } from "lucide-react"

export default function AdminHeader() {
  return (
    <header className="border-b bg-muted">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold text-xl flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/applications">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Applications
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/courses">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Courses
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
