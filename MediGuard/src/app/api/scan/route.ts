import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { imageBase64, medications } = await req.json();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const medsContext = medications?.length > 0
            ? `The user is currently taking: ${medications.join(', ')}.`
            : 'The user has no other medications on file.';

        const prompt = `You are MediGuard, a medication safety assistant.
Analyze this medication image and respond ONLY with valid JSON, no markdown.
${medsContext}
Return exactly this structure:
{
  "name": "full medication name",
  "activeIngredient": "generic name",
  "dosage": "dosage and administration",
  "sideEffects": ["effect1", "effect2", "effect3"],
  "interactions": [
    {
      "drug": "interacting drug name",
      "severity": "mild|moderate|severe",
      "description": "what the interaction causes"
    }
  ],
  "safeToTake": true or false,
  "warning": "critical warning or null"
}
If not a medication: { "error": "Not a medication image" }`;

        const result = await model.generateContent([
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
        ]);

        const text = result.response.text();
        const clean = text.replace(/```json|```/g, '').trim();
        return NextResponse.json(JSON.parse(clean));

    } catch (error: any) {
        console.error('Gemini error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}