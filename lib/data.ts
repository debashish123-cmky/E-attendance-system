// Comprehensive data model for the attendance system{gand faad code }

// Subject data with branch and education level information [ made this for understanding :)]
export interface Subject {
  id: string
  name: string
  code: string
  branch: string
  educationLevel: string
  teacherId: string
  teacherName: string
  time: string
  days: string
  building: string
  room: string
  location: {
    lat: number
    lng: number
    radius: number
  }
}

// Teacher data
export interface Teacher {
  id: string
  name: string
  email: string
  department: string
  subjects: string[] // Subject IDs
}

// Student data
export interface Student {
  id: string
  name: string
  branch: string
  educationLevel: string
  subjects: string[] // Subject IDs
}

// Attendance record
export interface AttendanceRecord {
  id: number
  studentId: string
  studentName: string
  subjectId: string
  date: string
  status: "present" | "absent"
  location?: {
    lat: number
    lng: number
    distance: number
  }
  timestamp: string
}

// Mock subjects data
export const SUBJECTS: Subject[] = [
  // Computer Science - Diploma
  {
    id: "cs101",
    name: "Introduction to Programming",
    code: "CS101",
    branch: "computer-science",
    educationLevel: "diploma",
    teacherId: "T1001",
    teacherName: "Dr. Alan Turing",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "CS Building",
    room: "101",
    location: { lat: 37.7749, lng: -122.4194, radius: 100 },
  },
  {
    id: "cs102",
    name: "Data Structures",
    code: "CS102",
    branch: "computer-science",
    educationLevel: "diploma",
    teacherId: "T1001",
    teacherName: "Dr. Alan Turing",
    time: "11:00 AM - 12:30 PM",
    days: "Tue, Thu",
    building: "CS Building",
    room: "102",
    location: { lat: 37.775, lng: -122.4195, radius: 100 },
  },
  {
    id: "cs103",
    name: "Database Management",
    code: "CS103",
    branch: "computer-science",
    educationLevel: "diploma",
    teacherId: "T1002",
    teacherName: "Prof. Ada Lovelace",
    time: "02:00 PM - 03:30 PM",
    days: "Mon, Wed",
    building: "CS Building",
    room: "103",
    location: { lat: 37.7751, lng: -122.4196, radius: 100 },
  },

  // Computer Science - Degree[like : ronit da ]
  {
    id: "cs201",
    name: "Advanced Programming",
    code: "CS201",
    branch: "computer-science",
    educationLevel: "degree",
    teacherId: "T1002",
    teacherName: "Prof. Ada Lovelace",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "CS Building",
    room: "201",
    location: { lat: 37.7752, lng: -122.4197, radius: 100 },
  },
  {
    id: "cs202",
    name: "Algorithms",
    code: "CS202",
    branch: "computer-science",
    educationLevel: "degree",
    teacherId: "T1003",
    teacherName: "Dr. Grace Hopper",
    time: "11:00 AM - 12:30 PM",
    days: "Tue, Thu",
    building: "CS Building",
    room: "202",
    location: { lat: 37.7753, lng: -122.4198, radius: 100 },
  },
  {
    id: "cs203",
    name: "Operating Systems",
    code: "CS203",
    branch: "computer-science",
    educationLevel: "degree",
    teacherId: "T1003",
    teacherName: "Dr. Grace Hopper",
    time: "02:00 PM - 03:30 PM",
    days: "Mon, Wed",
    building: "CS Building",
    room: "203",
    location: { lat: 37.7754, lng: -122.4199, radius: 100 },
  },

  // Electrical Engineering - Diploma [ debashsis , anup , gourav , sayan ]
  {
    id: "ee101",
    name: "Basic Electrical Engineering",
    code: "EE101",
    branch: "electrical",
    educationLevel: "diploma",
    teacherId: "T1004",
    teacherName: "Prof. Nikola Tesla",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "EE Building",
    room: "101",
    location: { lat: 37.7755, lng: -122.42, radius: 100 },
  },
  {
    id: "ee102",
    name: "Circuit Theory",
    code: "EE102",
    branch: "electrical",
    educationLevel: "diploma",
    teacherId: "T1004",
    teacherName: "Prof. Nikola Tesla",
    time: "11:00 AM - 12:30 PM",
    days: "Tue, Thu",
    building: "EE Building",
    room: "102",
    location: { lat: 37.7756, lng: -122.4201, radius: 100 },
  },

  // Electrical Engineering - Degree
  {
    id: "ee201",
    name: "Power Systems",
    code: "EE201",
    branch: "electrical",
    educationLevel: "degree",
    teacherId: "T1005",
    teacherName: "Dr. Thomas Edison",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "EE Building",
    room: "201",
    location: { lat: 37.7757, lng: -122.4202, radius: 100 },
  },
  {
    id: "ee202",
    name: "Control Systems",
    code: "EE202",
    branch: "electrical",
    educationLevel: "degree",
    teacherId: "T1005",
    teacherName: "Dr. Thomas Edison",
    time: "11:00 AM - 12:30 PM",
    days: "Tue, Thu",
    building: "EE Building",
    room: "202",
    location: { lat: 37.7758, lng: -122.4203, radius: 100 },
  },

  // Mechanical Engineering - Diploma
  {
    id: "me101",
    name: "Engineering Mechanics",
    code: "ME101",
    branch: "mechanical",
    educationLevel: "diploma",
    teacherId: "T1006",
    teacherName: "Prof. Isaac Newton",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "ME Building",
    room: "101",
    location: { lat: 37.7759, lng: -122.4204, radius: 100 },
  },

  // Mechanical Engineering - Degree
  {
    id: "me201",
    name: "Thermodynamics",
    code: "ME201",
    branch: "mechanical",
    educationLevel: "degree",
    teacherId: "T1007",
    teacherName: "Dr. Albert Einstein",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "ME Building",
    room: "201",
    location: { lat: 37.776, lng: -122.4205, radius: 100 },
  },

  // Civil Engineering - Diploma
  {
    id: "ce101",
    name: "Surveying",
    code: "CE101",
    branch: "civil",
    educationLevel: "diploma",
    teacherId: "T1008",
    teacherName: "Prof. Isambard Brunel",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "CE Building",
    room: "101",
    location: { lat: 37.7761, lng: -122.4206, radius: 100 },
  },

  // Civil Engineering - Degree
  {
    id: "ce201",
    name: "Structural Engineering",
    code: "CE201",
    branch: "civil",
    educationLevel: "degree",
    teacherId: "T1009",
    teacherName: "Dr. Emily Warren",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "CE Building",
    room: "201",
    location: { lat: 37.7762, lng: -122.4207, radius: 100 },
  },

  // Electronics & Communication - Diploma
  {
    id: "ec101",
    name: "Electronic Devices",
    code: "EC101",
    branch: "electronics",
    educationLevel: "diploma",
    teacherId: "T1010",
    teacherName: "Prof. Marie Curie",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "EC Building",
    room: "101",
    location: { lat: 37.7763, lng: -122.4208, radius: 100 },
  },

  // Electronics & Communication - Degree
  {
    id: "ec201",
    name: "Digital Signal Processing",
    code: "EC201",
    branch: "electronics",
    educationLevel: "degree",
    teacherId: "T1011",
    teacherName: "Dr. Heinrich Hertz",
    time: "09:00 AM - 10:30 AM",
    days: "Mon, Wed, Fri",
    building: "EC Building",
    room: "201",
    location: { lat: 37.7764, lng: -122.4209, radius: 100 },
  },
]

