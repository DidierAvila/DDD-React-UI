/**
 * Enhanced MainLayout Example - Ejemplo de implementación con sistema centralizado de usuario
 * Demuestra cómo usar useEnhancedUser y UserBanner para centralizar datos
 * Platform Web Frontend - Next.js TypeScript
 */

'use client';

import { Menu as MenuIcon, NavigateNext, Notifications } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEnhancedUser } from '../../hooks/useEnhancedUser';
import { UserBanner } from '../ui/UserBanner';

interface EnhancedMainLayoutProps {
  children: React.ReactNode;
}

/**
 * Ejemplo de MainLayout que usa el sistema centralizado de usuario
 * Reemplaza la lógica dispersa de usuario con un hook y componente centralizados
 */
export function EnhancedMainLayout({ children }: EnhancedMainLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  // Hook centralizado para datos del usuario - reemplaza múltiples sources
  const {
    user,
    isLoading,
    isAuthenticated,
    tokenData,
    meData,
    meLoading,
    meError,
    getDisplayName,
  } = useEnhancedUser();

  // Generar breadcrumbs basado en la ruta actual
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href?: string }[] = [
      { label: 'Inicio', href: '/dashboard' },
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === pathSegments.length - 1;
      breadcrumbs.push({
        label,
        ...(isLast ? {} : { href: currentPath }),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar con información centralizada del usuario */}
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Sección izquierda */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton edge="start" color="inherit">
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Platform Manager
            </Typography>
          </Box>

          {/* Sección central - Breadcrumbs */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, mx: 4 }}>
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ color: 'text.secondary' }}
              >
                {breadcrumbs.map((crumb, index) =>
                  crumb.href ? (
                    <Link key={index} underline="hover" color="inherit" href={crumb.href}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <Typography key={index} color="text.primary">
                      {crumb.label}
                    </Typography>
                  )
                )}
              </Breadcrumbs>
            </Box>
          )}

          {/* Sección derecha - Usuario y notificaciones */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notificaciones */}
            <IconButton color="inherit">
              <Notifications />
            </IconButton>

            {/* Banner de usuario centralizado - reemplaza toda la lógica dispersa */}
            <UserBanner
              variant={isMobile ? 'compact' : 'horizontal'}
              showUserType={!isMobile}
              showEmail={!isMobile}
              showActions={true}
              showRefresh={true}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Debug Info - Mostrar fuentes de datos (temporal para desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            bgcolor: 'info.light',
            color: 'info.contrastText',
            p: 1,
            fontSize: '0.75rem',
          }}
        >
          <Typography variant="caption">
            🔍 Debug - Fuentes de datos centralizadas:
            {tokenData && ' Token✓'}
            {meData && ' /me✓'}
            {meLoading && ' (Cargando...)'}
            {meError && ` Error: ${meError}`}
          </Typography>
        </Box>
      )}

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>

      {/* Footer con información adicional del usuario */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
          mt: 'auto',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          Sesión activa como {getDisplayName()}
          {user?.userTypeName && ` • ${user.userTypeName}`}
          {tokenData && ` • ID: ${tokenData.userId}`}
        </Typography>
      </Box>
    </Box>
  );
}

export default EnhancedMainLayout;
