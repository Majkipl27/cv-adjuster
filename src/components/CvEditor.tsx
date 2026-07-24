import { useCvStore } from '@/store/cvStore';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import type { Cv, ExperienceItem, ProjectItem, VolunteerItem } from '@/lib/schema';
import { Plus, Trash2 } from 'lucide-react';
import { SortableList } from './SortableList';
import type { ReactNode } from 'react';

function SectionHeader({
  title,
  onAdd,
}: {
  title: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {onAdd && (
        <Button size="sm" variant="ghost" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      )}
    </div>
  );
}

export function CvEditor() {
  const cv = useCvStore((s) => s.cv);
  const updateCv = useCvStore((s) => s.updateCv);

  if (!cv) return null;

  const patch = (partial: Partial<Cv>) => updateCv((c) => ({ ...c, ...partial }));

  return (
    <div className="space-y-2 p-4">
      <SectionHeader title="Personal" />
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Label className="text-xs">Name</Label>
          <Input
            value={cv.personal.name}
            onChange={(e) => patch({ personal: { ...cv.personal, name: e.target.value } })}
          />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Title</Label>
          <Input
            value={cv.personal.title}
            onChange={(e) => patch({ personal: { ...cv.personal, title: e.target.value } })}
          />
        </div>
        <div>
          <Label className="text-xs">Email</Label>
          <Input
            value={cv.personal.email}
            onChange={(e) => patch({ personal: { ...cv.personal, email: e.target.value } })}
          />
        </div>
        <div>
          <Label className="text-xs">Phone</Label>
          <Input
            value={cv.personal.phone ?? ''}
            onChange={(e) => patch({ personal: { ...cv.personal, phone: e.target.value } })}
          />
        </div>
        <div>
          <Label className="text-xs">Location</Label>
          <Input
            value={cv.personal.location ?? ''}
            onChange={(e) => patch({ personal: { ...cv.personal, location: e.target.value } })}
          />
        </div>
        <div>
          <Label className="text-xs">GitHub</Label>
          <Input
            value={cv.personal.links?.github ?? ''}
            onChange={(e) =>
              patch({
                personal: {
                  ...cv.personal,
                  links: { ...cv.personal.links, github: e.target.value },
                },
              })
            }
          />
        </div>
        <div>
          <Label className="text-xs">LinkedIn</Label>
          <Input
            value={cv.personal.links?.linkedin ?? ''}
            onChange={(e) =>
              patch({
                personal: {
                  ...cv.personal,
                  links: { ...cv.personal.links, linkedin: e.target.value },
                },
              })
            }
          />
        </div>
        <div>
          <Label className="text-xs">Portfolio</Label>
          <Input
            value={cv.personal.links?.portfolio ?? ''}
            onChange={(e) =>
              patch({
                personal: {
                  ...cv.personal,
                  links: { ...cv.personal.links, portfolio: e.target.value },
                },
              })
            }
          />
        </div>
      </div>

      <SectionHeader title="Summary" />
      <Textarea
        rows={4}
        value={cv.summary}
        onChange={(e) => patch({ summary: e.target.value })}
      />

      <SectionHeader
        title="Experience"
        onAdd={() =>
          updateCv((c) => ({
            ...c,
            experience: [
              ...c.experience,
              { company: '', role: '', startDate: '', endDate: '', bullets: [''] },
            ],
          }))
        }
      />
      <SortableList
        items={cv.experience}
        getId={(_, i) => `exp-${i}`}
        onReorder={(next) => updateCv((c) => ({ ...c, experience: next }))}
        renderItem={(exp, i, handle) => (
          <div className="flex items-start gap-2">
            {handle}
            <div className="flex-1 space-y-2 rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(updateCv, i, { company: e.target.value })}
                  />
                  <Input
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => updateExperience(updateCv, i, { role: e.target.value })}
                  />
                  <Input
                    placeholder="Start"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(updateCv, i, { startDate: e.target.value })}
                  />
                  <Input
                    placeholder="End"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(updateCv, i, { endDate: e.target.value })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateCv((c) => ({
                      ...c,
                      experience: c.experience.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <SortableList
                items={exp.bullets}
                getId={(_, j) => `exp-${i}-b-${j}`}
                onReorder={(next) => updateExperience(updateCv, i, { bullets: next })}
                renderItem={(b, j, bulletHandle) => (
                  <div className="flex items-start gap-2">
                    {bulletHandle}
                    <Textarea
                      rows={2}
                      value={b}
                      onChange={(e) => {
                        const next = [...exp.bullets];
                        next[j] = e.target.value;
                        updateExperience(updateCv, i, { bullets: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateExperience(updateCv, i, {
                          bullets: exp.bullets.filter((_, idx) => idx !== j),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateExperience(updateCv, i, { bullets: [...exp.bullets, ''] })
                }
              >
                <Plus className="mr-1 h-4 w-4" /> Bullet
              </Button>
            </div>
          </div>
        )}
      />

      <SectionHeader
        title="Projects"
        onAdd={() =>
          updateCv((c) => ({
            ...c,
            projects: [...c.projects, { name: '', description: '' }],
          }))
        }
      />
      <SortableList
        items={cv.projects}
        getId={(_, i) => `proj-${i}`}
        onReorder={(next) => updateCv((c) => ({ ...c, projects: next }))}
        renderItem={(p, i, handle) => (
          <div className="flex items-start gap-2">
            {handle}
            <div className="flex-1 space-y-2 rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => updateProject(updateCv, i, { name: e.target.value })}
                  />
                  <Input
                    placeholder="URL"
                    value={p.url ?? ''}
                    onChange={(e) => updateProject(updateCv, i, { url: e.target.value })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateCv((c) => ({ ...c, projects: c.projects.filter((_, idx) => idx !== i) }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                rows={2}
                placeholder="Description"
                value={p.description}
                onChange={(e) => updateProject(updateCv, i, { description: e.target.value })}
              />
              <SortableList
                items={p.bullets ?? []}
                getId={(_, j) => `proj-${i}-b-${j}`}
                onReorder={(next) => updateProject(updateCv, i, { bullets: next })}
                renderItem={(b, j, bulletHandle) => (
                  <div className="flex items-start gap-2">
                    {bulletHandle}
                    <Textarea
                      rows={2}
                      value={b}
                      onChange={(e) => {
                        const next = [...(p.bullets ?? [])];
                        next[j] = e.target.value;
                        updateProject(updateCv, i, { bullets: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateProject(updateCv, i, {
                          bullets: (p.bullets ?? []).filter((_, idx) => idx !== j),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateProject(updateCv, i, { bullets: [...(p.bullets ?? []), ''] })
                }
              >
                <Plus className="mr-1 h-4 w-4" /> Bullet
              </Button>
            </div>
          </div>
        )}
      />

      <SectionHeader
        title="Education"
        onAdd={() =>
          updateCv((c) => ({
            ...c,
            education: [
              ...c.education,
              { school: '', degree: '', startDate: '', endDate: '' },
            ],
          }))
        }
      />
      <SortableList
        items={cv.education}
        getId={(_, i) => `edu-${i}`}
        onReorder={(next) => updateCv((c) => ({ ...c, education: next }))}
        renderItem={(ed, i, handle) => (
          <div className="flex items-start gap-2">
            {handle}
            <div className="flex-1 space-y-2 rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="School"
                    value={ed.school}
                    onChange={(e) =>
                      updateCv((c) => ({
                        ...c,
                        education: c.education.map((row, idx) =>
                          idx === i ? { ...row, school: e.target.value } : row,
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Degree"
                    value={ed.degree}
                    onChange={(e) =>
                      updateCv((c) => ({
                        ...c,
                        education: c.education.map((row, idx) =>
                          idx === i ? { ...row, degree: e.target.value } : row,
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Start"
                    value={ed.startDate}
                    onChange={(e) =>
                      updateCv((c) => ({
                        ...c,
                        education: c.education.map((row, idx) =>
                          idx === i ? { ...row, startDate: e.target.value } : row,
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="End"
                    value={ed.endDate}
                    onChange={(e) =>
                      updateCv((c) => ({
                        ...c,
                        education: c.education.map((row, idx) =>
                          idx === i ? { ...row, endDate: e.target.value } : row,
                        ),
                      }))
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateCv((c) => ({
                      ...c,
                      education: c.education.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                rows={2}
                placeholder="Notes"
                value={ed.notes ?? ''}
                onChange={(e) =>
                  updateCv((c) => ({
                    ...c,
                    education: c.education.map((row, idx) =>
                      idx === i ? { ...row, notes: e.target.value } : row,
                    ),
                  }))
                }
              />
            </div>
          </div>
        )}
      />

      <SectionHeader
        title="Skills"
        onAdd={() =>
          updateCv((c) => ({
            ...c,
            skills: [...c.skills, { category: '', items: [] }],
          }))
        }
      />
      <SortableList
        items={cv.skills}
        getId={(_, i) => `skill-${i}`}
        onReorder={(next) => updateCv((c) => ({ ...c, skills: next }))}
        renderItem={(g, i, handle) => (
          <div className="flex items-start gap-2">
            {handle}
            <div className="flex flex-1 items-start gap-2 rounded-md border p-3">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Category"
                  value={g.category}
                  onChange={(e) =>
                    updateCv((c) => ({
                      ...c,
                      skills: c.skills.map((row, idx) =>
                        idx === i ? { ...row, category: e.target.value } : row,
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Items, comma separated"
                  value={g.items.join(', ')}
                  onChange={(e) =>
                    updateCv((c) => ({
                      ...c,
                      skills: c.skills.map((row, idx) =>
                        idx === i
                          ? {
                              ...row,
                              items: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }
                          : row,
                      ),
                    }))
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  updateCv((c) => ({ ...c, skills: c.skills.filter((_, idx) => idx !== i) }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      />

      <SectionHeader
        title="Languages"
        onAdd={() =>
          updateCv((c) => ({ ...c, languages: [...c.languages, { name: '', level: '' }] }))
        }
      />
      <SortableList
        items={cv.languages}
        getId={(_, i) => `lang-${i}`}
        onReorder={(next) => updateCv((c) => ({ ...c, languages: next }))}
        renderItem={(l, i, handle) => (
          <div className="flex items-start gap-2">
            {handle}
            <Input
              placeholder="Language"
              value={l.name}
              onChange={(e) =>
                updateCv((c) => ({
                  ...c,
                  languages: c.languages.map((row, idx) =>
                    idx === i ? { ...row, name: e.target.value } : row,
                  ),
                }))
              }
            />
            <Input
              placeholder="Level"
              value={l.level}
              onChange={(e) =>
                updateCv((c) => ({
                  ...c,
                  languages: c.languages.map((row, idx) =>
                    idx === i ? { ...row, level: e.target.value } : row,
                  ),
                }))
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                updateCv((c) => ({ ...c, languages: c.languages.filter((_, idx) => idx !== i) }))
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <SectionHeader
        title="Achievements"
        onAdd={() => updateCv((c) => ({ ...c, achievements: [...c.achievements, ''] }))}
      />
      <SortableList
        items={cv.achievements}
        getId={(_, i) => `ach-${i}`}
        onReorder={(next) => updateCv((c) => ({ ...c, achievements: next }))}
        renderItem={(a, i, handle): ReactNode => (
          <div className="flex items-start gap-2">
            {handle}
            <Textarea
              rows={2}
              value={a}
              onChange={(e) =>
                updateCv((c) => ({
                  ...c,
                  achievements: c.achievements.map((row, idx) =>
                    idx === i ? e.target.value : row,
                  ),
                }))
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                updateCv((c) => ({
                  ...c,
                  achievements: c.achievements.filter((_, idx) => idx !== i),
                }))
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <SectionHeader
        title="Volunteer Experience"
        onAdd={() =>
          updateCv((c) => ({
            ...c,
            volunteer: [
              ...(c.volunteer ?? []),
              { organization: '', role: '', startDate: '', endDate: '', bullets: [''] },
            ],
          }))
        }
      />
      <SortableList
        items={cv.volunteer ?? []}
        getId={(_, i) => `vol-${i}`}
        onReorder={(next) => updateCv((c) => ({ ...c, volunteer: next }))}
        renderItem={(v, i, handle) => (
          <div className="flex items-start gap-2">
            {handle}
            <div className="flex-1 space-y-2 rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Organization"
                    value={v.organization}
                    onChange={(e) => updateVolunteer(updateCv, i, { organization: e.target.value })}
                  />
                  <Input
                    placeholder="Role"
                    value={v.role}
                    onChange={(e) => updateVolunteer(updateCv, i, { role: e.target.value })}
                  />
                  <Input
                    placeholder="Start"
                    value={v.startDate}
                    onChange={(e) => updateVolunteer(updateCv, i, { startDate: e.target.value })}
                  />
                  <Input
                    placeholder="End"
                    value={v.endDate}
                    onChange={(e) => updateVolunteer(updateCv, i, { endDate: e.target.value })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateCv((c) => ({
                      ...c,
                      volunteer: (c.volunteer ?? []).filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <SortableList
                items={v.bullets}
                getId={(_, j) => `vol-${i}-b-${j}`}
                onReorder={(next) => updateVolunteer(updateCv, i, { bullets: next })}
                renderItem={(b, j, bulletHandle) => (
                  <div className="flex items-start gap-2">
                    {bulletHandle}
                    <Textarea
                      rows={2}
                      value={b}
                      onChange={(e) => {
                        const next = [...v.bullets];
                        next[j] = e.target.value;
                        updateVolunteer(updateCv, i, { bullets: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateVolunteer(updateCv, i, {
                          bullets: v.bullets.filter((_, idx) => idx !== j),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateVolunteer(updateCv, i, { bullets: [...v.bullets, ''] })}
              >
                <Plus className="mr-1 h-4 w-4" /> Bullet
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

function updateExperience(
  updateCv: (updater: (c: Cv) => Cv) => void,
  index: number,
  patch: Partial<ExperienceItem>,
) {
  updateCv((c) => ({
    ...c,
    experience: c.experience.map((row, idx) => (idx === index ? { ...row, ...patch } : row)),
  }));
}

function updateProject(
  updateCv: (updater: (c: Cv) => Cv) => void,
  index: number,
  patch: Partial<ProjectItem>,
) {
  updateCv((c) => ({
    ...c,
    projects: c.projects.map((row, idx) => (idx === index ? { ...row, ...patch } : row)),
  }));
}

function updateVolunteer(
  updateCv: (updater: (c: Cv) => Cv) => void,
  index: number,
  patch: Partial<VolunteerItem>,
) {
  updateCv((c) => ({
    ...c,
    volunteer: (c.volunteer ?? []).map((row, idx) => (idx === index ? { ...row, ...patch } : row)),
  }));
}
