import { z } from 'zod';

export const LinksSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
});

export const PersonalSchema = z.object({
  name: z.string().describe('Full name, exactly as written in the CV.'),
  title: z
    .string()
    .describe(
      'Professional title / headline, e.g. "Full-Stack Developer". If missing, infer from summary but keep concise.',
    ),
  email: z.string().describe('Email address.'),
  phone: z.string().optional().describe('Phone number, include country code if present.'),
  location: z.string().optional().describe('City, Country. Omit if not in the CV.'),
  links: LinksSchema.optional(),
});

export const ExperienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  startDate: z.string().describe('e.g. "July 2025" or "2024-07".'),
  endDate: z.string().describe('e.g. "September 2025", "Present", or "2024-09".'),
  bullets: z.array(z.string()).describe('Accomplishment-oriented bullet points.'),
});

export const ProjectItemSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  description: z.string().describe('One-to-three sentences describing the project.'),
  bullets: z.array(z.string()).optional(),
});

export const EducationItemSchema = z.object({
  school: z.string(),
  degree: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().optional(),
});

export const SkillGroupSchema = z.object({
  category: z.string().describe('e.g. "Front-End", "Backend & Databases", "Tools".'),
  items: z.array(z.string()),
});

export const LanguageSchema = z.object({
  name: z.string(),
  level: z.string().describe('e.g. "Native", "Professional Working Proficiency", "B2".'),
});

export const VolunteerItemSchema = z.object({
  organization: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  bullets: z.array(z.string()),
});

export const CvSchema = z.object({
  personal: PersonalSchema,
  summary: z.string().describe('2-4 sentence professional summary.'),
  experience: z.array(ExperienceItemSchema),
  projects: z.array(ProjectItemSchema),
  education: z.array(EducationItemSchema),
  skills: z.array(SkillGroupSchema),
  languages: z.array(LanguageSchema),
  achievements: z.array(z.string()),
  volunteer: z.array(VolunteerItemSchema).optional(),
});

export type Cv = z.infer<typeof CvSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type VolunteerItem = z.infer<typeof VolunteerItemSchema>;

export const emptyCv: Cv = {
  personal: { name: '', title: '', email: '' },
  summary: '',
  experience: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  achievements: [],
};
