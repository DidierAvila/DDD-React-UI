# Arquitectura Modular del Proyecto Platform

## Estructura de Módulos

El proyecto Platform Web está organizado en una arquitectura modular que permite la coexistencia de diferentes portales y funcionalidades en un mismo proyecto.

### 📁 Módulo `admin` - Portal Administrativo

**Ubicación:** `src/modules/admin/`

**Propósito:** Componentes específicos para usuarios administradores del sistema.

**Funcionalidades implementadas:**

- Gestión de usuarios (`UsersManagement`)
- Gestión de roles (`RolesManagement`)
- Gestión de permisos (`PermissionsManagement`)
- Gestión de tipos de usuario (`UserTypesManagement`)
- Dashboard administrativo (`AdminDashboard`)
- Vista de administración general (`AdministrationView`)

**Rutas asociadas:**

- `/users` - Gestión de usuarios
- `/roles` - Gestión de roles
- `/permissions` - Gestión de permisos
- `/user-types` - Gestión de tipos de usuario
- `/administracion` - Vista general de administración
- `/dashboard` - Dashboard administrativo

### 📁 Módulo `platform` - Plataforma Principal

**Ubicación:** `src/modules/platform/`

**Propósito:** Componentes del portal principal de la plataforma Platform.

**Funcionalidades:**

- Dashboard de plataforma (`PlatformDashboard`)
- Módulos operativos del negocio
- Evaluaciones Platform
- Reportes y análisis
- Funcionalidades core de la plataforma

### 📁 Módulo `shared` - Componentes Compartidos

**Ubicación:** `src/modules/shared/`

**Propósito:** Elementos reutilizables entre todos los módulos.

**Contenido:**

- Componentes de UI base
- Contextos globales (`UserContext`, `NotificationContext`)
- Hooks personalizados
- Utilidades y helpers
- Servicios comunes
- Configuraciones globales
- Tipos y interfaces TypeScript

## Principios de la Arquitectura

### ✅ Separación de Responsabilidades

- Cada módulo tiene un propósito específico y bien definido
- Los componentes están organizados por funcionalidad
- Clara distinción entre lógica administrativa y operativa

### ✅ Reutilización de Código

- Componentes shared evitan duplicación
- Contextos y hooks centralizados
- Utilidades comunes accesibles desde cualquier módulo

### ✅ Escalabilidad

- Fácil agregar nuevos módulos
- Estructura preparada para crecimiento
- Organización que facilita el mantenimiento

### ✅ Desarrollo en Equipo

- Diferentes equipos pueden trabajar en módulos específicos
- Reducción de conflictos en el código
- Responsabilidades claras por módulo

## Convenciones de Nomenclatura

### Componentes

- **PascalCase** para nombres de componentes
- **Sufijo descriptivo** del tipo de componente (Management, Dashboard, View)
- **Prefijo del módulo** cuando sea necesario para claridad

### Archivos y Carpetas

- **kebab-case** para nombres de carpetas
- **PascalCase** para archivos de componentes
- **camelCase** para archivos de utilidades
- **index.ts** para exportaciones de módulo

### Rutas

- **kebab-case** para URLs
- **Rutas descriptivas** que reflejen la funcionalidad
- **Agrupación lógica** por módulo cuando sea apropiado

## Estructura de Carpetas por Módulo

```
modules/
├── admin/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── administration/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── user-types/
│   │   └── index.ts
│   ├── hooks/
│   ├── services/
│   └── types/
├── platform/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
└── shared/
    ├── components/
    ├── contexts/
    ├── hooks/
    ├── utils/
    ├── services/
    └── types/
```

## Consideraciones para Futuras Implementaciones

### 🔄 Al Agregar Nuevas Funcionalidades

1. **Evaluar el módulo apropiado** - ¿Es admin, platform o shared?
2. **Seguir las convenciones** establecidas de nomenclatura
3. **Reutilizar componentes shared** cuando sea posible
4. **Mantener la separación** de responsabilidades
5. **Actualizar exportaciones** en archivos index.ts

### 🔄 Al Crear Nuevos Módulos

1. **Seguir la estructura** de carpetas establecida
2. **Definir claramente** el propósito del módulo
3. **Establecer las exportaciones** apropiadas
4. **Documentar** las funcionalidades del módulo

### 🔄 Al Modificar Componentes Shared

1. **Considerar el impacto** en todos los módulos
2. **Mantener retrocompatibilidad** cuando sea posible
3. **Actualizar documentación** si es necesario
4. **Probar en todos los contextos** de uso

## Tecnologías y Herramientas

- **Framework:** Next.js 14+ con App Router
- **UI Library:** Material-UI (MUI)
- **Lenguaje:** TypeScript
- **Gestión de Estado:** React Context API
- **Estilos:** Material-UI Theme System
- **Routing:** Next.js App Router

## Estado Actual de la Arquitectura (Revisión)

### ✅ Elementos Correctamente Ubicados

**Estructura modular implementada correctamente:**

- Todos los componentes están organizados en los módulos apropiados (admin, platform, shared)
- No se encontraron componentes fuera de la estructura modular
- Los imports siguen las convenciones establecidas usando `@/modules/`

**Módulos bien estructurados:**

- `admin/` - Componentes administrativos completos
- `platform/` - Componentes de la plataforma Platform
- `shared/` - Componentes, hooks, contextos y servicios compartidos

### 🔧 Mejoras Implementadas

**Barrel exports actualizados:**

- ✅ `src/modules/shared/index.ts` - Exportaciones completas
- ✅ `src/modules/shared/components/index.ts` - Incluye layout, ui, providers, auth
- ✅ `src/modules/shared/hooks/index.ts` - Incluye todos los hooks implementados
- ✅ `src/modules/shared/services/index.ts` - Incluye api y authService
- ✅ `src/modules/admin/index.ts` - Exportaciones completas
- ✅ `src/modules/platform/index.ts` - Exportaciones completas

### 📁 Archivos en `src/lib/`

**Evaluación de ubicación:**

- `auth.ts` - ✅ **Correctamente ubicado** - Configuración específica de NextAuth
- `ssl-config.ts` - ✅ **Correctamente ubicado** - Configuración de desarrollo SSL

**Justificación:** Estos archivos contienen configuraciones específicas del framework Next.js y no son componentes reutilizables, por lo que su ubicación en `src/lib/` es apropiada.

### 🎯 Recomendaciones para Futuras Implementaciones

1. **Mantener la estructura actual** - La arquitectura modular está bien implementada
2. **Usar barrel exports** - Facilitan las importaciones y mantienen APIs limpias
3. **Seguir convenciones de imports** - Usar `@/modules/` para referencias modulares
4. **Evaluar ubicación antes de crear** - Determinar el módulo apropiado (admin/platform/shared)
5. **Actualizar exports** - Mantener archivos index.ts actualizados al agregar componentes

---

**Fecha de creación:** Enero 2024
**Última revisión:** Enero 2024
**Versión:** 1.1
**Mantenido por:** Equipo de desarrollo Platform

> Este documento debe actualizarse cada vez que se realicen cambios significativos en la arquitectura del proyecto.
