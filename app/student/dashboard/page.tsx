"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Clock, CheckCircle, XCircle, LogOut, AlertCircle, MessageSquare, Megaphone } from "lucide-react"
import {
  getSubjectsByBranchAndLevel,
  getAttendanceByStudent,
  isAttendanceActive,
  type Subject,
  type AttendanceRecord,
} from "@/lib/data"
import { getCurrentPosition, isWithinRadius } from "@/lib/geolocation"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<{ subjectId: string; status: string } | null>(null)
  const [attendanceLoading, setAttendanceLoading] = useState<string | null>(null)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/student/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "student") {
        router.push("/")
        return
      }
      setUser(parsedUser)

      // Load subjects based on branch and education level
      if (parsedUser.branch && parsedUser.educationLevel) {
        const userSubjects = getSubjectsByBranchAndLevel(parsedUser.branch, parsedUser.educationLevel)
        setSubjects(userSubjects)

        // Load attendance history
        const history = getAttendanceByStudent(parsedUser.id)
        setAttendanceHistory(history)

        // Mock announcements
        setAnnouncements([
          {
            id: 1,
            subjectId: "cs101",
            title: "Assignment Submission",
            content: "Please submit your assignments by Friday",
            link: "https://example.com/assignments",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            teacherName: "Dr. Alan Turing",
          },
          {
            id: 2,
            subjectId: "cs102",
            title: "Study Material",
            content: "New study materials have been uploaded",
            link: "https://example.com/materials",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            teacherName: "Dr. Alan Turing",
          },
        ])

        // Mock messages
        setMessages([
          {
            id: 1,
            studentId: parsedUser.id,
            studentName: parsedUser.name || parsedUser.id,
            teacherId: "T1001",
            teacherName: "Dr. Alan Turing",
            content: "Hello professor, I have a question about the assignment",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            sender: "student",
            read: true,
          },
          {
            id: 2,
            studentId: parsedUser.id,
            studentName: parsedUser.name || parsedUser.id,
            teacherId: "T1001",
            teacherName: "Dr. Alan Turing",
            content: "Sure, what's your question?",
            timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
            sender: "teacher",
            read: true,
          },
        ])
      }
    } catch (error) {
      router.push("/student/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const checkAttendance = async (subject: Subject) => {
    try {
      setAttendanceLoading(subject.id)

      // Check if attendance is active for this subject
      if (!isAttendanceActive(subject.id)) {
        toast({
          title: "Attendance Closed",
          description: "The teacher has not opened attendance for this class yet.",
          variant: "destructive",
        })
        setAttendanceLoading(null)
        return
      }

      // Get current location
      let location
      try {
        const position = await getCurrentPosition()
        location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCurrentLocation(location)
        setLocationError(null)
      } catch (error) {
        let errorMessage = "Failed to get your location"
        if (error instanceof Error) {
          errorMessage = error.message
        }
        setLocationError(errorMessage)
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        })
        setAttendanceLoading(null)
        return
      }

      // Check if student is within the classroom radius
      const isInClassroom = isWithinRadius(
        location.lat,
        location.lng,
        subject.location.lat,
        subject.location.lng,
        subject.location.radius,
      )

      const status = isInClassroom ? "present" : "absent"

      // Set attendance status locally
      setAttendanceStatus({ subjectId: subject.id, status })

      // Get address from coordinates using reverse geocoding
      let locationAddress = "Unknown location"
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`,
        )
        const data = await response.json()
        locationAddress = data.display_name || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
      } catch (error) {
        console.error("Error getting address:", error)
        locationAddress = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
      }

      // Calculate distance
      const distance = calculateDistance(location.lat, location.lng, subject.location.lat, subject.location.lng)

      // Send attendance data to server (simulated)
      const attendanceData = {
        studentId: user.id,
        studentName: user.name || user.id,
        subjectId: subject.id,
        subjectName: subject.name,
        timestamp: new Date().toISOString(),
        location: {
          lat: location.lat,
          lng: location.lng,
          address: locationAddress,
          distance: Math.round(distance),
          isInClassroom,
        },
      }

      // Simulate sending to server
      console.log("Sending attendance data:", attendanceData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isInClassroom) {
        // In a real app, this would be a server action or API call
        await sendAttendanceEmail(attendanceData)

        // Add to local attendance history
        const newRecord: AttendanceRecord = {
          id: Date.now(),
          studentId: user.id,
          studentName: user.name || user.id,
          subjectId: subject.id,
          date: new Date().toISOString().split("T")[0],
          status: "present",
          location: {
            lat: location.lat,
            lng: location.lng,
            distance: Math.round(distance),
          },
          timestamp: new Date().toISOString(),
        }

        setAttendanceHistory((prev) => [newRecord, ...prev])

        toast({
          title: "Attendance Marked",
          description: "You are present in the classroom. Notification sent to teacher.",
        })
      } else {
        toast({
          title: "Attendance Failed",
          description: `You are ${Math.round(distance)}m away from the classroom, which exceeds the allowed radius of ${subject.location.radius}m`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error checking attendance:", error)
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to check attendance",
        variant: "destructive",
      })
    } finally {
      setAttendanceLoading(null)
    }
  }

  // Add this function to simulate sending an email notification
  const sendAttendanceEmail = async (attendanceData: any) => {
    // In a real app, this would be a server action or API call
    // For demo purposes, we'll just simulate the API call
    console.log("Sending email notification to teacher with data:", attendanceData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success
    return { success: true }
  }

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  const handleSendMessage = () => {
    if (!selectedTeacher || !messageText) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    const newMessage = {
      id: Date.now(),
      studentId: user.id,
      studentName: user.name || user.id,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      content: messageText,
      timestamp: new Date().toISOString(),
      sender: "student",
      read: false,
    }

    setMessages([...messages, newMessage])

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedTeacher.name}`,
    })

    setMessageText("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40 bg-yellow-50">
      <header className="bg-blue-500 text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Student Dashboard</h1>
          <div className="flex items-center gap-4 text-black font-semibold">
            <span>Welcome, {user?.id}</span>
            <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground">
              {user?.branch
                ?.split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}{" "}
              - {user?.educationLevel?.charAt(0).toUpperCase() + user?.educationLevel?.slice(1)}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-black font-semibold">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="courses">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-slate-300 font-bold text-black">
            <TabsTrigger value="courses">My Subjects</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.length > 0 ? (
                subjects.map((subject) => {
                  const isActive = isAttendanceActive(subject.id)

                  return (
                    <Card key={subject.id} className="overflow-hidden bg-lime-100 ">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start font-bold text-black">
                          <div>
                            <CardTitle>{subject.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1 font-bold text-black">
                              <Clock className="h-4 w-4" /> {subject.time} ({subject.days})
                            </CardDescription>
                          </div>
                          {isActive ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground font-bold text-black">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground font-bold text-black">
                              <MapPin className="h-4 w-4" />
                              Location: {subject.building}, Room {subject.room}
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground font-bold text-black">
                              <div>Teacher: {subject.teacherName}</div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedTeacher({
                                    id: subject.teacherId,
                                    name: subject.teacherName,
                                  })
                                  setShowMessageModal(true)
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {attendanceStatus && attendanceStatus.subjectId === subject.id && (
                            <div className="flex items-center gap-2 my-2">
                              {attendanceStatus.status === "present" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                >
                                  <CheckCircle className="h-3 w-3" /> Present
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                                >
                                  <XCircle className="h-3 w-3" /> Not in classroom area
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="pt-2">
                            <Button
                              onClick={() => checkAttendance(subject)}
                              className="w-full"
                              disabled={attendanceLoading === subject.id || !isActive}
                            >
                              {attendanceLoading === subject.id
                                ? "Checking..."
                                : isActive
                                  ? "Mark Attendance"
                                  : "Attendance Closed"}
                            </Button>
                          </div>

                          {!isActive && (
                            <div className="flex items-center gap-2 text-amber-600 text-xs mt-1">
                              <AlertCircle className="h-3 w-3" />
                              Attendance is currently closed by the teacher
                            </div>
                          )}

                          {locationError && <p className="text-sm text-red-500 mt-2">{locationError}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-muted-foreground">No subjects found for your branch and education level.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-orange-200 font-bold text-black">
              <CardHeader>
                <CardTitle className="font-bold text-black">Attendance History</CardTitle>
                <CardDescription className="font-bold text-black">Your attendance record for all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50 font-bold text-black">
                        <th className=" font-bold text-black px-6 py-3 text-left text-xs  uppercase tracking-wider ">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border ">
                      {attendanceHistory.length > 0 ? (
                        attendanceHistory.map((record) => {
                          const subject = subjects.find((s) => s.id === record.subjectId)
                          return (
                            <tr key={record.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {subject?.name || record.subjectId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {record.status === "present" ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Present
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    Absent
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-center text-sm text-muted-foreground">
                            No attendance records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card className="bg-red-300">
              <CardHeader>
                <CardTitle className="font-bold text-black ">Announcements</CardTitle>
                <CardDescription className="font-bold text-black" >Important announcements from your teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 font-bold text-black">
                  {announcements
                    .filter((a) => {
                      const subject = subjects.find((s) => s.id === a.subjectId)
                      return subject !== undefined
                    })
                    .map((announcement) => {
                      const subject = subjects.find((s) => s.id === announcement.subjectId)

                      return (
                        <Card key={announcement.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <Megaphone className="h-4 w-4" /> {announcement.title}
                                </CardTitle>
                                <CardDescription>
                                  {subject?.name} - {announcement.teacherName}
                                </CardDescription>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(announcement.date).toLocaleDateString()}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{announcement.content}</p>
                            {announcement.link && (
                              <a
                                href={announcement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline mt-2 inline-block"
                              >
                                View Resource
                              </a>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}

                  {announcements.filter((a) => {
                    const subject = subjects.find((s) => s.id === a.subjectId)
                    return subject !== undefined
                  }).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border rounded-md">
                      <p>No announcements for your subjects</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-green-300">
              <CardHeader>
                <CardTitle className="font-bold text-black">Messages</CardTitle>
                <CardDescription  className="font-bold text-black">Communication with your teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{subject.teacherName}</p>
                        <p className="text-sm text-muted-foreground">{subject.name}</p>
                      </div>
                      <Button
                      className="font-bold text-black"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTeacher({
                            id: subject.teacherId,
                            name: subject.teacherName,
                          })
                          setShowMessageModal(true)
                        }}
                      >
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="sm:max-w-[500px] bg-orange-100">
          <DialogHeader>
            <DialogTitle  className="font-bold text-black">Message to {selectedTeacher?.name}</DialogTitle>
            <DialogDescription  className="font-bold text-black">Send a message to your teacher</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="h-64 overflow-y-auto p-3 space-y-3 border rounded-md">
              {messages
                .filter((m) => m.teacherId === selectedTeacher?.id)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded-lg max-w-[80%] ${
                      message.sender === "student" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button className="bg-red-600" variant="outline" onClick={() => setShowMessageModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

