/**
 * Services Page - Página de gestión de servicios
 * Platform Web Frontend - Next.js TypeScript
 * Ruta: /service/services
 */

import { ServicesManagement } from '@/modules/platform/components/services/ServicesManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Servicios | Platform',
  description: 'Administra y gestiona los servicios de la plataforma',
};

export default function ServicesPage() {
  return <ServicesManagement />;
}
