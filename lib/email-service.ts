/**
 * Email service for sending attendance notifications
 * In a real application, this would use a service like  Mailgun.
 */

export interface AttendanceEmailData {
  studentId: string
  studentName?: string
  courseId: string
  courseName?: string
  timestamp: string
  location: {
    lat: number
    lng: number
    address?: string
    distance?: number
    isInClassroom: boolean
  }
  teacherEmail?: string
}

/**
 * Send an email notification for student attendance{gourabd734@gmail.com: example}
 */
export async function sendAttendanceEmail(data: AttendanceEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real application, this would call an API endpoint or email service[will send emails]
    console.log("Sending attendance email notification:", data)

    // Formats the email content
    const emailSubject = `Attendance Notification - ${data.courseName || data.courseId}`

    const emailBody = `
      Student: ${data.studentName || data.studentId}
      Course: ${data.courseName || data.courseId}
      Time: ${new Date(data.timestamp).toLocaleString()}
      Location: ${data.location.address || `${data.location.lat.toFixed(6)}, ${data.location.lng.toFixed(6)}`}
      ${data.location.distance !== undefined ? `Distance from classroom: ${data.location.distance}m` : ""}
      Status: ${data.location.isInClassroom ? "Present (In classroom area)" : "Absent (Outside classroom area)"}
      
      This is an automated notification from the E-Attendance System.
    `

    // Simulate API call to send email[for sending details and service info]
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        emailSubject,
        emailBody,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send email notification")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending email notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    }
  }
}

