import { ExperienceList } from "./experience-list";
import { SkillList } from "./skill-list";

export function SectionList({
  experiences,
  skills,
}: {
  experiences: { id: string; company: string; title: string; startDate: string }[];
  skills: { id: string; name: string }[];
}) {
  return (
    <div className="grid gap-8">
      <section>
        <h3 className="text-sm font-semibold tracking-tight">Experience</h3>
        <ExperienceList items={experiences} />
      </section>
      <section>
        <h3 className="text-sm font-semibold tracking-tight">Skills</h3>
        <SkillList items={skills} />
      </section>
    </div>
  );
}
