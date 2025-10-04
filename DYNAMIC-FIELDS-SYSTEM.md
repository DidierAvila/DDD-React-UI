# Sistema de Campos Dinámicos

## Descripción General

El sistema de campos dinámicos permite personalizar la información recopilada para diferentes tipos de usuarios mediante una arquitectura de dos niveles:

1. **Campos de Tipo de Usuario (UserType Fields)**: Campos definidos a nivel de tipo de usuario que se aplican automáticamente a todos los usuarios de ese tipo.
2. **Campos Personales (Personal Fields)**: Campos específicos para usuarios individuales que complementan o sobrescriben los campos del tipo de usuario.

## Arquitectura del Sistema

### Tipos de Campos Soportados

- `text`: Campo de texto simple
- `textarea`: Campo de texto multilínea
- `number`: Campo numérico
- `email`: Campo de email con validación
- `phone`: Campo de teléfono
- `url`: Campo de URL
- `date`: Campo de fecha
- `datetime`: Campo de fecha y hora
- `time`: Campo de hora
- `boolean`: Campo booleano (checkbox)
- `select`: Campo de selección única
- `multiselect`: Campo de selección múltiple
- `file`: Campo de archivo (futuro)

### Estructura de Archivos

```
src/modules/shared/types/
├── dynamic-fields.ts              # Definiciones de tipos
└── dynamic-fields-validation.ts   # Utilitários de validación

src/modules/shared/services/
└── userPersonalFieldsService.ts   # Servicio para campos personales

src/modules/admin/services/
└── userTypeFieldsService.ts       # Servicio para campos de tipo de usuario

src/modules/shared/hooks/
├── useUserTypeFields.ts           # Hook para campos de tipo de usuario
├── useUserPersonalFields.ts       # Hook para campos personales
└── useDynamicFields.ts            # Hook maestro que combina ambos niveles

src/modules/shared/components/ui/
├── DynamicFieldRenderer.tsx       # Renderizador individual de campos
├── DynamicForm.tsx                # Formulario completo con validación
└── UserDynamicFieldsForm.tsx      # Componente integrado listo para usar

src/modules/admin/components/auth/user-types/
├── UserTypeFieldForm.tsx          # Formulario de administración de campos
└── UserTypeFieldsManager.tsx      # Panel de administración principal
```

## Uso del Sistema

### 1. Administración de Campos (Admin)

Para gestionar campos dinámicos de tipos de usuario:

```typescript
import { UserTypeFieldsManager } from '@/modules/admin/components/auth/user-types';

// En tu componente de administración
<UserTypeFieldsManager />
```

### 2. Formulario de Usuario (Frontend)

Para mostrar el formulario de campos dinámicos a los usuarios:

```typescript
import { UserDynamicFieldsForm } from '@/modules/shared/components/ui';

// En tu componente de usuario
<UserDynamicFieldsForm
  userTypeId="1"
  userId="123"
  onSave={(data) => console.log('Datos guardados:', data)}
/>
```

### 3. Uso de Hooks Individuales

#### Hook para campos de tipo de usuario (Admin):

```typescript
import { useUserTypeFields } from '@/modules/shared/hooks/useUserTypeFields';

const {
  fields,
  loading,
  error,
  createField,
  updateField,
  deleteField,
  reorderFields
} = useUserTypeFields();

// Crear un nuevo campo
await createField({
  userTypeId: '1',
  name: 'phone',
  label: 'Teléfono',
  type: 'phone',
  required: true,
  order: 1
});
```

#### Hook para campos personales:

```typescript
import { useUserPersonalFields } from '@/modules/shared/hooks/useUserPersonalFields';

const {
  fields,
  loading,
  saveFieldValue
} = useUserPersonalFields('userId123');

// Guardar valor de campo personal
await saveFieldValue('phone', '+1234567890');
```

#### Hook maestro (recomendado):

