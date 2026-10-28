import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/commerce/ProductPage";
import { allActiveProducts, getProductBySlug } from "@/content/coffees";

export function generateStaticParams() {
  return allActiveProducts.map((product) => ({ "coffee-slug": product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ "coffee-slug": string }> }): Promise<Metadata> {
  const { "coffee-slug": slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductRoute({ params }: { params: Promise<{ "coffee-slug": string }> }) {
  const { "coffee-slug": slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
