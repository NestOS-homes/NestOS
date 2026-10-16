import { ComplaintDetailPage } from "@/features/complaints/ComplaintDetailPage";

export default async function ComplaintDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ComplaintDetailPage id={id} />;
}