import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-Attendance system',
  description: 'Created by:- Debashis Deb',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