// Mock teachers data
export const TEACHERS: Teacher[] = [
  {
    id: "T1001",
    name: "Dr. Alan Turing",
    email: "alan.turing@college.edu",
    department: "computer-science",
    subjects: ["cs101", "cs102"],
  },
  {
    id: "T1002",
    name: "Prof. Ada Lovelace",
    email: "ada.lovelace@college.edu",
    department: "computer-science",
    subjects: ["cs103", "cs201"],
  },
  {
    id: "T1003",
    name: "Dr. Grace Hopper",
    email: "grace.hopper@college.edu",
    department: "computer-science",
    subjects: ["cs202", "cs203"],
  },
  {
    id: "T1004",
    name: "Prof. Nikola Tesla",
    email: "nikola.tesla@college.edu",
    department: "electrical",
    subjects: ["ee101", "ee102"],
  },
  {
    id: "T1005",
    name: "Dr. Thomas Edison",
    email: "thomas.edison@college.edu",
    department: "electrical",
    subjects: ["ee201", "ee202"],
  },
  {
    id: "T1006",
    name: "Prof. Isaac Newton",
    email: "isaac.newton@college.edu",
    department: "mechanical",
    subjects: ["me101"],
  },
  {
    id: "T1007",
    name: "Dr. Albert Einstein",
    email: "albert.einstein@college.edu",
    department: "mechanical",
    subjects: ["me201"],
  },
  {
    id: "T1008",
    name: "Prof. Isambard Brunel",
    email: "isambard.brunel@college.edu",
    department: "civil",
    subjects: ["ce101"],
  },
  {
    id: "T1009",
    name: "Dr. Emily Warren",
    email: "emily.warren@college.edu",
    department: "civil",
    subjects: ["ce201"],
  },
  {
    id: "T1010",
    name: "Prof. Marie Curie",
    email: "marie.curie@college.edu",
    department: "electronics",
    subjects: ["ec101"],
  },
  {
    id: "T1011",
    name: "Dr. Heinrich Hertz",
    email: "heinrich.hertz@college.edu",
    department: "electronics",
    subjects: ["ec201"],
  },
]

