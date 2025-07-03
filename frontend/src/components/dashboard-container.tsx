import { CardDashboard } from "./card-dashboard";
import { CardDashboardAdmin } from "./card-dashboard-admin";

interface DashboardContainerProps {
  userRole: 'admin' | 'professional' | 'receptionist';
  professionalId?: string;
}

export default function DashboardContainer({ userRole, professionalId }: DashboardContainerProps) {
  if (userRole === 'admin') {
    return <CardDashboardAdmin />;
  }

  return <CardDashboard userRole={userRole} professionalId={professionalId} />;
} 