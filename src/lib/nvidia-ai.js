/**
 * NVIDIA NIM AI Parser
 * Raw text/HTML ko clean structured sarkari job JSON mein convert karta hai
 */

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are a Sarkari Job Data Extraction AI. You extract structured government job information from raw text/HTML content from Indian government websites.

You MUST return a valid JSON array. Each object in the array should have these fields:
- "id": A URL-friendly slug (lowercase, hyphens, e.g., "ssc-cgl-2026")
- "type": One of "job", "admit", "result", "answer", "syllabus"
- "title": Full title with year (e.g., "SSC CGL 2026 — Combined Graduate Level Examination")
- "org": Full organization name (e.g., "Staff Selection Commission")
- "dept": Short department code (e.g., "SSC", "UPSC", "Railway", "Banking", "State Police", "Teaching", "Defence", "Health")
- "vacancies": Number of vacancies (integer, 0 if not applicable)
- "salary": Salary range as string (e.g., "₹25,500 – ₹1,51,100") or null
- "date": Notification date (YYYY-MM-DD format)
- "lastDate": Last date to apply (YYYY-MM-DD format)
- "applyUrl": Direct apply/download URL
- "officialUrl": Official website URL
- "description": 2-3 line summary in English
- "tags": Array of relevant tags (e.g., ["Online Form", "Graduation", "All India"])
- "category": Array of category tags (e.g., ["SSC", "Graduate"])

Rules:
1. Only extract REAL government job related data. Ignore ads, navigation, footers.
2. If a field is not available, use sensible defaults (0 for vacancies, null for salary, today's date if no date found).
3. Return ONLY valid JSON array. No markdown, no explanation, no code blocks.
4. Make sure IDs are unique and URL-friendly.`;

export async function parseWithAI(rawText, apiKey) {
  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Extract all sarkari job/admit card/result/answer key/syllabus updates from this content. Return ONLY a JSON array:\n\n${rawText.substring(0, 12000)}` }
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('NVIDIA API error:', response.status, err);
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    
    // Clean response — kabhi kabhi AI markdown wrapper daal deta hai
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('AI parsing failed:', error.message);
    return [];
  }
}
