// app/api/consult/route.js
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// قم باستيراد قاعدة البيانات الخاصة بك
// (تأكد من تعديل مسار الاستيراد حسب مكان وجود ملف heart_diseases.json في مشروعك)
import diseasesData from "../../../heart_diseases.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    // نستقبل المحادثة بأكملها لفهم السياق
    const { messages } = await req.json();

    // تحويل المحادثة لتنسيق يسهل على الذكاء الاصطناعي قراءته
    const conversationHistory = messages.map(msg =>
      `${msg.sender === "me" ? "Patient" : "Doctor"}: ${msg.text}`
    ).join("\n");

    const prompt = `
      You are an expert cardiologist diagnostic AI.
      Here is your strict database of diseases:
      ${JSON.stringify(diseasesData)}

      Here is the conversation history with the patient:
      ${conversationHistory}

      Task:
      Analyze the patient's symptoms based on the conversation.
      1. If the symptoms strongly match a disease in the database, return this JSON: 
         {"type": "diagnosis", "disease": <the exact matched object from the database>}
      2. If you don't have enough information to make a diagnosis from the database, ask a short, relevant follow-up question to find out if they have other symptoms from your database. Return this JSON:
         {"type": "question", "text": "Your follow-up question here"}

      Return ONLY a valid JSON object. Do not add any extra text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // استخدم هذا الإصدار لتجنب التوقف
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Gemini Error:", error);
    
    // إذا كان الخطأ بسبب الضغط المتكرر
    if (error.status === 429 || error.status === 503 || (error.message && error.message.includes("quota"))) {
      return NextResponse.json(
        { reply: "عذراً، المستشار الطبي يعالج حالة أخرى الآن. يرجى الانتظار بضع ثوانٍ ثم المحاولة مجدداً. ⏳" },
        { status: 200 } 
      );
    }

    return NextResponse.json(
      { error: "حدث خطأ في الاتصال بالمستشار الطبي." }, 
      { status: 500 }
    );
  }
}