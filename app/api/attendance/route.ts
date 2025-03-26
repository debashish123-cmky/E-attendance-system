import { NextResponse } from "next/server"

// This would be a database in a real application
const attendanceRecords: any[] = []

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.studentId || !data.courseId || !data.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString()
    }

    // Store the attendance record
    const record = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    attendanceRecords.push(record)

    // In a real application, we would send an email here
    if (data.location.isInClassroom && data.sendEmail !== false) {
      await sendAttendanceEmail(record)
    }

    return NextResponse.json({ success: true, record })
  } catch (error) {
    console.error("Error processing attendance:", error)
    return NextResponse.json({ error: "Failed to process attendance" }, { status: 500 })
  }
}

async function sendAttendanceEmail(record: any) {
  // This is a mock function - in a real app, you would use a service like SendGrid, Mailgun, etc.
  console.log("Sending email notification for attendance:", record)

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Email content would look something like this:
  const emailContent = `
    Subject: Attendance Notification - ${record.courseName || record.courseId}
    
    Student: ${record.studentName || record.studentId}
    Course: ${record.courseName || record.courseId}
    Time: ${new Date(record.timestamp).toLocaleString()}
    Location: ${record.location.address || "Unknown location"}
    Distance from classroom: ${record.location.distance}m
    Status: ${record.location.isInClassroom ? "Present (In classroom area)" : "Absent (Outside classroom area)"}
    
    This is an automated notification from the E-Attendance System.
  `

  console.log("Email would be sent with content:", emailContent)

  return { success: true }
}

export async function GET() {
  // Return the last 50 attendance records
  return NextResponse.json({
    records: attendanceRecords.slice(-50).reverse(),
  })
}

