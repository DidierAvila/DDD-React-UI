/**
 * Página de reportes - /report/reports
 * SignoSST Web Frontend - Next.js TypeScript
 */

import { Metadata } from 'next';
import { UsersByTypeReport } from '@/modules/reports';

export const metadata: Metadata = {
  title: 'Reportes - Usuarios por Tipo | Platform',
  description: 'Reporte de distribución de usuarios por tipo con gráficos y estadísticas detalladas',
};

export default function ReportsPage() {
  return <UsersByTypeReport />;
}