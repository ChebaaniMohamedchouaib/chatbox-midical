import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="options">
        <div className="option" id="Patient">
          <Link
            href="/PatientPage"
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Image src="/Patent.svg" alt="Patient Logo" width={100} height={100} />
            <strong style={{ color: "black", marginTop: "15px" }}>Patient</strong>
          </Link>
        </div>
        <div className="option" id="Doctor">
          <Link
            href="/DoctorPage"
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Image src="/Doctor.svg" alt="Doctor Logo" width={100} height={100} />
            <strong style={{ color: "black", marginTop: "15px" }}>Doctor</strong>
          </Link>
        </div>

      </div>
    </main>
  );
}