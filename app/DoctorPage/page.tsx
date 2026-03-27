"use client";
import { useState, FormEvent, useEffect } from "react";
import "./globals.css";
export default function DoctorPage() {
  // ==========================================
  // 1. حالات تسجيل الدخول
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ==========================================
  // 2. حالات الإضافة والعرض
  // ==========================================
  const [viewMode, setViewMode] = useState("add"); // 'add' أو 'list'
  const [diseasesList, setDiseasesList] = useState<any[]>([]); // لتخزين قائمة الأمراض
  
  const [name, setName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // دالة تسجيل الدخول
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "doctor" && password === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة ❌");
    }
  };

  // دالة جلب البيانات من الخادم
  const fetchDiseases = async () => {
    try {
      const res = await fetch("/api/get-diseases");
      if (res.ok) {
        const data = await res.json();
        setDiseasesList(data);
      }
    } catch (error) {
      console.error("فشل جلب السجل", error);
    }
  };

  // عند تغيير التبويب إلى "السجل"، نقوم بجلب البيانات
  useEffect(() => {
    if (viewMode === "list") {
      fetchDiseases();
    }
  }, [viewMode]);

  // دالة الحفظ
  const handleAddDisease = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !symptoms.trim()) {
      setStatusMessage("يرجى تعبئة الحقول الأساسية.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/add-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, common_name: commonName, symptoms, severity }),
      });

      if (!res.ok) throw new Error("فشل في الحفظ");

      setStatusMessage("تمت إضافة المرض إلى قاعدة البيانات بنجاح! ✅");
      setName(""); setCommonName(""); setSymptoms(""); setSeverity("Medium");
    } catch (error) {
      console.error(error);
      setStatusMessage("حدث خطأ أثناء الاتصال بالخادم. ❌");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  // شاشة الدخول
  if (!isLoggedIn) {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-header">
            <strong>Doctor Login</strong>
            <p>Please enter your credentials</p>
          </div>
          <form onSubmit={handleLogin} className="doctor-form">
            <div className="input-group">
              <label>Username</label>
              <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="button submit-btn">Login</button>
            {loginError && <div className="status-message error">{loginError}</div>}
          </form>
        </div>
      </div>
    );
  }

  // لوحة التحكم
  return (
    <div className="form-wrapper">
      <div className="form-container" style={{ maxWidth: viewMode === "list" ? "800px" : "550px" }}>
        
        <div className="form-header">
          <strong>Doctor Dashboard</strong>
          
          {/* أزرار التنقل بين الإضافة والسجل */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" }}>
            <button 
              onClick={() => setViewMode("add")} 
              style={{ padding: "8px 15px", borderRadius: "5px", background: viewMode === "add" ? "#ff0101" : "#333", color: "#fff", border: "none", cursor: "pointer" }}
            >
              ➕ Add Disease
            </button>
            <button 
              onClick={() => setViewMode("list")} 
              style={{ padding: "8px 15px", borderRadius: "5px", background: viewMode === "list" ? "#ff0101" : "#333", color: "#fff", border: "none", cursor: "pointer" }}
            >
              📋 View Records
            </button>
            <button onClick={() => setIsLoggedIn(false)} style={{ padding: "8px 15px", borderRadius: "5px", background: "transparent", color: "#888", border: "1px solid #888", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* واجهة إضافة مرض */}
        {viewMode === "add" && (
          <form onSubmit={handleAddDisease} className="doctor-form">
            <div className="input-group">
              <label>Medical Name</label>
              <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Myocardial Infarction" />
            </div>
            <div className="input-group">
              <label>Common Name</label>
              <input type="text" className="input" value={commonName} onChange={(e) => setCommonName(e.target.value)} placeholder="e.g., Heart Attack" />
            </div>
            <div className="input-group">
              <label>Severity</label>
              <select className="input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="input-group">
              <label>Symptoms (افصل بينها بفاصلة)</label>
              <textarea className="input textarea" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., Chest pain, Shortness of breath" rows={3} />
            </div>
            <button type="submit" className="button submit-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save to Database"}
            </button>
            {statusMessage && <div className={`status-message ${statusMessage.includes("نجاح") ? "success" : "error"}`}>{statusMessage}</div>}
          </form>
        )}

        {/* واجهة عرض السجل (الجدول) */}
        {viewMode === "list" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ff0101" }}>
                  <th style={{ padding: "12px" }}>ID</th>
                  <th style={{ padding: "12px" }}>Disease Name</th>
                  <th style={{ padding: "12px" }}>Severity</th>
                  <th style={{ padding: "12px" }}>Symptoms</th>
                </tr>
              </thead>
              <tbody>
                {diseasesList.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>No records found.</td></tr>
                ) : (
                  diseasesList.map((disease) => (
                    <tr key={disease.id} style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "12px" }}>#{disease.id}</td>
                      <td style={{ padding: "12px" }}>
                        <strong>{disease.name}</strong><br/>
                        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>({disease.common_name})</span>
                      </td>
                      <td style={{ padding: "12px", color: disease.severity === "Critical" || disease.severity === "High" ? "#ff4444" : "#4caf50" }}>
                        {disease.severity}
                      </td>
                      <td style={{ padding: "12px", fontSize: "0.85rem", color: "#ccc" }}>
                        {disease.symptoms.join("، ")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}