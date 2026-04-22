import type { Cv } from '@/lib/schema';

interface Props {
  cv: Cv;
}

function DateRange({ start, end }: { start: string; end: string }) {
  if (!start && !end) return null;
  if (!start) return <span className="italic text-neutral-600">{end}</span>;
  return (
    <span className="italic text-neutral-600">
      {start} – {end}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-5 border-b border-neutral-800 pb-0.5 text-[11pt] font-bold uppercase tracking-[0.12em]">
      {children}
    </h2>
  );
}

export function CvPreview({ cv }: Props) {
  const { personal, summary, experience, projects, education, skills, languages, achievements, volunteer } =
    cv;

  const contactParts = [
    personal.location,
    personal.email,
    personal.phone,
    personal.links?.linkedin,
    personal.links?.github,
    personal.links?.portfolio,
  ].filter(Boolean);

  return (
    <div className="cv-page mx-auto w-full max-w-[210mm] font-serif text-[10.5pt] leading-snug text-neutral-900 shadow-lg print:shadow-none">
      <div className="px-[18mm] py-[16mm]">
        <header className="text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-wide">
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <p className="mt-4 text-[11pt] italic leading-tight text-neutral-700">
              {personal.title}
            </p>
          )}
          {contactParts.length > 0 && (
            <p className="mt-2 text-[9.5pt] leading-snug text-neutral-700">
              {contactParts.join('  ·  ')}
            </p>
          )}
        </header>

        {summary && (
          <>
            <SectionTitle>Summary</SectionTitle>
            <p className="mt-1.5 text-justify">{summary}</p>
          </>
        )}

        {education.length > 0 && (
          <>
            <SectionTitle>Education</SectionTitle>
            <ul className="mt-1.5 space-y-2">
              {education.map((e, i) => (
                <li key={i}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{e.school}</span>
                    <DateRange start={e.startDate} end={e.endDate} />
                  </div>
                  <div className="italic">{e.degree}</div>
                  {e.notes && <div className="text-neutral-700">{e.notes}</div>}
                </li>
              ))}
            </ul>
          </>
        )}

        {experience.length > 0 && (
          <>
            <SectionTitle>Experience</SectionTitle>
            <ul className="mt-1.5 space-y-3">
              {experience.map((e, i) => (
                <li key={i}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{e.company}</span>
                    <DateRange start={e.startDate} end={e.endDate} />
                  </div>
                  <div className="italic">
                    {e.role}
                    {e.location ? `, ${e.location}` : ''}
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}

        {projects.length > 0 && (
          <>
            <SectionTitle>Projects</SectionTitle>
            <ul className="mt-1.5 space-y-2">
              {projects.map((p, i) => (
                <li key={i}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{p.name}</span>
                    {p.url && <span className="italic text-neutral-600">{p.url}</span>}
                  </div>
                  <p>{p.description}</p>
                  {p.bullets && p.bullets.length > 0 && (
                    <ul className="mt-0.5 list-disc space-y-0.5 pl-5">
                      {p.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {skills.length > 0 && (
          <>
            <SectionTitle>Skills</SectionTitle>
            <ul className="mt-1.5 space-y-0.5">
              {skills.map((s, i) => (
                <li key={i}>
                  <span className="font-semibold">{s.category}:</span> {s.items.join(', ')}
                </li>
              ))}
            </ul>
          </>
        )}

        {achievements.length > 0 && (
          <>
            <SectionTitle>Achievements</SectionTitle>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
              {achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </>
        )}

        {languages.length > 0 && (
          <>
            <SectionTitle>Languages</SectionTitle>
            <p className="mt-1.5">
              {languages.map((l, i) => (
                <span key={i}>
                  <span className="font-semibold">{l.name}</span>
                  <span className="text-neutral-700"> - {l.level}</span>
                  {i < languages.length - 1 ? '  ·  ' : ''}
                </span>
              ))}
            </p>
          </>
        )}

        {volunteer && volunteer.length > 0 && (
          <>
            <SectionTitle>Volunteer Experience</SectionTitle>
            <ul className="mt-1.5 space-y-3">
              {volunteer.map((v, i) => (
                <li key={i}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{v.organization}</span>
                    <DateRange start={v.startDate} end={v.endDate} />
                  </div>
                  <div className="italic">{v.role}</div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {v.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
