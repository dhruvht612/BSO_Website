import { useMemo, useState } from "react";
import { eventCategories, events } from "@/data/content";
import { Button, Card, ScrollReveal } from "@/components/ui/Primitives";
import { PageScaffold } from "@/pages/PageScaffold";

export function EventsPage() {
  const [active, setActive] = useState("All");
  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    []
  );
  const filtered = useMemo(
    () => (active === "All" ? sorted : sorted.filter((e) => e.category === active)),
    [active, sorted]
  );

  return (
    <PageScaffold
      eyebrow="Events"
      title="Programs and gatherings for every generation."
      subtitle="Discover cultural evenings, youth sessions, seniors' events, and community service opportunities across Ontario. Filter by focus area below."
    >
      <div className="mb-10 flex flex-wrap gap-2">
        {eventCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === cat ? "bg-accent text-white" : "bg-surface-muted text-ink-muted hover:bg-surface-muted/80"
            }`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((event, i) => (
          <ScrollReveal key={event.id} delay={0.05 * i}>
            <Card className="overflow-hidden p-0">
              <img src={event.image} alt={event.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {new Date(event.date).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="mt-1 text-xs font-medium text-ink-muted">{event.category}</p>
                <h3 className="mt-2 font-display text-xl">{event.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{event.description}</p>
                <div className="mt-4">
                  <Button to="/contact" variant="secondary">
                    RSVP / inquire
                  </Button>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </PageScaffold>
  );
}
