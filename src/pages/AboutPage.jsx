import { aboutStory } from "@/data/content";
import { Button, Card, ScrollReveal } from "@/components/ui/Primitives";
import { PageScaffold } from "@/pages/PageScaffold";
import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <PageScaffold
      eyebrow="About"
      title="Rooted in culture, growing through community."
      subtitle={aboutStory.intro}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <ScrollReveal>
          <Card className="h-full p-8">
            <h3 className="font-display text-2xl font-semibold">Mission & vision</h3>
            {aboutStory.paragraphs.map((p, idx) => (
              <p key={idx} className={`text-ink-muted ${idx === 0 ? "mt-4" : "mt-3"}`}>
                {p}
              </p>
            ))}
            <div className="mt-8">
              <Button to="/team" variant="secondary">
                Meet our team
              </Button>
            </div>
          </Card>
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {aboutStory.pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={0.06 * i}>
              <Card className="h-full p-6">
                <h4 className="font-display text-xl">{pillar.title}</h4>
                <p className="mt-2 text-sm text-ink-muted">{pillar.text}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal>
        <Card className="mt-10 p-8">
          <h3 className="font-display text-2xl font-semibold">Milestones</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutStory.milestones.map((m) => (
              <li key={m.year} className="rounded-2xl border border-border-subtle bg-surface-muted/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">{m.year}</p>
                <p className="mt-1 text-sm text-ink-muted">{m.label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink-muted">
            Ready to participate? Explore{" "}
            <Link to="/events" className="font-semibold text-accent hover:underline">
              upcoming events
            </Link>{" "}
            or{" "}
            <Link to="/membership" className="font-semibold text-accent hover:underline">
              membership
            </Link>
            .
          </p>
        </Card>
      </ScrollReveal>
    </PageScaffold>
  );
}
