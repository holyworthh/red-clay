import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OriginDossier } from "@/components/origins/OriginDossier";
import { getOriginBySlug, origins } from "@/content/origins";

export function generateStaticParams() {
  return origins.map((origin) => ({ "region-slug": origin.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ "region-slug": string }> }): Promise<Metadata> {
  const { "region-slug": slug } = await params;
  const origin = getOriginBySlug(slug);
  return origin ? { title: `${origin.name} — Origins`, description: origin.summary } : {};
}

export default async function OriginPage({ params }: { params: Promise<{ "region-slug": string }> }) {
  const { "region-slug": slug } = await params;
  const origin = getOriginBySlug(slug);
  if (!origin) notFound();
  const index = origins.findIndex((item) => item.slug === origin.slug);
  const nextOrigin = origins[(index + 1) % origins.length];
  const previousOrigin = origins[(index + origins.length - 1) % origins.length];
  return <OriginDossier origin={origin} nextOrigin={nextOrigin} previousOrigin={previousOrigin} />;
}
