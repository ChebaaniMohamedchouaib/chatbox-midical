import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'doctorNote.json'); 
    
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const diseases = JSON.parse(fileData);
      return NextResponse.json(diseases);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("❌ خطأ في قراءة البيانات:", error);
    return NextResponse.json({ error: "فشل في جلب البيانات" }, { status: 500 });
  }
}