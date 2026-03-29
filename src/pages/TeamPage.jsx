import { teamMembers } from "@/data/content";
import { Card, ScrollReveal } from "@/components/ui/Primitives";
import { PageScaffold } from "@/pages/PageScaffold";

export function TeamPage() {
  return (
    <PageScaffold
      eyebrow="Meet the Team"
      title="Volunteer leaders guiding BSO with care."
      subtitle="Our committee blends experience across culture, programs, finance, youth, seniors, and outreach—united by a shared commitment to community."
    >
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((person, i) => (
          <ScrollReveal key={person.id} delay={0.04 * i}>
            <Card className="flex h-full flex-col overflow-hidden p-0">
              <img src={person.image} alt={person.name} className="h-56 w-full object-cover" />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl">{person.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent">{person.role}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{person.bio}</p>
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline"
                  >
                    LinkedIn profile
                  </a>
                )}
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </PageScaffold>
  );
}
