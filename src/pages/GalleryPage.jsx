import { galleryImages } from "@/data/content";
import { Card, ScrollReveal } from "@/components/ui/Primitives";
import { PageScaffold } from "@/pages/PageScaffold";

export function GalleryPage() {
  return (
    <PageScaffold
      eyebrow="Gallery"
      title="Moments that reflect our shared story."
      subtitle="A living archive of celebrations, service, and connections across the Ontario community."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {galleryImages.map((img, i) => (
          <ScrollReveal key={img.id} delay={0.05 * i}>
            <Card className={`overflow-hidden p-0 ${img.tall ? "row-span-2" : ""}`}>
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full object-cover transition-transform duration-500 hover:scale-[1.03] ${img.tall ? "h-[26rem]" : "h-52"}`}
              />
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </PageScaffold>
  );
}
