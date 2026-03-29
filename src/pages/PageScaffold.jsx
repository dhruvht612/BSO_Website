import { Container, ScrollReveal, SectionHeader } from "@/components/ui/Primitives";

export function PageScaffold({ eyebrow, title, subtitle, children }) {
  return (
    <main className="relative pt-28 pb-16 sm:pt-32 sm:pb-24">
      <section className="relative py-10 sm:py-14">
        <div className="absolute inset-0 bg-hero-mesh opacity-80" aria-hidden />
        <Container className="relative">
          <ScrollReveal>
            <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          </ScrollReveal>
          {children}
        </Container>
      </section>
    </main>
  );
}
