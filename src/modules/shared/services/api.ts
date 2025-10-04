/**
 * API Service - Configuración base para comunicación con el backend
 * Platform Web Frontend - Next.js TypeScript
 */

import { fetchWithSSL } from '@/lib/ssl-config';

// Tipos básicos
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  sortBy: string | null;
}

// Tipos para autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: string; // Token JWT
  errors?: string[];
}

// Configuración base de la API para Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5062';

/**
 * Clase para manejo de errores de API
 */
export class ApiError extends Error {
  status: number;
  errors?: string[];
  endpoint?: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status = 500,
    errors?: string[],
    endpoint?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.endpoint = endpoint;
    this.details = details;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

/**
 * Servicio base de API con métodos genéricos
 */
export class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = parseInt(process.env.API_TIMEOUT || '30000');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Establece el token de autenticación
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Elimina el token de autenticación
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Obtiene el token de autenticación actual
   */
  private getAuthToken(): string | null {
    return this.defaultHeaders['Authorization']?.replace('Bearer ', '') || null;
  }

  /**
   * Parsea la respuesta de error del servidor
   */
  private async parseErrorResponse(response: Response): Promise<Record<string, unknown>> {
    try {
      const contentType = response.headers.get('content-type');

      // Si la respuesta es JSON, intentar parsearlo
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();

        // Manejar diferentes formatos de respuesta del backend
        if (typeof errorData === 'string') {
          return { message: errorData };
        }

        // Si el backend envía un formato estructurado
        if (errorData.message || errorData.error || errorData.title) {
          return {
            message: errorData.message || errorData.error || errorData.title,
            errors: errorData.errors || errorData.details,
            ...errorData,
          };
        }

        return errorData;
      }

      // Si no es JSON, intentar obtener el texto plano
      const textError = await response.text();
      if (textError.trim()) {
        return { message: textError };
      }

      // Fallback al statusText
      return { message: response.statusText };
    } catch {
      // Si todo falla, usar mensajes por defecto según el código de estado
      if (response.status === 403) {
        return { message: 'No tienes permisos para realizar esta acción.' };
      } else if (response.status === 401) {
        return { message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' };
      }

      return { message: response.statusText || 'Error desconocido' };
    }
  }

