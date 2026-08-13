import AdminMarathon from "@/components/admin/admin-marathon";
import { getMarathons } from "@/lib/marathons";

export default async function AdminMarathonsPage() {
  const { marathons, error } = await getMarathons();

  return <AdminMarathon marathons={marathons} hasError={error} />;
}
