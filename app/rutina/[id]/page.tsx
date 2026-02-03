import { getRoutineById } from "@/data";
import RoutinePage from "@/components/RoutinePage";
import BottomNav from "@/components/BottomNav";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const routine = getRoutineById(id);

  if (!routine) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center" }}>
        <p style={{ color: "var(--text-dim)", fontSize: "16px" }}>Rutina no encontrada</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "100px" }}>
      <RoutinePage routine={routine} />
      <BottomNav />
    </div>
  );
}
