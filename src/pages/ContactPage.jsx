import { siteContact } from "@/data/content";
import { Button, Card, ScrollReveal } from "@/components/ui/Primitives";
import { PageScaffold } from "@/pages/PageScaffold";
import { api } from "@/lib/api";
import { useState } from "react";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  return (
    <PageScaffold
      eyebrow="Contact"
      title="Connect with Brahmin Samaj of Ontario."
      subtitle="Reach out for memberships, partnerships, volunteering, and community program information."
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ScrollReveal>
          <Card>
            <h3 className="font-display text-2xl">Community inquiries</h3>
            <div className="mt-4 space-y-3 text-sm text-ink-muted">
              <p className="flex items-start gap-2">
                <span aria-hidden>📍</span>
                <span>{siteContact.addressLine}</span>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${siteContact.email}`} className="text-accent hover:underline">
                  {siteContact.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href={`tel:${siteContact.phoneTel}`} className="text-accent hover:underline">
                  {siteContact.phone}
                </a>
              </p>
              <p className="text-ink-muted/90">{siteContact.hours}</p>
            </div>
          </Card>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <Card>
            <h3 className="font-display text-2xl">Send a message</h3>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                await api.post("/api/public/inquiries", form);
                setForm({ name: "", email: "", subject: "", message: "" });
                setStatus("Inquiry submitted successfully.");
              }}
            >
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <textarea
                rows={4}
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                required
              />
              <Button type="submit">Submit inquiry</Button>
              {status && <p className="text-sm text-emerald-600">{status}</p>}
            </form>
          </Card>
        </ScrollReveal>
      </div>
    </PageScaffold>
  );
}
