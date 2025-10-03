# Manejo de Errores de API - Documentación

## Descripción General

El sistema de manejo de errores ha sido mejorado para distinguir específicamente entre errores 401 (Unauthorized) y 403 (Forbidden), proporcionando mensajes claros y comportamientos diferenciados para cada tipo de error.

## Tipos de Errores de Autenticación

### Error 401 - Unauthorized (Sesión Expirada)
- **Qué significa**: El token de autenticación ha expirado o no es válido
- **Comportamiento**: Muestra notificación de sesión expirada y redirige al login
- **Mensaje por defecto**: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."

### Error 403 - Forbidden (Sin Permisos)
- **Qué significa**: El usuario está autenticado pero no tiene permisos para realizar la acción
- **Comportamiento**: Muestra notificación de permisos insuficientes sin redirigir
- **Mensaje por defecto**: "No tienes permisos para realizar esta acción."

## Uso en Componentes

### Ejemplo básico con useApiError

```tsx
import { useApiError } from '@/modules/shared/hooks/useApiError';
import { usersService } from '@/modules/admin/services/usersService';

function UsersComponent() {
  const { handleError } = useApiError();

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersService.delete(userId);
      // Éxito - mostrar mensaje de confirmación
    } catch (error) {
      // El hook se encarga automáticamente de mostrar el mensaje apropiado
      handleError(error);
    }
  };

  return (
    <button onClick={() => handleDeleteUser('123')}>
      Eliminar Usuario
    </button>
  );
}
```

### Ejemplo con manejo personalizado para 403

```tsx
import { useApiError } from '@/modules/shared/hooks/useApiError';
import { ApiError } from '@/modules/shared/services/api';
import { usersService } from '@/modules/admin/services/usersService';

function AdminUsersComponent() {
  const { handleError } = useApiError();

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await usersService.create(userData);
      // Éxito
    } catch (error) {
      if (error instanceof ApiError && error.isForbidden) {
        // Manejo específico para errores de permisos
        console.log('El usuario no tiene permisos para crear usuarios');
        // Puedes ocultar botones, deshabilitar funciones, etc.
      }

      // Siempre llamar a handleError para mostrar la notificación
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleCreateUser}>
      {/* Formulario */}
    </form>
  );
}
```

## Formato de Respuestas del Backend

El sistema puede manejar diferentes formatos de respuesta de error del backend:

### Formato JSON estructurado
```json
{
  "message": "No tienes permisos para eliminar usuarios",
  "errors": ["Rol insuficiente", "Acción no permitida"],
  "title": "Acceso Denegado"
}
```

### Formato simple
```json
{
  "error": "Forbidden - Insufficient permissions"
}
```

### Texto plano
```
No tienes permisos para realizar esta acción
```

## Propiedades de ApiError

```typescript
const apiError = new ApiError(message, status, errors, endpoint);

// Propiedades útiles
apiError.isUnauthorized    // true si status === 401
apiError.isForbidden       // true si status === 403
apiError.isAuthError       // true si status === 401 || 403
apiError.isServerError     // true si status >= 500
apiError.isClientError     // true si status >= 400 && < 500
apiError.isNetworkError    // true si status === 0
```

## Configuración de Mensajes

### Mensajes por defecto del sistema:
- **401**: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
- **403**: "No tienes permisos para realizar esta acción."
- **500+**: "Error del servidor. Por favor, intenta nuevamente más tarde."
- **Network**: "Error de conexión. Verifica tu conexión a internet."

### Personalización
Los mensajes pueden ser sobrescritos por el backend enviando un campo `message` en la respuesta de error.

## Recomendaciones

1. **Siempre usar el hook useApiError** para manejo consistente de errores
2. **Capturar errores 403 específicamente** cuando necesites lógica condicional
3. **No redirigir en errores 403** - el usuario sigue autenticado
4. **Enviar mensajes claros desde el backend** para mejor UX
5. **Logging de errores** - los errores se registran automáticamente para debugging

## Ejemplo de Implementación en el Backend (.NET)

```csharp
// Para error 403 - Forbidden
return StatusCode(403, new {
    message = "No tienes permisos para eliminar usuarios",
    errors = new[] { "Rol insuficiente para esta operación" }
});

// Para error 401 - Unauthorized
return StatusCode(401, new {
    message = "Token expirado o inválido"
});
```
