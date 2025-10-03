# Componente de Servicios - Documentación

## Descripción General

Se ha implementado un sistema completo de gestión de servicios en el módulo **platform** con la ruta `/service/services`. El sistema incluye todas las funcionalidades CRUD necesarias para administrar servicios.

## Estructura Implementada

### 📁 Tipos de Datos (`src/modules/platform/types/service.ts`)
```typescript
interface Service {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  hourlyValue: number;
  supplierId: string;
  createdAt: string;
  updatedAt?: string;
}
```

### 🛠️ Servicio de API (`src/modules/platform/services/servicesService.ts`)
Clase `ServicesService` con métodos:
- `getAll()` - Obtener servicios con paginación y filtros
- `getById()` - Obtener servicio por ID
- `create()` - Crear nuevo servicio
- `update()` - Actualizar servicio existente
- `delete()` - Eliminar servicio
- `toggleStatus()` - Cambiar estado activo/inactivo
- `getBySupplier()` - Obtener servicios por proveedor
- `search()` - Buscar servicios por nombre

### 🎨 Componentes React

#### 1. `ServicesList` - Lista con DataGrid
- **Características:**
  - DataGrid de MUI con paginación del servidor
  - Columnas: Nombre, Descripción, Valor Hora, Estado, Fecha Creación
  - Acciones: Ver, Editar, Activar/Desactivar, Eliminar
  - Filtros aplicables desde el componente padre
  - Confirmación de eliminación con diálogo

#### 2. `ServiceForm` - Formulario de Creación/Edición
- **Características:**
  - Modal responsivo con validaciones
  - Campos: Nombre, Descripción, Valor Hora, ID Proveedor, Estado
  - Validación con react-hook-form
  - Formateo de moneda en tiempo real
  - Manejo de estados de carga

#### 3. `ServicesManagement` - Componente Principal
- **Características:**
  - Barra de herramientas con filtros
  - Búsqueda por nombre
  - Filtro por estado (activo/inactivo)
  - Filtro por ID de proveedor
  - Contador de filtros activos
  - Botón de crear nuevo servicio
  - Integración completa con los otros componentes

### 🌐 Página de Ruta (`src/app/service/services/page.tsx`)
- Ruta: `/service/services`
- Metadata configurada para SEO
- Renderiza el componiente `ServicesManagement`

## Características Técnicas

### ✅ Funcionalidades Implementadas
- **CRUD Completo**: Crear, leer, actualizar y eliminar servicios
- **Paginación del servidor**: Manejo eficiente de grandes conjuntos de datos
- **Filtros múltiples**: Búsqueda, estado, proveedor, rango de precios
- **Validaciones**: Formularios con validación robusta
- **UX/UI moderna**: Material-UI v7 con diseño responsivo
- **Manejo de errores**: Integrado con el sistema de errores existente
- **Confirmaciones**: Diálogos de confirmación para acciones destructivas
- **Estados de carga**: Feedback visual durante operaciones asíncronas

### 🔧 Tecnologías Utilizadas
- **React 19** con TypeScript
- **Material-UI v7** para componentes UI
- **MUI X DataGrid** para tablas avanzadas
- **react-hook-form** para manejo de formularios
- **Next.js App Router** para routing
- **Arquitectura modular** siguiendo patrones DDD

### 🎯 Integración con Backend
El sistema está preparado para conectarse con un backend .NET que implemente:

```csharp
// Endpoint base: /Api/Platform/Services
public class ServiceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public bool Status { get; set; }
    public decimal HourlyValue { get; set; }
    public Guid SupplierId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

## Uso del Componente

### Navegación
Para acceder al componente: `http://localhost:3001/service/services`

### Operaciones Disponibles
1. **Ver lista** de servicios con información completa
2. **Buscar** servicios por nombre
3. **Filtrar** por estado o proveedor
4. **Crear** nuevos servicios
5. **Editar** servicios existentes
6. **Activar/Desactivar** servicios
7. **Eliminar** servicios (con confirmación)

### Permisos
El sistema está integrado con el manejo de errores existente, por lo que automáticamente mostrará mensajes apropiados si el usuario no tiene permisos para realizar ciertas acciones (errores 403).

## Próximos Pasos

1. **Implementar backend** con los endpoints correspondientes
2. **Agregar relación con proveedores** para mostrar nombres en lugar de IDs
3. **Implementar vista de detalles** para servicios individuales
4. **Agregar export/import** de servicios
5. **Implementar auditoría** de cambios en servicios

## Archivos Creados/Modificados

### Nuevos Archivos
- `src/modules/platform/types/service.ts` (actualizado)
- `src/modules/platform/services/servicesService.ts`
- `src/modules/platform/components/services/ServicesList.tsx`
- `src/modules/platform/components/services/ServiceForm.tsx`
- `src/modules/platform/components/services/ServicesManagement.tsx`
- `src/modules/platform/components/services/index.ts`
- `src/app/service/services/page.tsx`

### Archivos Modificados
- `src/modules/platform/services/index.ts`
- `src/modules/platform/components/index.ts`

### Dependencias Agregadas
- `react-hook-form@^7.x`
- `@hookform/resolvers@^3.x`

El sistema está completamente funcional y listo para ser utilizado con el backend correspondiente.
