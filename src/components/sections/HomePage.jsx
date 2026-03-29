import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  eventCategories,
  events,
  galleryImages,
  membershipContent,
  siteContact,
} from "@/data/content";
import {
  AnimatedNumber,
  Button,
  Card,
  Container,
  ScrollReveal,
  SectionHeader,
} from "@/components/ui/Primitives";

export function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <Events />
      <Impact />
      <Gallery />
      <Membership />
    </main>
  );
}

function Hero() {
  const nextEvent = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date))[0],
    []
  );
  const heroStats = [
    { label: "Members", value: "500+" },
    { label: "Events", value: "50+" },
    { label: "Years", value: "10+" },
    { label: "Families", value: "1000+" },
  ];

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-14">
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(217,119,87,0.16),transparent_38%),radial-gradient(circle_at_76%_14%,rgba(212,175,122,0.15),transparent_36%),linear-gradient(160deg,rgba(14,23,42,0.07),transparent_34%,rgba(217,119,87,0.06))] dark:bg-[radial-gradient(circle_at_26%_30%,rgba(232,150,116,0.18),transparent_38%),radial-gradient(circle_at_74%_18%,rgba(180,155,110,0.14),transparent_34%),linear-gradient(160deg,rgba(15,23,42,0.78),rgba(15,23,42,0.3)_40%,rgba(232,150,116,0.08))]" />
      <div className="hero-grain absolute inset-0 opacity-[0.12] dark:opacity-[0.1]" />
      <Container className="relative">
        <div className="grid min-h-[calc(100svh-9rem)] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted shadow-sm backdrop-blur-sm">
                Ontario, Canada
              </p>
              <div className="absolute -left-6 -top-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl sm:h-48 sm:w-48" />
              <h1 className="relative font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.55rem] lg:leading-[1.08]">
                Preserving Culture.
                <br />
                <span className="bg-gradient-to-r from-accent via-accent to-accent-gold bg-clip-text text-transparent">
                  Building Community.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl"
            >
              A premium, welcoming digital hub for families across Ontario to connect through
              culture, service, and shared purpose.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            >
              <Button to="/membership" className="hover:-translate-y-0.5">Join Now</Button>
              <Button to="/events" variant="secondary" className="hover:-translate-y-0.5">
                View Events
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 + i * 0.06, duration: 0.35 }}
                  className="rounded-2xl border border-border-subtle/80 bg-surface/80 px-3 py-3 text-center shadow-sm backdrop-blur-sm"
                >
                  <p className="font-display text-xl font-semibold text-ink">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-ink-muted">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-3xl border border-border-subtle bg-surface/90 p-3 shadow-float backdrop-blur-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b055db1?w=1200&q=80"
                alt="Community gathering and youth activity"
                className="h-[21rem] w-full rounded-2xl object-cover sm:h-[24rem]"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute -bottom-6 -left-4 w-48 rounded-2xl border border-border-subtle bg-surface/95 p-4 shadow-card backdrop-blur-sm sm:-left-6"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">Next Event</p>
              <p className="mt-1 font-display text-lg">{nextEvent?.title ?? "Upcoming"}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {nextEvent
                  ? `${new Date(nextEvent.date).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })} • Ontario`
                  : "—"}
              </p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
              className="absolute -right-3 top-5 w-36 rounded-2xl border border-border-subtle bg-surface/95 p-3 text-center shadow-card backdrop-blur-sm"
            >
              <p className="font-display text-2xl text-accent">98%</p>
              <p className="text-xs text-ink-muted">Member satisfaction</p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="mx-auto mt-6 flex justify-center"
        >
          <Link
            to="/about"
            className="flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted hover:text-ink"
          >
            Explore Community
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              ↓
            </motion.span>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

