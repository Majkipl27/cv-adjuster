import { createGateway } from '@ai-sdk/gateway';
import { generateObject } from 'ai';
import { CvSchema, type Cv } from './schema';
import { getAdjustModel, getParseModel } from './storage';

// The browser calls a same-origin proxy. The Vite dev/preview server
// injects the real Authorization header server-side (see vite.config.ts)
// so the Gateway key never reaches the client bundle. The apiKey value
// below is a placeholder; the proxy overrides it.
const gateway = createGateway({
  apiKey: 'proxied-by-vite',
  baseURL:
    typeof window !== 'undefined' ? `${window.location.origin}/api/ai` : '/api/ai',
});

const PARSE_SYSTEM = `You are a precise CV parser. Convert raw extracted PDF text into the provided JSON schema.

Rules:
- Preserve facts exactly as they appear. Do not paraphrase company names, schools, dates, or metrics.
- Do NOT invent experience, skills, dates, or achievements. If unsure, leave optional fields empty.
- Normalise date formats to "Month YYYY" (e.g. "July 2025"). Use "Present" for ongoing roles.
- Split bullet points at sentence boundaries if the extracted text merged them.
- Group skills into reasonable categories based on how they appear in the source (e.g. "Front-End", "Backend & Databases", "Tools").
- If the CV has testimonials/quotes about the candidate, drop them - we only want structured CV data.
- Identify achievements (hackathon wins, awards, recognitions) and place them in the achievements array.`;

const ADJUST_SYSTEM = `You rewrite a CV to maximise fit for a specific job offer while remaining strictly truthful.

Rules:
1. NEVER invent experience, skills, dates, companies, metrics, schools, or projects. You may only rephrase existing content.
2. Rephrase bullets to surface keywords, responsibilities, and values from the job offer - but only when the candidate genuinely has relevant experience.
3. Reorder entries within skills, experience bullets, and projects so the most relevant to the offer appear first. Keep the overall structure (sections, array lengths) similar to the original.
4. Tighten the summary toward the role. Keep it 2-4 sentences.
5. Keep bullet lengths similar to the originals. Do not pad.
6. Preserve all dates, company names, project names, school names, and URLs exactly as they are.
7. Return the same schema shape with the same items - you are rewriting text, not adding or removing items.
8. Write in confident, active voice with strong verbs. Avoid fluff like "passionate" or "hard-working".`;

export async function parseCv(rawText: string): Promise<Cv> {
  const { object } = await generateObject({
    model: gateway(getParseModel()),
    schema: CvSchema,
    system: PARSE_SYSTEM,
    prompt: `Parse the following CV text into the schema. Raw text:\n\n---\n${rawText}\n---`,
  });
  return object;
}

export async function adjustCv(cv: Cv, jobOffer: string): Promise<Cv> {
  const { object } = await generateObject({
    model: gateway(getAdjustModel()),
    schema: CvSchema,
    system: ADJUST_SYSTEM,
    prompt: `Rewrite this CV to fit the following job offer. Return the full CV JSON.

=== JOB OFFER ===
${jobOffer}

=== CURRENT CV (JSON) ===
${JSON.stringify(cv, null, 2)}`,
  });
  return object;
}