// Mock students data
export const STUDENTS: Student[] = [
  {
    id: "S1001",
    name: "Debashis Deb",
    branch: "computer-science and technology",
    educationLevel: "diploma",
    subjects: ["cs101", "cs102", "cs103"],
  },
  {
    id: "S1002",
    name: "Gourav das",
    branch: "computer-science",
    educationLevel: "degree",
    subjects: ["cs201", "cs202", "cs203"],
  },
  {
    id: "S1003",
    name: "Anup sarkar",
    branch: "electrical",
    educationLevel: "diploma",
    subjects: ["ee101", "ee102"],
  },
  {
    id: "S1004",
    name: "Sayan dey",
    branch: "electrical",
    educationLevel: "degree",
    subjects: ["ee201", "ee202"],
  },
  {
    id: "S1005",
    name: "spandan pal",
    branch: "mechanical",
    educationLevel: "diploma",
    subjects: ["me101"],
  },
  {
    id: "S1006",
    name: "adlof hitler",
    branch: "mechanical",
    educationLevel: "degree",
    subjects: ["me201"],
  },
  {
    id: "S1007",
    name: "cristiano ronaldo",
    branch: "civil",
    educationLevel: "diploma",
    subjects: ["ce101"],
  },
  {
    id: "S1008",
    name: "ishow speed",
    branch: "civil",
    educationLevel: "degree",
    subjects: ["ce201"],
  },
  {
    id: "S1009",
    name: "George Martinez",
    branch: "electronics",
    educationLevel: "diploma",
    subjects: ["ec101"],
  },
  {
    id: "S1010",
    name: "parag pal",
    branch: "electronics",
    educationLevel: "degree",
    subjects: ["ec201"],
  },
]

// Mock attendance records
export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  // CS101 attendance
  {
    id: 1,
    studentId: "S1001",
    studentName: "Debashis Deb",
    subjectId: "cs101",
    date: "2023-10-01",
    status: "present",
    location: {
      lat: 37.7749,
      lng: -122.4194,
      distance: 20,
    },
    timestamp: "2023-10-01T09:15:00Z",
  },
  {
    id: 2,
    studentId: "S1001",
    studentName: "Gourav das",
    subjectId: "cs101",
    date: "2023-10-03",
    status: "present",
    location: {
      lat: 37.7749,
      lng: -122.4194,
      distance: 15,
    },
    timestamp: "2023-10-03T09:10:00Z",
  },
  {
    id: 3,
    studentId: "S1001",
    studentName: "Anup sarkar",
    subjectId: "cs101",
    date: "2025-10-05",
    status: "absent",
    timestamp: "2025-03-05T09:00:00Z",
  },

  // CS102 attendance
  {
    id: 4,
    studentId: "S1001",
    studentName: "sayan dey",
    subjectId: "cs102",
    date: "2025-13-02",
    status: "present",
    location: {
      lat: 37.775,
      lng: -122.4195,
      distance: 25,
    },
    timestamp: "2025-03-02T11:05:00Z",
  },
  {
    id: 5,
    studentId: "S1001",
    studentName: "John Doe",
    subjectId: "cs102",
    date: "2023-10-04",
    status: "present",
    location: {
      lat: 37.775,
      lng: -122.4195,
      distance: 30,
    },
    timestamp: "2023-10-04T11:08:00Z",
  },

  // EE101 attendance
  {
    id: 6,
    studentId: "S1003",
    studentName: "Bob Johnson",
    subjectId: "ee101",
    date: "2023-10-01",
    status: "present",
    location: {
      lat: 37.7755,
      lng: -122.42,
      distance: 10,
    },
    timestamp: "2023-10-01T09:05:00Z",
  },
  {
    id: 7,
    studentId: "S1003",
    studentName: "Bob Johnson",
    subjectId: "ee101",
    date: "2023-10-03",
    status: "absent",
    timestamp: "2023-10-03T09:00:00Z",
  },
]