function Events() {
  const [active, setActive] = useState("All");
  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    []
  );
  const filtered = useMemo(
    () => (active === "All" ? sorted : sorted.filter((e) => e.category === active)),
    [active, sorted]
  );
  const preview = useMemo(() => filtered.slice(0, 3), [filtered]);
  return (
    <section id="events" className="bg-surface-muted/45 py-20 sm:py-24">
      <Container>
        <ScrollReveal>
          <SectionHeader
            eyebrow="Upcoming Events"
            title="Experiences that bring generations together."
            subtitle="Curated gatherings for cultural celebration, learning, and meaningful service."
            action={
              <Button to="/events" variant="secondary">
                View all events
              </Button>
            }
          />
        </ScrollReveal>
        <div className="mb-8 flex flex-wrap gap-2">
          {eventCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium ${active === cat ? "bg-accent text-white" : "bg-surface-muted text-ink-muted"}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {preview.map((event, i) => (
            <ScrollReveal key={event.id} delay={0.05 * i}>
              <Card className="overflow-hidden p-0">
                <img src={event.image} alt={event.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">{new Date(event.date).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}</p>
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
      </Container>
    </section>
  );
}

function Impact() {
  const metrics = [
    { label: "Members Served", value: 1200, suffix: "+" },
    { label: "Annual Events", value: 24, suffix: "+" },
    { label: "Youth Engagement", value: 380, suffix: "+" },
    { label: "Volunteers", value: 160, suffix: "+" },
  ];
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <ScrollReveal>
          <SectionHeader eyebrow="Community Impact" title="Measured impact. Lasting relationships." />
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <ScrollReveal key={m.label} delay={0.06 * i}>
              <Card className="text-center">
                <p className="font-display text-4xl font-semibold text-accent">
                  <AnimatedNumber value={m.value} suffix={m.suffix} />
                </p>
                <p className="mt-2 text-sm text-ink-muted">{m.label}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Gallery() {
  const preview = galleryImages.slice(0, 4);
  return (
    <section id="gallery" className="bg-surface-muted/45 py-20 sm:py-24">
      <Container>
        <ScrollReveal>
          <SectionHeader
            eyebrow="Community Moments"
            title="Celebrations, service, and memories in motion."
            action={
              <Button to="/gallery" variant="secondary">
                View full gallery
              </Button>
            }
          />
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {preview.map((img, i) => (
            <ScrollReveal key={img.id} delay={0.04 * i}>
              <Card className={`overflow-hidden p-0 ${img.tall ? "row-span-2" : ""}`}>
                <img src={img.src} alt={img.alt} className={`w-full object-cover transition-transform duration-500 hover:scale-[1.03] ${img.tall ? "h-[26rem]" : "h-52"}`} />
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Membership() {
  const benefits = membershipContent.benefits.slice(0, 4);
  return (
    <section id="membership" className="py-20 sm:py-24">
      <Container>
        <Card className="bg-gradient-to-r from-accent/10 via-surface to-accent-gold/10 p-8 sm:p-12">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Membership"
              title="Become a member of a future-ready community."
              subtitle={membershipContent.headline}
            />
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-2xl border border-border-subtle bg-surface/80 px-4 py-3 text-sm font-medium shadow-sm">
                {benefit}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button to="/membership">Become a member</Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#0b1220] pt-20 text-slate-100 sm:pt-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/55 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-accent/20 blur-[120px]" />
      <Container className="relative">
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:gap-10 sm:pb-16 lg:grid-cols-[1.25fr_1fr_1fr_1.25fr]">
          <FooterBrand />
          <FooterLinks />
          <FooterContact />
          <FooterNewsletter />
        </div>
        <FooterBottom />
      </Container>
    </footer>
  );
}

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Events", href: "/events" },
  { label: "Membership", href: "/membership" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];

function FooterBrand() {
  return (
    <div className="max-w-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-gold/90">
        Brahmin Samaj of Ontario
      </p>
      <h3 className="mt-3 font-display text-3xl leading-tight text-white">
        Community, Culture,
        <br />
        Connection.
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        Building a warm, future-ready home for families across Ontario through shared values,
        traditions, and meaningful service.
      </p>
      <p className="mt-5 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300">
        Serving families across Ontario
      </p>
      <div className="mt-6 flex items-center gap-2.5">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:bg-accent/20 hover:text-white"
          >
            <SocialIcon type={social.icon} />
          </a>
        ))}
      </div>
    </div>
  );
}

function FooterLinks() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Quick Links</p>
      <ul className="mt-4 space-y-2.5">
        {footerLinks.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className="inline-flex items-center text-sm text-slate-200 transition-all duration-300 hover:translate-x-1 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Community Inquiries</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-200">
        <li className="flex items-start gap-2.5">
          <span className="mt-0.5 text-accent-gold">📍</span>
          <span>{siteContact.addressLine}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-0.5 text-accent-gold">✉</span>
          <a href={`mailto:${siteContact.email}`} className="transition-colors hover:text-accent">
            {siteContact.email}
          </a>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-0.5 text-accent-gold">☎</span>
          <a href={`tel:${siteContact.phoneTel}`} className="transition-colors hover:text-accent">
            {siteContact.phone}
          </a>
        </li>
        <li className="pl-7 text-slate-400">{siteContact.hours}</li>
      </ul>
    </div>
  );
}

function FooterNewsletter() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Newsletter</p>
      <h4 className="mt-3 font-display text-2xl text-white">Stay Connected</h4>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        Get updates on events, programs, and community news.
      </p>
      <form className="mt-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
        <input
          type="email"
          placeholder="Enter your email"
          className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-gradient-to-r from-accent to-accent-gold px-5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:brightness-105"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="flex flex-col gap-3 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} Brahmin Samaj of Ontario. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <a href="#" className="transition-colors hover:text-slate-200">
          Privacy Policy
        </a>
        <a href="#" className="transition-colors hover:text-slate-200">
          Terms
        </a>
        <span className="hidden sm:inline">•</span>
        <span className="text-slate-500">Designed with care for community.</span>
      </div>
    </div>
  );
}

function SocialIcon({ type }) {
  const common = "h-4 w-4";
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor">
        <path d="M13.5 9H16V6h-2.5C10.9 6 9 7.9 9 10.5V13H7v3h2v5h3v-5h2.5l.5-3H12v-2.5c0-.8.7-1.5 1.5-1.5Z" />
      </svg>
    );
  }
  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor">
        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="currentColor">
      <path d="M6.5 4A2.5 2.5 0 0 1 9 6.5 2.5 2.5 0 0 1 6.5 9 2.5 2.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4ZM4.5 10.5h4V20h-4v-9.5Zm6.5 0h3.8v1.3h.1c.5-.9 1.8-1.8 3.6-1.8 3.9 0 4.6 2.6 4.6 6V20h-4v-3.6c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V20h-4v-9.5Z" />
    </svg>
  );
}