  /**
   * Construye la URL completa
   */
  private buildURL(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  /**
   * Realiza una petición HTTP genérica
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.buildURL(endpoint);

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new ApiError(
          (errorData.message as string) || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.errors as string[],
          endpoint,
          errorData
        );
      }

      // Si la respuesta está vacía (204 No Content), retornar objeto vacío
      if (response.status === 204) {
        return {} as T;
      }

      // Verificar si hay contenido antes de intentar parsear JSON
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');

      // Si no hay content-type de JSON o content-length es 0, retornar objeto vacío
      if (!contentType?.includes('application/json') || contentLength === '0') {
        return {} as T;
      }

      // Intentar obtener el texto de la respuesta primero
      const responseText = await response.text();

      // Si el texto está vacío, retornar objeto vacío
      if (!responseText.trim()) {
        return {} as T;
      }

      // Intentar parsear el JSON
      try {
        const data = JSON.parse(responseText);
        return data;
      } catch {
        // Si falla el parsing pero la respuesta fue exitosa, retornar objeto vacío
        return {} as T;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Error de red, timeout o parsing
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        [],
        endpoint
      );
    }
  }

  /**
   * Petición GET genérica
   */
  async get<T>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * Petición POST genérica
   */
  async post<T>(
    endpoint: string,
    data?: Record<string, unknown> | FormData,
    config?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Petición PUT genérica
   */
  async put<T>(
    endpoint: string,
    data?: Record<string, unknown> | FormData,
    config?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Petición PATCH genérica
   */
  async patch<T>(
    endpoint: string,
    data?: Record<string, unknown> | FormData,
    config?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Petición DELETE genérica
   */
  async delete<T>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }

  /**
   * Construye parámetros de URL para paginación y filtros
   */
  buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Petición GET con parámetros de consulta
   */
  async getWithParams<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {},
    config?: RequestInit
  ): Promise<T> {
    const queryString = this.buildQueryParams(params);
    return this.get<T>(`${endpoint}${queryString}`, config);
  }
}

// Instancia por defecto del servicio API
export const apiService = new ApiService();
export const backendApiService = new ApiService(BACKEND_API_URL);

// Funciones de utilidad exportadas (compatibilidad con código existente)
/**
 * Servicio de autenticación para comunicación con el backend
 */

export class AuthService {
  private baseURL: string;

  constructor(baseURL: string = BACKEND_API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Realiza login con email y contraseña
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const url = `${this.baseURL}/Api/Auth/Login`;

      // Intento de login a la API de autenticación
      const response = await fetchWithSSL(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Respuesta recibida del servidor de autenticación

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        console.error(
          '🔐 [AUTH] Error en la respuesta:',
          response.status,
          errorData.message || response.statusText
        );
        return {
          success: false,
          message:
            errorData.message ||
            `Error de autenticación: ${response.statusText || 'Verifique sus credenciales'}`,
          errors: errorData.errors,
        };
      }

      // Obtener el texto de la respuesta
      const responseText = await response.text();

      // El backend devuelve el token directamente como texto
      if (responseText && responseText.startsWith('eyJ')) {
        // Decodificar el token JWT para extraer información del usuario
        const tokenPayload = this.decodeJWT(responseText);

        // Mapear userTypeName a un rol del sistema
        let userRole = 'employee';
        if (tokenPayload.userTypeName) {
          const userTypeName = tokenPayload.userTypeName as string;
          console.log('🔐 [AUTH] userTypeName encontrado:', userTypeName);

          // Mapear userTypeName a roles del sistema
          if (userTypeName === 'Administrador') {
            userRole = 'admin';
          } else if (userTypeName === 'Supervisor') {
            userRole = 'supervisor';
          } else if (userTypeName === 'Asesor') {
            userRole = 'advisor';
          } else {
            userRole = 'employee';
          }
        } else if (credentials.email === 'admin@platform.com') {
          // Fallback para el usuario administrador
          userRole = 'admin';
        }

        // Crear objeto de usuario a partir del payload del token
        const user = {
          id: (tokenPayload.userId as string) || '10000000-0000-0000-0000-000000000001',
          email: (tokenPayload.userEmail as string) || credentials.email,
          name: (tokenPayload.userName as string) || 'Super Admin',
          role: (tokenPayload.userTypeName as string) || 'Administrador',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${(tokenPayload.userName as string) || credentials.email}`,
          department: 'Administración',
          position: (tokenPayload.userTypeName as string) || 'Administrador',
          permissions: (tokenPayload.permission as string[]) || [],
        };

        console.log('👤 [AUTH] Usuario creado desde token:', user);

        return {
          success: true,
          data: responseText, // Devolvemos directamente el token como string
          message: 'Login exitoso',
        };
      }

      // Intentar parsear como JSON si no es un token JWT
      try {
        const data = JSON.parse(responseText);
        return {
          success: true,
          data: data,
          message: data.message || 'Login exitoso',
        };
      } catch {
        throw new ApiError('Respuesta inesperada del servidor', 500, [], '/Auth/Login');
      }
    } catch (error) {
      // Error durante el proceso de login

      if (error instanceof ApiError) {
        throw error;
      }

      // Proporcionar más detalles sobre el error
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      throw new ApiError(
        `Error de conexión con el servidor: ${errorMessage}`,
        500,
        [],
        '/Auth/Login',
        error as Record<string, unknown>
      );
    }
  }

  /**
   * Decodifica un token JWT para extraer su payload
   */
  private decodeJWT(token: string): Record<string, unknown> {
    try {
      // Clave JWT proporcionada
      const jwtKey = 'A247DB24-C8AE-4B8A-8CB2-59637754BF2F';
      console.log('🔑 [AUTH] Decodificando token JWT con clave:', jwtKey.substring(0, 8) + '...');

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

      // Parsear el payload
      const payloadObj = JSON.parse(decoded) as Record<string, unknown>;
      console.log('🔐 [AUTH] Payload decodificado:', Object.keys(payloadObj).join(', '));

      return payloadObj;
    } catch (error) {
      // Error al decodificar el token JWT
      console.error('❌ [AUTH] Error al decodificar token JWT:', error);
      return {};
    }
  }

  /**
   * Valida token de autenticación
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/Api/Auth/ValidateToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // En desarrollo, ignorar errores de certificado SSL
        ...(process.env.NODE_ENV === 'development' && {
          agent: false,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instancia del servicio de autenticación
export const authService = new AuthService();

export const api = {
  get: <T>(endpoint: string, config?: RequestInit) => apiService.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: Record<string, unknown> | FormData, config?: RequestInit) =>
    apiService.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: Record<string, unknown> | FormData, config?: RequestInit) =>
    apiService.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: Record<string, unknown> | FormData, config?: RequestInit) =>
    apiService.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: RequestInit) => apiService.delete<T>(endpoint, config),
  getWithParams: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    config?: RequestInit
  ) => apiService.getWithParams<T>(endpoint, params, config),
};

export default apiService;