```typescript
import { useDynamicFields } from '@/modules/shared/hooks/useDynamicFields';

const {
  combinedFields,
  loading,
  error,
  saveValues,
  validateField
} = useDynamicFields('userTypeId1', 'userId123');

// Los campos combinados incluyen tanto los del tipo de usuario
// como los personales, con precedencia para los personales
```

## Configuración de Campos

### Definición de Campo Básico

```typescript
const fieldDefinition: DynamicFieldDefinition = {
  name: 'phone',           // Identificador único
  label: 'Teléfono',       // Etiqueta visible
  type: 'phone',           // Tipo de campo
  required: true,          // Si es obligatorio
  order: 1,                // Orden de visualización
  section: 'contact',      // Sección del formulario (opcional)
  helpText: 'Incluye código de país', // Texto de ayuda
  placeholder: '+1 234 567 8900',     // Placeholder
};
```

### Campos de Selección

```typescript
const selectField: DynamicFieldDefinition = {
  name: 'country',
  label: 'País',
  type: 'select',
  required: true,
  order: 2,
  fieldConfig: {
    options: [
      { value: 'us', label: 'Estados Unidos' },
      { value: 'mx', label: 'México' },
      { value: 'ca', label: 'Canadá' }
    ]
  }
};
```

### Validación Personalizada

```typescript
const validatedField: DynamicFieldDefinition = {
  name: 'age',
  label: 'Edad',
  type: 'number',
  required: true,
  validation: {
    min: 18,
    max: 120,
    pattern: '^[0-9]+$'
  }
};
```

## Páginas de Administración

### Página de Gestión de Campos Dinámicos

Accesible en: `/auth/dynamic-fields`

Esta página permite a los administradores:
- Ver todos los campos dinámicos por tipo de usuario
- Crear, editar y eliminar campos
- Reordenar campos
- Activar/desactivar campos

### Página de Pruebas (Desarrollo)

Accesible en: `/auth/dynamic-fields-test`

Esta página permite a los desarrolladores:
- Probar el renderizado de campos
- Verificar la validación
- Simular diferentes escenarios de usuario

## Flujo de Datos

1. **Definición**: Los administradores definen campos usando `UserTypeFieldsManager`
2. **Almacenamiento**: Los campos se guardan usando `userTypeFieldsService`
3. **Recuperación**: Los hooks obtienen los campos del backend
4. **Renderizado**: `DynamicFieldRenderer` muestra cada campo según su tipo
5. **Validación**: Se aplican las reglas de validación definidas
6. **Persistencia**: Los valores se guardan usando los servicios correspondientes

## Consideraciones de Rendimiento

- Los campos se cargan una sola vez por sesión
- Se implementa caching en los hooks
- La validación se ejecuta de forma diferida
- El auto-guardado tiene debounce integrado

## Extensibilidad

Para agregar nuevos tipos de campos:

1. Agregar el tipo a `FieldType` en `dynamic-fields.ts`
2. Implementar el renderizado en `DynamicFieldRenderer.tsx`
3. Agregar validación en `dynamic-fields-validation.ts`
4. Actualizar la interfaz de administración

## Seguridad

- Validación tanto en frontend como backend
- Sanitización de datos de entrada
- Verificación de permisos para operaciones administrativas
- Prevención de inyección de código en campos de texto

## Testing

El sistema incluye:
- Página de pruebas interactiva
- Casos de prueba para validación
- Simulación de diferentes escenarios
- Verificación de integración completa

## Troubleshooting

### Problemas Comunes

1. **Campos no se muestran**: Verificar que el `userTypeId` sea correcto
2. **Validación no funciona**: Revisar las reglas de validación en la definición del campo
3. **Datos no se guardan**: Verificar permisos y conexión con el backend
4. **Rendimiento lento**: Considerar reducir el número de campos o implementar paginación

### Debug

Habilitar logs de desarrollo:
```typescript
// En el componente
console.log('Fields loaded:', combinedFields);
console.log('Form data:', formData);
```

### Logs del Sistema

Los hooks incluyen logging automático de:
- Carga de campos
- Operaciones CRUD
- Errores de validación
- Tiempos de respuesta