// Function to get subjects by branch and education level
export function getSubjectsByBranchAndLevel(branch: string, educationLevel: string): Subject[] {
  return SUBJECTS.filter((subject) => subject.branch === branch && subject.educationLevel === educationLevel)
}

// Function to get subjects by teacher
export function getSubjectsByTeacher(teacherId: string): Subject[] {
  return SUBJECTS.filter((subject) => subject.teacherId === teacherId)
}

// Function to get subjects by department
export function getSubjectsByDepartment(department: string): Subject[] {
  return SUBJECTS.filter((subject) => subject.branch === department)
}

// Function to get attendance records by subject
export function getAttendanceBySubject(subjectId: string): AttendanceRecord[] {
  return ATTENDANCE_RECORDS.filter((record) => record.subjectId === subjectId)
}

// Function to get attendance records by student
export function getAttendanceByStudent(studentId: string): AttendanceRecord[] {
  return ATTENDANCE_RECORDS.filter((record) => record.studentId === studentId)
}

// Function to get teacher by department
export function getTeacherByDepartment(department: string): Teacher[] {
  return TEACHERS.filter((teacher) => teacher.department === department)
}

// Function to get teacher by ID
export function getTeacherById(teacherId: string): Teacher | undefined {
  return TEACHERS.find((teacher) => teacher.id === teacherId)
}

// Function to get subject by ID
export function getSubjectById(subjectId: string): Subject | undefined {
  return SUBJECTS.find((subject) => subject.id === subjectId)
}

// Active attendance sessions (controlled by teachers)
export interface AttendanceSession {
  subjectId: string
  startTime: string
  endTime: string
  isActive: boolean
  teacherId: string
}

// Mock active attendance sessions
export let ACTIVE_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    subjectId: "cs101",
    startTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    endTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
    isActive: true,
    teacherId: "T1001",
  },
]

// Function to check if attendance is active for a subject
export function isAttendanceActive(subjectId: string): boolean {
  const session = ACTIVE_ATTENDANCE_SESSIONS.find((session) => session.subjectId === subjectId && session.isActive)

  if (!session) return false

  const now = new Date()
  const startTime = new Date(session.startTime)
  const endTime = new Date(session.endTime)

  return now >= startTime && now <= endTime
}

// Function to start attendance session
export function startAttendanceSession(subjectId: string, teacherId: string, durationMinutes = 15): AttendanceSession {
  // End any existing sessions for this subject
  ACTIVE_ATTENDANCE_SESSIONS = ACTIVE_ATTENDANCE_SESSIONS.map((session) => {
    if (session.subjectId === subjectId) {
      return { ...session, isActive: false }
    }
    return session
  })

  // Create new session
  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000)

  const newSession: AttendanceSession = {
    subjectId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    isActive: true,
    teacherId,
  }

  ACTIVE_ATTENDANCE_SESSIONS.push(newSession)
  return newSession
}

// Function to end attendance session
export function endAttendanceSession(subjectId: string, teacherId: string): boolean {
  let found = false

  ACTIVE_ATTENDANCE_SESSIONS = ACTIVE_ATTENDANCE_SESSIONS.map((session) => {
    if (session.subjectId === subjectId && session.teacherId === teacherId && session.isActive) {
      found = true
      return { ...session, isActive: false }
    }
    return session
  })

  return found
}

