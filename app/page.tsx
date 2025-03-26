import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-lime-100">
     <header className="bg-green-200 text-black py-4 px-6 shadow-md">

        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">E-Attendance System</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Classroom Attendance  system with Geofencing</h2>
          <p className="text-muted-foreground text-lg  font-bold mb-8">
            A smart attendance system that verifies student location before marking attendance to prevent proxies
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="text-center bg-blue-500 text-white rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle>For Teachers</CardTitle>
                <CardDescription className="text-black font-bold">Access analytics and manage attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 font-bold">View attendance reports, manage classes, and track student participation.</p>
                <Link href="/teacher/login">
                  <Button size="lg" className="w-full">
                    Teacher Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center bg-green-500 rounded-lg shadow-xl">
              <CardHeader>
                <CardTitle>For Students</CardTitle>
                <CardDescription  className="text-black font-bold">Mark your attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 font-bold">Easily mark your attendance when you're in the classroom.</p>
                <Link href="/student/login">
                  <Button size="lg" variant="outline" className=" w-full">
                    Student Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Key features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Step 1 - Login */}
<Card className="bg-blue-100 text-blue-900 shadow-lg rounded-lg">
  <CardHeader>
    <CardTitle className="text-center font-bold text-blue-700">1. Login</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-center text-blue-800">
      Students and teachers login with their credentials
    </p>
  </CardContent>
</Card>

{/* Step 2 - Verify Location */}
<Card className="bg-yellow-100 text-yellow-900 shadow-lg rounded-lg">
  <CardHeader>
    <CardTitle className="text-center font-bold text-yellow-700">2. Verify Location</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-center text-yellow-800">
      System verifies student is within the classroom area
    </p>
  </CardContent>
</Card>

{/* Step 3 - Mark Attendance */}
<Card className="bg-green-100 text-green-900 shadow-lg rounded-lg">
  <CardHeader>
    <CardTitle className="text-center font-bold text-green-700">3. Mark Attendance</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-center text-green-800">
      Attendance is recorded and available for analytics
    </p>
  </CardContent>
</Card>

          </div>
        </div>
      </main>

      <footer className="bg-muted py-6 px-4 bg-green-800 font-bold">
        <div className="container mx-auto text-center text-muted-foreground text-black font-bold">
          <p>© {new Date().getFullYear()} made By team Phoenix </p>
        </div>
      </footer>
    </div>
  )
}

