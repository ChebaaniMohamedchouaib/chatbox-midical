import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const newDiseaseData = await req.json();

    // 1. تحديد مسارات الملفات
    const filePath = path.join(process.cwd(), 'heart_diseases.json'); 
    const file1 = path.join(process.cwd(), 'doctorNote.json'); // الملف الجديد

    let diseases = [];
    let doctorNotes = []; // مصفوفة خاصة بالملف الجديد

    // ==========================================
    // 2. قراءة الملف الأول (heart_diseases.json)
    // ==========================================
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      if (fileData.trim() !== "") {
        diseases = JSON.parse(fileData);
      }
    }

    // ==========================================
    // 3. قراءة الملف الثاني (doctorNote.json)
    // ==========================================
    if (fs.existsSync(file1)) {
      const file1Data = fs.readFileSync(file1, 'utf-8');
      if (file1Data.trim() !== "") {
        doctorNotes = JSON.parse(file1Data);
      }
    }

    // 4. إنشاء ID جديد (نعتمد على الملف الرئيسي)
    const newId = diseases.length > 0 ? diseases[diseases.length - 1].id + 1 : 1;

    // 5. تجهيز كائن المرض
    const newDisease = {
      id: newId,
      name: newDiseaseData.name,
      common_name: newDiseaseData.common_name || newDiseaseData.name,
      symptoms: newDiseaseData.symptoms.split(',').map(s => s.trim()), 
      severity: newDiseaseData.severity || "Medium"
    };

    // 6. إضافة المرض إلى المصفوفتين
    diseases.push(newDisease);
    doctorNotes.push(newDisease);

    // ==========================================
    // 7. حفظ التعديلات في كلا الملفين
    // ==========================================
    fs.writeFileSync(filePath, JSON.stringify(diseases, null, 2));
    fs.writeFileSync(file1, JSON.stringify(doctorNotes, null, 2)); // أمر الحفظ للملف الجديد

    return NextResponse.json({ message: "تمت إضافة المرض بنجاح في كلا الملفين!", disease: newDisease });

  } catch (error) {
    console.error("❌ خطأ داخلي في السيرفر:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}