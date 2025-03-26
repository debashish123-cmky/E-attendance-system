"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LogOut,
  Search,
  Users,
  Calendar,
  BarChart3,
  MapPin,
  Play,
  CircleStopIcon as Stop,
  Bell,
  Send,
  AlertTriangle,
  MessageSquare,
  Megaphone,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  getSubjectsByDepartment,
  getAttendanceBySubject,
  getTeacherByDepartment,
  startAttendanceSession,
  endAttendanceSession,
  isAttendanceActive,
  ACTIVE_ATTENDANCE_SESSIONS,
  type Subject,
  type AttendanceRecord,
} from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [showGeofenceModal, setShowGeofenceModal] = useState(false)
  const [selectedLocationForGeofence, setSelectedLocationForGeofence] = useState<any>(null)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [attendanceNotifications, setAttendanceNotifications] = useState<any[]>([])
  const [activeSessions, setActiveSessions] = useState<typeof ACTIVE_ATTENDANCE_SESSIONS>([])
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [selectedAbsentStudents, setSelectedAbsentStudents] = useState<any[]>([])
  const [warningMessage, setWarningMessage] = useState("")
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcement, setAnnouncement] = useState({ title: "", content: "", link: "" })
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [showMessagingModal, setShowMessagingModal] = useState(false)
  const [selectedStudentForMessage, setSelectedStudentForMessage] = useState<any>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const mapRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/teacher/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "teacher") {
        router.push("/")
        return
      }
      setUser(parsedUser)

      // Load subjects based on department
      if (parsedUser.department) {
        const departmentSubjects = getSubjectsByDepartment(parsedUser.department)
        setSubjects(departmentSubjects)

        if (departmentSubjects.length > 0) {
          setSelectedSubject(departmentSubjects[0].id)
        }

        // Load teachers for this department
        const departmentTeachers = getTeacherByDepartment(parsedUser.department)

        // Mock students data based on department
        const mockStudents = Array.from({ length: 20 }, (_, i) => ({
          id: `S${2000 + i}`,
          name: `Student ${i + 1}`,
          branch: parsedUser.department,
          educationLevel: i % 2 === 0 ? "diploma" : "degree",
          subjects: departmentSubjects.filter((_, idx) => idx % 3 === i % 3).map((s) => s.id),
        }))

        setStudents(mockStudents)
      }

      // Set active sessions
      setActiveSessions(ACTIVE_ATTENDANCE_SESSIONS)

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
          studentId: "S2000",
          studentName: "Student 1",
          teacherId: parsedUser.id,
          teacherName: parsedUser.name || parsedUser.email,
          content: "Hello professor, I have a question about the assignment",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          sender: "student",
          read: true,
        },
        {
          id: 2,
          studentId: "S2000",
          studentName: "Student 1",
          teacherId: parsedUser.id,
          teacherName: parsedUser.name || parsedUser.email,
          content: "Sure, what's your question?",
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          sender: "teacher",
          read: true,
        },
        {
          id: 3,
          studentId: "S2001",
          studentName: "Student 2",
          teacherId: parsedUser.id,
          teacherName: parsedUser.name || parsedUser.email,
          content: "When is the next class?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          sender: "student",
          read: false,
        },
      ])
    } catch (error) {
      router.push("/teacher/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  // Update attendance records when selected subject changes
  useEffect(() => {
    if (selectedSubject) {
      const records = getAttendanceBySubject(selectedSubject)
      setAttendanceRecords(records)
    }
  }, [selectedSubject])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Filter students based on search term and selected subject
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = selectedSubject === "all" || student.subjects.includes(selectedSubject)

    return matchesSearch && matchesSubject
  })

  // Get absent students for the selected subject
  const absentStudents = students.filter((student) => {
    if (!selectedSubject || selectedSubject === "all") return false

    // Check if student is enrolled in this subject
    if (!student.subjects.includes(selectedSubject)) return false

    // Check if student has any attendance records for this subject
    const studentAttendance = attendanceRecords.filter(
      (record) => record.studentId === student.id && record.subjectId === selectedSubject,
    )

    // Calculate absence rate
    const totalRecords = studentAttendance.length
    const absentRecords = studentAttendance.filter((record) => record.status === "absent").length

    // Consider student absent if they have missed more than 20% of classes
    // or if they have no attendance records at all
    return totalRecords === 0 || absentRecords / totalRecords > 0.2
  })

  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    if (!selectedSubject || selectedSubject === "all") {
      return { totalStudents: 0, totalSessions: 0, attendanceRate: 0 }
    }

    const subjectStudents = students.filter((student) => student.subjects.includes(selectedSubject))
    const totalStudents = subjectStudents.length

    // Get attendance records for this subject
    const subjectAttendance = attendanceRecords.filter((record) => record.subjectId === selectedSubject)

    // Calculate attendance rate
    const totalSessions = new Set(subjectAttendance.map((record) => record.date)).size
    const totalPossibleAttendances = totalStudents * totalSessions
    const totalPresent = subjectAttendance.filter((record) => record.status === "present").length

    const attendanceRate = totalPossibleAttendances > 0 ? (totalPresent / totalPossibleAttendances) * 100 : 0

    return {
      totalStudents,
      totalSessions,
      attendanceRate: Math.round(attendanceRate),
    }
  }

  const stats = calculateAttendanceStats()

  const openGeofenceSettings = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    if (!subject) return

    setSelectedLocationForGeofence({
      subjectId,
      ...subject.location,
      building: subject.building,
      room: subject.room,
      subjectName: subject.name,
    })
    setShowGeofenceModal(true)

    // Initialize map
    setTimeout(() => {
      if (mapRef.current) {
        // In a real app, this would be a map initialization with a real map library
        // For this demo, we'll create a more visual map representation
        const lat = subject.location.lat
        const lng = subject.location.lng
        const radius = subject.location.radius

        mapRef.current.innerHTML = `
          <div class="bg-muted/50 rounded-md p-4 text-center">
            <div class="mb-2 font-medium">Interactive Map</div>
            <div class="bg-blue-50 h-32 rounded-md flex items-center justify-center mb-2 relative">
              <div class="absolute w-24 h-24 rounded-full border-2 border-primary/50 bg-primary/10 animate-pulse"></div>
              <div class="absolute w-4 h-4 rounded-full bg-primary"></div>
              <div class="text-xs text-muted-foreground absolute bottom-2 right-2">Radius: ${radius}m</div>
            </div>
            <div class="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Latitude: ${lat.toFixed(6)}</span>
              <span>Longitude: ${lng.toFixed(6)}</span>
            </div>
            <p class="text-xs">Click on map to set new center point</p>
            <div class="mt-2 text-xs text-muted-foreground">
              <p>In a real implementation, this would be an interactive map where you can:</p>
              <ul class="list-disc list-inside mt-1">
                <li>Click to set a new location</li>
                <li>Drag to adjust the radius</li>
                <li>See the actual building location</li>
              </ul>
            </div>
          </div>
        `
      }
    }, 100)
  }

  const saveGeofenceSettings = () => {
    if (!selectedLocationForGeofence) return

    // Update the subject location
    const updatedSubjects = subjects.map((subject) => {
      if (subject.id === selectedLocationForGeofence.subjectId) {
        return {
          ...subject,
          location: {
            lat: selectedLocationForGeofence.lat,
            lng: selectedLocationForGeofence.lng,
            radius: selectedLocationForGeofence.radius,
          },
          building: selectedLocationForGeofence.building,
          room: selectedLocationForGeofence.room,
        }
      }
      return subject
    })

    setSubjects(updatedSubjects)

    toast({
      title: "Geofence Updated",
      description: `Updated geofence settings for ${selectedLocationForGeofence.subjectName}`,
    })

    setShowGeofenceModal(false)
  }

  const handleStartAttendance = (subjectId: string) => {
    if (!user) return

    const session = startAttendanceSession(subjectId, user.id, 15)
    setActiveSessions([...activeSessions.filter((s) => s.subjectId !== subjectId), session])

    toast({
      title: "Attendance Started",
      description: "Students can now mark their attendance for the next 15 minutes",
    })
  }

  const handleEndAttendance = (subjectId: string) => {
    if (!user) return

    const success = endAttendanceSession(subjectId, user.id)
    if (success) {
      setActiveSessions(
        activeSessions.map((session) => (session.subjectId === subjectId ? { ...session, isActive: false } : session)),
      )

      toast({
        title: "Attendance Ended",
        description: "Attendance session has been closed",
      })
    }
  }

  const handleSendWarning = () => {
    if (selectedAbsentStudents.length === 0 || !warningMessage) {
      toast({
        title: "Error",
        description: "Please select students and enter a warning message",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send emails or notifications to students
    toast({
      title: "Warning Sent",
      description: `Warning sent to ${selectedAbsentStudents.length} student(s)`,
    })

    setShowWarningModal(false)
    setWarningMessage("")
    setSelectedAbsentStudents([])
  }

  const handleCreateAnnouncement = () => {
    if (!announcement.title || !announcement.content || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const subject = subjects.find((s) => s.id === selectedSubject)

    const newAnnouncement = {
      id: Date.now(),
      subjectId: selectedSubject,
      title: announcement.title,
      content: announcement.content,
      link: announcement.link,
      date: new Date().toISOString(),
      teacherName: user?.name || user?.email,
    }

    setAnnouncements([newAnnouncement, ...announcements])

    toast({
      title: "Announcement Created",
      description: "Your announcement has been published to students",
    })

    setShowAnnouncementModal(false)
    setAnnouncement({ title: "", content: "", link: "" })
  }

  const handleSendMessage = () => {
    if (!selectedStudentForMessage || !messageText) {
      toast({
        title: "Error",
        description: "Please select a student and enter a message",
        variant: "destructive",
      })
      return
    }

    const newMessage = {
      id: Date.now(),
      studentId: selectedStudentForMessage.id,
      studentName: selectedStudentForMessage.name,
      teacherId: user?.id,
      teacherName: user?.name || user?.email,
      content: messageText,
      timestamp: new Date().toISOString(),
      sender: "teacher",
      read: true,
    }

    setMessages([...messages, newMessage])

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedStudentForMessage.name}`,
    })

    setMessageText("")
  }

  useEffect(() => {
    // Simulate receiving attendance notifications
    const interval = setInterval(() => {
      // Only add a notification occasionally to simulate real usage
      if (Math.random() > 0.8 && attendanceNotifications.length < 10) {
        const randomStudent = students[Math.floor(Math.random() * students.length)]
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]

        if (!randomStudent || !randomSubject) return

        const newNotification = {
          id: Date.now(),
          studentId: randomStudent.id,
          studentName: randomStudent.name,
          subjectId: randomSubject.id,
          subjectName: randomSubject.name,
          timestamp: new Date().toISOString(),
          location: {
            lat: randomSubject.location.lat + (Math.random() * 0.001 - 0.0005),
            lng: randomSubject.location.lng + (Math.random() * 0.001 - 0.0005),
            address: `${randomSubject.building}, Room ${randomSubject.room}`,
            isInClassroom: Math.random() > 0.2, // 80% chance of being in classroom
          },
          read: false,
        }

        setAttendanceNotifications((prev) => [newNotification, ...prev])
        setUnreadNotifications((prev) => prev + 1)
      }
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [attendanceNotifications, students, subjects])

  const markAllNotificationsAsRead = () => {
    setAttendanceNotifications(
      attendanceNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
    setUnreadNotifications(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name || user?.email}</span>
            <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground">
              {user?.department
                ?.split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="text-xs h-7">
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {attendanceNotifications.length > 0 ? (
                    attendanceNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-2 ${!notification.read ? "bg-muted/50" : ""}`}
                      >
                        <div className="w-full">
                          <div className="flex justify-between">
                            <span className="font-medium">{notification.studentName}</span>
                            <span className="text-muted-foreground text-xs">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">Marked attendance for {notification.subjectName}</p>
                          <div className="mt-1">
                            {notification.location.isInClassroom ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                In classroom area
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                Outside classroom area
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle>Subject Selection</CardTitle>
              <CardDescription>Select a subject to view analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="all">All Subjects</SelectItem>
                </SelectContent>
              </Select>

              {selectedSubject !== "all" && selectedSubject && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">Subject Details:</h3>
                  {(() => {
                    const subject = subjects.find((s) => s.id === selectedSubject)

                    if (!subject) return null

                    const isActive = isAttendanceActive(subject.id)

                    return (
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {subject.time} ({subject.days})
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> {subject.building}, Room {subject.room}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4" /> {filteredStudents.length} enrolled students
                        </p>

                        <div className="pt-2 flex gap-2">
                          {isActive ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full flex items-center gap-1"
                              onClick={() => handleEndAttendance(subject.id)}
                            >
                              <Stop className="h-3 w-3" /> End Attendance
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full flex items-center gap-1"
                              onClick={() => handleStartAttendance(subject.id)}
                            >
                              <Play className="h-3 w-3" /> Start Attendance
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => openGeofenceSettings(subject.id)}
                          >
                            <MapPin className="h-3 w-3" /> Geofence
                          </Button>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center gap-1"
                            onClick={() => setShowAnnouncementModal(true)}
                          >
                            <Megaphone className="h-3 w-3" /> Announcement
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center gap-1"
                            onClick={() => {
                              setSelectedAbsentStudents(absentStudents)
                              setShowWarningModal(true)
                            }}
                          >
                            <AlertTriangle className="h-3 w-3" /> Warnings
                          </Button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                {selectedSubject !== "all"
                  ? `Attendance statistics for ${subjects.find((s) => s.id === selectedSubject)?.name || selectedSubject}`
                  : "Overall attendance statistics"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <h3 className="text-muted-foreground text-sm font-medium mb-2">Total Students</h3>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <h3 className="text-muted-foreground text-sm font-medium mb-2">Sessions</h3>
                <p className="text-3xl font-bold">{stats.totalSessions}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <h3 className="text-muted-foreground text-sm font-medium mb-2">Attendance Rate</h3>
                <p className="text-3xl font-bold">{stats.attendanceRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="absent">Absent Students</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Student Attendance</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search students..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription>
                  {selectedSubject !== "all"
                    ? `Students enrolled in ${subjects.find((s) => s.id === selectedSubject)?.name || selectedSubject}`
                    : "All students"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Education Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                          // Calculate student's attendance rate for the selected subject
                          const studentAttendance = attendanceRecords.filter(
                            (record) =>
                              record.studentId === student.id &&
                              (selectedSubject === "all" || record.subjectId === selectedSubject),
                          )

                          const presentCount = studentAttendance.filter((record) => record.status === "present").length
                          const attendanceRate =
                            studentAttendance.length > 0 ? (presentCount / studentAttendance.length) * 100 : 0

                          return (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{student.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                                {student.educationLevel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-muted rounded-full h-2.5">
                                    <div
                                      className={`h-2.5 rounded-full ${
                                        attendanceRate >= 80
                                          ? "bg-green-500"
                                          : attendanceRate >= 60
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                      }`}
                                      style={{ width: `${attendanceRate}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-xs font-medium">{Math.round(attendanceRate)}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setSelectedStudentForMessage(student)
                                    setShowMessagingModal(true)
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">
                            No students found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>
                  {selectedSubject !== "all"
                    ? `Attendance trends for ${subjects.find((s) => s.id === selectedSubject)?.name || selectedSubject}`
                    : "Overall attendance trends"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {attendanceRecords.length > 0 ? (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-xs">Present</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                            <span className="text-xs">Absent</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <BarChart3 className="h-4 w-4 inline mr-1" />
                          Attendance by date
                        </div>
                      </div>

                      <div className="space-y-2">
                        {Array.from(new Set(attendanceRecords.map((record) => record.date))).map((date) => {
                          const dayRecords = attendanceRecords.filter((record) => record.date === date)
                          const present = dayRecords.filter((record) => record.status === "present").length
                          const absent = dayRecords.filter((record) => record.status === "absent").length
                          const total = present + absent
                          const presentPercentage = total > 0 ? (present / total) * 100 : 0
                          const absentPercentage = total > 0 ? (absent / total) * 100 : 0

                          return (
                            <div key={date} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{new Date(date).toLocaleDateString()}</span>
                                <span>
                                  {present} present, {absent} absent
                                </span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                                <div className="h-full bg-primary" style={{ width: `${presentPercentage}%` }}></div>
                                <div
                                  className="h-full bg-destructive/70"
                                  style={{ width: `${absentPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p>No attendance data available for this subject</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geofencing Settings</CardTitle>
                  <CardDescription>Configure classroom location boundaries</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSubject !== "all" ? (
                    <div className="space-y-4">
                      {(() => {
                        const subject = subjects.find((s) => s.id === selectedSubject)
                        if (!subject) return null

                        return (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-sm font-medium">Current Location</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {subject.building}, Room {subject.room}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {subject.location.radius}m radius
                                </Badge>
                              </div>

                              <div className="rounded-md border p-3 bg-muted/30 text-xs space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Latitude:</span>
                                  <span>{subject.location.lat}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Longitude:</span>
                                  <span>{subject.location.lng}</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2">
                              <Button onClick={() => openGeofenceSettings(selectedSubject)} className="w-full">
                                Configure Geofence
                              </Button>
                            </div>

                            <div className="pt-2">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="email-notifications" className="text-sm">
                                    Email Notifications
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    Receive emails when students mark attendance
                                  </p>
                                </div>
                                <Switch
                                  id="email-notifications"
                                  checked={emailNotificationsEnabled}
                                  onCheckedChange={setEmailNotificationsEnabled}
                                />
                              </div>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Please select a specific subject to configure geofencing</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Manage subject announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={() => setShowAnnouncementModal(true)} className="w-full">
                      Create New Announcement
                    </Button>

                    <div className="space-y-2">
                      {announcements
                        .filter((a) => selectedSubject === "all" || a.subjectId === selectedSubject)
                        .map((announcement) => (
                          <div key={announcement.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{announcement.title}</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(announcement.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{announcement.content}</p>
                            {announcement.link && (
                              <a
                                href={announcement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline mt-1 inline-block"
                              >
                                View Resource
                              </a>
                            )}
                          </div>
                        ))}

                      {announcements.filter((a) => selectedSubject === "all" || a.subjectId === selectedSubject)
                        .length === 0 && (
                        <div className="text-center py-4 text-sm text-muted-foreground border rounded-md">
                          <p>No announcements for this subject</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="absent">
            <Card>
              <CardHeader>
                <CardTitle>Absent Students</CardTitle>
                <CardDescription>Students with poor attendance or who have missed recent classes</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSubject !== "all" ? (
                  <div className="space-y-4">
                    {absentStudents.length > 0 ? (
                      <>
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-border">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Education Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Last Attendance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                              {absentStudents.map((student) => {
                                // Find last attendance record
                                const lastRecord = attendanceRecords
                                  .filter(
                                    (record) => record.studentId === student.id && record.subjectId === selectedSubject,
                                  )
                                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

                                return (
                                  <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                                      {student.educationLevel}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {lastRecord ? (
                                        <span className={lastRecord.status === "absent" ? "text-red-500" : ""}>
                                          {new Date(lastRecord.date).toLocaleDateString()} - {lastRecord.status}
                                        </span>
                                      ) : (
                                        <span className="text-red-500">Never attended</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedAbsentStudents([student])
                                            setShowWarningModal(true)
                                          }}
                                        >
                                          Send Warning
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => {
                                            setSelectedStudentForMessage(student)
                                            setShowMessagingModal(true)
                                          }}
                                        >
                                          <MessageSquare className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        <Button
                          onClick={() => {
                            setSelectedAbsentStudents(absentStudents)
                            setShowWarningModal(true)
                          }}
                        >
                          Send Warning to All
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border rounded-md">
                        <p>No absent students for this subject</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Please select a specific subject to view absent students</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Student Messages</CardTitle>
                <CardDescription>Communication with students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted p-3 font-medium">Students</div>
                      <div className="divide-y">
                        {students.map((student) => {
                          const unreadCount = messages.filter(
                            (m) => m.studentId === student.id && m.sender === "student" && !m.read,
                          ).length

                          return (
                            <button
                              key={student.id}
                              className={`w-full text-left p-3 hover:bg-muted/50 ${selectedStudentForMessage?.id === student.id ? "bg-muted/50" : ""}`}
                              onClick={() => setSelectedStudentForMessage(student)}
                            >
                              <div className="flex justify-between items-center">
                                <span>{student.name}</span>
                                {unreadCount > 0 && <Badge className="bg-primary">{unreadCount}</Badge>}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden md:col-span-2">
                      {selectedStudentForMessage ? (
                        <>
                          <div className="bg-muted p-3 font-medium">{selectedStudentForMessage.name}</div>
                          <div className="h-64 overflow-y-auto p-3 space-y-3">
                            {messages
                              .filter((m) => m.studentId === selectedStudentForMessage.id)
                              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                              .map((message) => (
                                <div
                                  key={message.id}
                                  className={`p-2 rounded-lg max-w-[80%] ${
                                    message.sender === "teacher"
                                      ? "bg-primary text-primary-foreground ml-auto"
                                      : "bg-muted"
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs text-right mt-1 opacity-70">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              ))}
                          </div>
                          <div className="p-3 border-t flex gap-2">
                            <Input
                              placeholder="Type your message..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && messageText.trim()) {
                                  handleSendMessage()
                                }
                              }}
                            />
                            <Button size="icon" onClick={handleSendMessage} disabled={!messageText.trim()}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="h-72 flex items-center justify-center text-muted-foreground">
                          <p>Select a student to view messages</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Warning Modal */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Attendance Warning</DialogTitle>
            <DialogDescription>Send a warning message to students with poor attendance</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Recipients ({selectedAbsentStudents.length})</Label>
              <div className="border rounded-md p-2 max-h-24 overflow-y-auto">
                {selectedAbsentStudents.map((student) => (
                  <Badge key={student.id} variant="outline" className="mr-1 mb-1">
                    {student.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warning-message">Warning Message</Label>
              <Textarea
                id="warning-message"
                placeholder="Enter your warning message..."
                value={warningMessage}
                onChange={(e) => setWarningMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarningModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendWarning}>Send Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Announcement Modal */}
      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>Create a new announcement for your students</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input
                id="announcement-title"
                placeholder="Enter announcement title"
                value={announcement.title}
                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-content">Content</Label>
              <Textarea
                id="announcement-content"
                placeholder="Enter announcement content"
                value={announcement.content}
                onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-link">Resource Link (Optional)</Label>
              <Input
                id="announcement-link"
                placeholder="https://example.com/resource"
                value={announcement.link}
                onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement}>Publish Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Geofence Settings Modal */}
      <Dialog open={showGeofenceModal} onOpenChange={setShowGeofenceModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure Geofence</DialogTitle>
            <DialogDescription>Set the location and radius for attendance verification</DialogDescription>
          </DialogHeader>

          {selectedLocationForGeofence && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={selectedLocationForGeofence.subjectName} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Building & Room</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Building"
                    value={selectedLocationForGeofence.building}
                    onChange={(e) =>
                      setSelectedLocationForGeofence({
                        ...selectedLocationForGeofence,
                        building: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Room"
                    value={selectedLocationForGeofence.room}
                    onChange={(e) =>
                      setSelectedLocationForGeofence({
                        ...selectedLocationForGeofence,
                        room: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Map Location</Label>
                <div ref={mapRef} className="w-full h-40 bg-muted rounded-md border"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={selectedLocationForGeofence.lat}
                    onChange={(e) =>
                      setSelectedLocationForGeofence({
                        ...selectedLocationForGeofence,
                        lat: Number.parseFloat(e.target.value) || selectedLocationForGeofence.lat,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={selectedLocationForGeofence.lng}
                    onChange={(e) =>
                      setSelectedLocationForGeofence({
                        ...selectedLocationForGeofence,
                        lng: Number.parseFloat(e.target.value) || selectedLocationForGeofence.lng,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="radius">Allowed Radius (meters)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={selectedLocationForGeofence.radius}
                  onChange={(e) =>
                    setSelectedLocationForGeofence({
                      ...selectedLocationForGeofence,
                      radius: Number.parseInt(e.target.value) || selectedLocationForGeofence.radius,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Students must be within this distance from the center point to mark attendance
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGeofenceModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveGeofenceSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

