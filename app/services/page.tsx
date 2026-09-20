import ServicesPageClient from './ServicesPageClient';

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  return <ServicesPageClient initialService={params?.service} />;
}
