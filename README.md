# Platform Web Frontend

Aplicación web frontend para el sistema de gestión Platform.

## 🚀 Tecnologías

- **Framework**: Next.js 15.5.2
- **React**: 19.1.1
- **TypeScript**: 5.9.2
- **UI Framework**: Material-UI (MUI) v7.3.2
- **Autenticación**: NextAuth.js v4.24.11
- **Data Grid**: MUI X Data Grid v8.11.0
- **Date Pickers**: MUI X Date Pickers v8.12.0
- **Estilos**: Emotion (CSS-in-JS) v11.14.0
- **Notificaciones**: Notistack v3.0.2
- **Fechas**: date-fns v4.1.0
- **Testing**: Jest v29.7.0
- **Linting**: ESLint v9.36.0
- **Formateo**: Prettier v3.6.2

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Backend API de Platform ejecutándose

## 🛠️ Instalación

1. Clona el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd platform-web
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno en `.env.local`:

- URL del API backend
- Credenciales de OAuth (Google, etc.)
- Clave JWT para autenticación con el backend
- Secretos de NextAuth

## 🚀 Scripts Disponibles

### Desarrollo
- **`npm run dev`** - Inicia el servidor de desarrollo en [http://localhost:3001](http://localhost:3001)
- **`npm run build`** - Construye la aplicación para producción
- **`npm start`** - Inicia el servidor de producción en puerto 3001

### Testing
- **`npm test`** - Ejecuta las pruebas con Jest
- **`npm run test:watch`** - Ejecuta las pruebas en modo watch
- **`npm run test:auth`** - Ejecuta específicamente las pruebas de autenticación
- **`npm run test:coverage`** - Ejecuta las pruebas con reporte de cobertura

### Calidad de Código
- **`npm run lint`** - Ejecuta ESLint para revisar el código
- **`npm run lint:fix`** - Ejecuta ESLint y corrige automáticamente los errores
- **`npm run format`** - Formatea el código con Prettier
- **`npm run format:check`** - Verifica si el código está formateado correctamente
- **`npm run type-check`** - Verifica los tipos de TypeScript sin compilar
- **`npm run check-all`** - Ejecuta todas las verificaciones (tipos, lint, formato)

## 📁 Estructura del Proyecto

El proyecto sigue una **arquitectura modular** que permite la coexistencia de diferentes portales:

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API routes
│   │   ├── auth/          # Autenticación y NextAuth
│   │   └── backend/       # Proxy al backend
│   ├── auth/              # Páginas de autenticación y gestión
│   ├── dashboard/         # Dashboards por rol
│   └── unauthorized/      # Página de acceso denegado
├── components/
│   └── shared/            # Componentes globales compartidos
├── config/                # Configuraciones globales
├── lib/                   # Utilidades y configuraciones
│   ├── auth.ts           # Configuración NextAuth
│   ├── cookieUtils.ts    # Manejo de cookies
│   └── ssl-config.ts     # Configuración SSL
├── modules/               # 🎯 ARQUITECTURA MODULAR
│   ├── admin/            # Portal administrativo
│   │   ├── components/   # Componentes del módulo admin
│   │   ├── services/     # Servicios específicos de admin
│   │   ├── types/        # Tipos TypeScript de admin
│   │   └── hooks/        # Hooks específicos de admin
│   ├── platform/         # Plataforma principal de negocio
│   │   ├── components/   # Componentes de la plataforma
│   │   ├── services/     # Servicios de la plataforma
│   │   └── types/        # Tipos de la plataforma
│   └── shared/           # Elementos compartidos entre módulos
│       ├── components/   # Componentes reutilizables
│       ├── hooks/        # Hooks compartidos
│       ├── services/     # Servicios base
│       ├── types/        # Tipos compartidos
│       └── contexts/     # Contextos globales
└── tests/                # Pruebas del proyecto
```

### 🏗️ Arquitectura Modular

- **`modules/admin/`**: Portal para administradores del sistema
- **`modules/platform/`**: Portal principal de la plataforma de negocio
- **`modules/shared/`**: Componentes, hooks y servicios reutilizables

## 🔐 Autenticación

El sistema utiliza NextAuth.js con soporte para:

- Google OAuth 2.0 (configurado)
- Credenciales personalizadas
- Otros proveedores (Facebook, Microsoft, LinkedIn) - pendientes de configuración

## 🌐 API Backend

La aplicación se conecta al backend de Platform que debe estar ejecutándose en:

- Desarrollo: `http://localhost:8000/api`
- Configurar `NEXT_PUBLIC_API_URL` en `.env.local`

## 📱 Funcionalidades

### ✅ Portal Administrativo (`/admin`)
- **Gestión de usuarios** - CRUD completo de usuarios del sistema
- **Gestión de roles** - Administración de roles y permisos
- **Gestión de permisos** - Control granular de accesos
- **Gestión de tipos de usuario** - Configuración de tipos de usuario
- **Dashboard administrativo** - Métricas y estadísticas del sistema

### ✅ Plataforma Principal (`/platform`)
- **Dashboard de plataforma** - Vista principal para usuarios de negocio
- **Módulos operativos** - Funcionalidades core de la plataforma

### ✅ Características Generales
- **Autenticación robusta** - NextAuth.js con Google OAuth y credenciales
- **Interfaz responsive** - Material-UI v7 con componentes modernos
- **Middleware de seguridad** - Control de acceso basado en roles
- **Data Grid avanzado** - MUI X Data Grid para manejo de datos
- **Sistema de notificaciones** - Notistack para feedback al usuario
- **Gestión de fechas** - date-fns para manejo de fechas
- **Arquitectura modular** - Organización escalable por módulos

### 🔄 En Desarrollo
- Gestión de asesores Platform
- Gestión de diagnósticos Platform
- Reportes y análisis avanzados
- Integración con APIs externas

## 🧪 Testing

El proyecto incluye un sistema de pruebas configurado con Jest:

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch para desarrollo
npm run test:watch

# Pruebas específicas de autenticación
npm run test:auth

# Reporte de cobertura
npm run test:coverage
```

Las pruebas están organizadas en la carpeta `tests/` e incluyen:
- Pruebas de autenticación y autorización
- Pruebas de componentes React
- Pruebas de servicios de API
- Pruebas de utilidades y helpers

## 🛠️ Desarrollo

### Configuración del Entorno

1. **Variables de entorno** (`.env.local`):
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=tu-secreto-aqui
NEXT_PUBLIC_API_URL=http://localhost:8000/api
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
JWT_SECRET=tu-jwt-secret
```

2. **Flujo de desarrollo**:
```bash
# Verificar tipos, lint y formato antes de commit
npm run check-all

# Desarrollo con auto-reload
npm run dev

# Ejecutar pruebas en paralelo
npm run test:watch
```

### Arquitectura de Módulos

El sistema modular permite desarrollar funcionalidades independientes:

- **Independencia**: Cada módulo puede desarrollarse por separado
- **Reutilización**: Los elementos compartidos están en `modules/shared/`
- **Escalabilidad**: Fácil agregar nuevos módulos sin afectar existentes
- **Mantenibilidad**: Lógica de negocio organizada por dominio

## 🚀 Despliegue

1. Construye la aplicación:

```bash
npm run build
```

2. Inicia el servidor de producción:

```bash
npm start
```

## 📄 Licencia

Este proyecto es privado y pertenece a [NOMBRE_DE_LA_EMPRESA].

## 🤝 Contribución

Para contribuir al proyecto, sigue las guías de desarrollo establecidas y asegúrate de que todas las pruebas pasen antes de hacer commit.
