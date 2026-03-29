import { membershipContent } from "@/data/content";
import { Button, Card, ScrollReveal } from "@/components/ui/Primitives";
import { PageScaffold } from "@/pages/PageScaffold";

export function MembershipPage() {
  return (
    <PageScaffold
      eyebrow="Membership"
      title="Join a vibrant and values-driven network."
      subtitle={membershipContent.headline}
    >
      <Card className="bg-gradient-to-r from-accent/10 via-surface to-accent-gold/10 p-8 sm:p-10">
        <h3 className="font-display text-2xl font-semibold">Member benefits</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {membershipContent.benefits.map((benefit, i) => (
            <ScrollReveal key={benefit} delay={0.04 * i}>
              <div className="rounded-2xl border border-border-subtle bg-surface/85 px-4 py-3 text-sm font-medium text-ink-muted">
                {benefit}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Card>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {membershipContent.steps.map((step, i) => (
          <ScrollReveal key={step.title} delay={0.06 * i}>
            <Card className="h-full p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Step {i + 1}</p>
              <h3 className="mt-2 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{step.text}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <Card className="mt-10 p-8 text-center">
          <h3 className="font-display text-2xl font-semibold">Take the next step</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
            Use the contact form to express interest—we will follow up with membership details and upcoming welcome sessions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/contact">Request membership info</Button>
            <Button to="/events" variant="secondary">
              Browse events
            </Button>
          </div>
        </Card>
      </ScrollReveal>
    </PageScaffold>
  );
}
