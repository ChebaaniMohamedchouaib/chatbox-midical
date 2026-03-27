import "./globals.css";
import Link from "next/link"; // استيراد أداة الروابط

export const metadata = {
  title: "Cardiology Assistant",
  description: "AI-powered medical consultation and diagnostic system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* شريط التنقل العلوي (يظهر في كل الصفحات) */}
        <nav className="navbar">
          <div className="nav-logo">
            {/* يمكنك تغيير اسم التطبيق هنا */}
            <Link href="/">❤️ CardioCare</Link>
          </div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/PatientPage">Patient Chat</Link></li>
            <li><Link href="/DoctorPage">Doctor Dashboard</Link></li>
          </ul>
        </nav>

        {/* محتوى الصفحات المتغير */}
        <div className="page-content">
          {children}
        </div>
      </body>
    </html>
  );
}