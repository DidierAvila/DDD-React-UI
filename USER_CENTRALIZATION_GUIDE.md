# Centralización de Datos de Usuario - Guía de Migración

## 📋 Resumen

Este documento explica cómo migrar del sistema actual de gestión de datos de usuario (disperso en múltiples fuentes) a un sistema centralizado que unifica los datos del token JWT y el endpoint `/api/Auth/me`.

## 🎯 Problema Identificado

**Fuentes de datos dispersas:**
- ✅ Token JWT: `userId`, `userName`, `userEmail`, `userTypeId`, `userTypeName`
- ✅ Endpoint `/me`: Avatar, configuración del portal, roles, navegación
- ✅ Sesión NextAuth: Datos básicos de autenticación
- ❌ Cada componente consulta diferentes fuentes
- ❌ Duplicación de lógica de deserialiización de token
- ❌ Estados de carga inconsistentes

## 🚀 Solución Implementada

### 1. Hook Centralizado: `useEnhancedUser`

**Ubicación:** `src/modules/shared/hooks/useEnhancedUser.ts`

**Características:**
- ✅ Combina datos del token JWT + endpoint `/me` + sesión NextAuth
- ✅ Interface unificada `EnhancedUser` con todos los datos
- ✅ Funciones utilitarias (`getDisplayName`, `getDisplayEmail`, etc.)
- ✅ Gestión centralizada de estados de carga y errores
- ✅ Función `refreshUserData()` para actualizar datos

**Interfaz principal:**
```typescript
interface EnhancedUser {
  // Datos básicos
  id: string;
  email: string;
  name: string;

  // Del token JWT (prioritarios)
  userId: string;
  userName: string;
  userEmail: string;
  userTypeId: string;
  userTypeName: string;

  // Del endpoint /me
  avatar?: string;
  portalConfiguration?: any;
  roles?: any[];
  navigation?: any[];

  // Computados/derivados
  displayName: string;
  displayEmail: string;
  displayUserType: string;
  initials: string;
}
```

### 2. Componente Centralizado: `UserBanner`

**Ubicación:** `src/modules/shared/components/ui/UserBanner.tsx`

**Variantes:**
- `horizontal`: Para headers (por defecto)
- `vertical`: Para sidebars
- `compact`: Solo avatar con tooltip

**Props configurables:**
```typescript
interface UserBannerProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  showUserType?: boolean;
  showEmail?: boolean;
  showActions?: boolean;
  showRefresh?: boolean;
  className?: string;
}
```

## 📝 Cómo Migrar

### Paso 1: Reemplazar `useAuth` y lógica dispersa

**ANTES (MainLayout.tsx):**
```typescript
// Múltiples hooks y contextos
const { data: session } = useSession();
const { user } = useUser();
const router = useRouter();

// Lógica de deserialización de token repetida
const extractTokenData = (token: string) => { /* ... */ };

// Mostrar datos manualmente
<Avatar src={session?.user?.image}>
  {session?.user?.name?.charAt(0)}
</Avatar>
<Typography>{session?.user?.name}</Typography>
<Typography>{session?.user?.email}</Typography>
```

**DESPUÉS:**
```typescript
// Un solo hook centralizado
const { user, isLoading } = useEnhancedUser();

// Componente especializado
<UserBanner
  variant="horizontal"
  showUserType={true}
  showEmail={true}
  showActions={true}
  showRefresh={true}
/>
```

### Paso 2: Actualizar imports

**Agregar a `src/modules/shared/hooks/index.ts`:**
```typescript
export * from './useEnhancedUser';
```

**Agregar a `src/modules/shared/components/ui/index.ts`:**
```typescript
export * from './UserBanner';
```

### Paso 3: Implementar en componentes

**En cualquier componente que necesite datos de usuario:**
```typescript
import { useEnhancedUser, UserBanner } from '@/modules/shared';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    tokenData,
    meData,
    getDisplayName
  } = useEnhancedUser();

  if (!isAuthenticated) return null;

  return (
    <div>
      {/* Opción 1: Usar el componente */}
      <UserBanner variant="compact" />

      {/* Opción 2: Usar los datos directamente */}
      <p>Hola, {getDisplayName()}</p>
      <p>Tipo: {user?.displayUserType}</p>
      <p>Token ID: {tokenData?.userId}</p>
      <p>Config portal: {meData?.portalConfiguration ? 'Sí' : 'No'}</p>
    </div>
  );
}
```

## 🔍 Beneficios de la Migración

### ✅ Ventajas Técnicas
1. **Una sola fuente de verdad** para todos los datos de usuario
2. **Eliminación de duplicación** de lógica de token
3. **Estados de carga unificados** y consistentes
4. **Fácil extensibilidad** para nuevos campos de usuario
5. **Type safety completo** con TypeScript

### ✅ Ventajas para Desarrollo
1. **Menos código boilerplate** en cada componente
2. **Debug centralizado** con información de fuentes de datos
3. **Componente reutilizable** para mostrar usuario
4. **Mantienimiento simplificado**

### ✅ Ventajas para UX
1. **Experiencia consistente** en toda la aplicación
2. **Estados de carga visuales** durante fetch de datos
3. **Manejo de errores unificado**
4. **Refrescado manual** de datos disponible

## 🧪 Testing y Debug

### Modo Desarrollo
El hook incluye debug info que muestra:
- ✅ Si el token está disponible y válido
- ✅ Si los datos del endpoint `/me` se cargaron correctamente
- ❌ Errores específicos de cada fuente

### Validación en Consola
```javascript
// En DevTools Console
console.log('Token data:', tokenData);
console.log('ME data:', meData);
console.log('Combined user:', user);
```

## 📋 Checklist de Migración

- [ ] Instalar nuevos archivos: `useEnhancedUser.ts` y `UserBanner.tsx`
- [ ] Actualizar archivos de índice para exportaciones
- [ ] Reemplazar `useAuth` con `useEnhancedUser` en componentes principales
- [ ] Cambiar displays manuales de usuario por `<UserBanner />`
- [ ] Eliminar lógica duplicada de deserialización de tokens
- [ ] Probar en diferentes estados: cargando, error, datos completos
- [ ] Validar que todos los datos se muestran correctamente
- [ ] Verificar responsive design en diferentes variantes
- [ ] Testing de funcionalidad de refresh manual

## 🚦 Próximos Pasos

1. **Fase 1**: Migrar MainLayout para probar el concepto
2. **Fase 2**: Migrar otros componentes que usan datos de usuario
3. **Fase 3**: Eliminar hooks y lógica antigua ya no utilizada
4. **Fase 4**: Optimizaciones adicionales (cache, etc.)

## ⚠️ Consideraciones Importantes

- El hook mantiene **retrocompatibilidad** con el sistema actual
- Los datos del **token tienen prioridad** sobre los del endpoint `/me`
- El componente `UserBanner` es **completamente opcional**
- La **migración puede ser gradual** por componentes
- En caso de errores, el sistema **degrada gracefully** a datos de sesión

---

**Estado:** ✅ Implementación completa y lista para migración
**Compatibilidad:** ✅ Next.js 15.5.2, React 19.1.1, Material-UI v7
**Testing:** ⏳ Pendiente testing en componente MainLayout
