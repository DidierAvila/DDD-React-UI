/**
 * NextAuth.js Configuration - Configuración de autenticación OAuth Multi-Provider
 * SignoSST Web Frontend - Next.js TypeScript
 */

import { authService } from '@/modules/shared/services/api';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';

// Tipos personalizados para NextAuth
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supervisor' | 'employee' | 'advisor';
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  position: string;
  avatar?: string;
  image?: string; // Para compatibilidad con Google OAuth
}

// Tipos personalizados para NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'supervisor' | 'employee' | 'advisor';
      status: 'active' | 'inactive' | 'suspended';
      department: string;
      position: string;
      avatar: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'supervisor' | 'employee' | 'advisor';
    status: 'active' | 'inactive' | 'suspended';
    department: string;
    position: string;
    avatar: string;
    accessToken?: string;
  }
}
// Extendemos el tipo JWT para incluir información del usuario
declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    userName: string;
    userEmail: string;
    userTypeId: string;
    userTypeName: string;
    permission: string[];
    avatar: string;
  }
}

/**
 * Función para manejar usuarios de Google - crear o actualizar información
 */
async function handleGoogleUser(googleUser: any): Promise<AuthUser> {
  try {
    // Intentar obtener el usuario existente desde el backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users?search=${encodeURIComponent(googleUser.email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Usuario existe, actualizar información si es necesario
        const existingUser = data.data[0];

        return {
          id: existingUser.id.toString(),
          email: existingUser.email,
          name: existingUser.name || googleUser.name,
          role: existingUser.role || 'employee',
          status: existingUser.status || 'active',
          department: existingUser.department || 'Sin asignar',
          position: existingUser.position || 'Usuario',
          avatar: existingUser.avatar || googleUser.image,
        };
      }
    }
  } catch (error) {
    console.warn('Error checking existing user, creating new user:', error);
  }

  // Usuario no existe, crear uno nuevo con información de Google
  try {
    const newUserData = {
      email: googleUser.email,
      name: googleUser.name,
      role: 'employee', // Por defecto
      status: 'active',
      department: 'Sin asignar',
      position: 'Usuario',
      avatar: googleUser.image,
      password: 'google-oauth-user', // Contraseña placeholder para usuarios de Google
    };

    const createResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData),
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      if (createData.success && createData.data) {
        return {
          id: createData.data.id.toString(),
          email: createData.data.email,
          name: createData.data.name,
          role: createData.data.role,
          status: createData.data.status,
          department: createData.data.department,
          position: createData.data.position,
          avatar: createData.data.avatar,
        };
      }
    }
  } catch (error) {
    console.warn('Error creating new user, using fallback:', error);
  }

  // Fallback: retornar usuario con información de Google
  return {
    id: googleUser.id || googleUser.sub,
    email: googleUser.email,
    name: googleUser.name,
    role: 'employee',
    status: 'active',
    department: 'Sin asignar',
    position: 'Usuario',
    avatar: googleUser.image,
  };
}

async function authenticateUser(email: string, password: string) {
  try {
    // Autenticación con el backend usando authService
    const loginResponse = await authService.login({ email, password });

    if (loginResponse.success && loginResponse.data !== undefined) {
      console.log('loginResponse', loginResponse);
      // Decodificar la información del token
      const userData: JWT | null = await validateUserFromToken(loginResponse.data);
      if (!userData) {
        throw new Error('Invalid token');
      }

      // Verificar si tenemos un objeto jwt en la respuesta
      if (userData) {
        return {
          id: userData.userId,
          email: userData.userEmail,
          name: userData.userName,
          role: userData.userTypeName,
          status: 'active' as const,
          department: 'Sin asignar',
          position: 'Usuario',
          avatar:
            userData.avatar ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${userData.userName}`,
          accessToken: loginResponse.data, // Token real del backend
        };
      }
      throw new Error('Error de autenticación. Verifique sus credenciales.');
    }
  } catch (error) {
    console.error('Backend authentication failed:', error);
    throw new Error('Error de autenticación. Verifique sus credenciales.');
  }

  return null;
}

/**
 * Función para validar usuario desde token JWT usando el servicio de usuarios
 */
async function validateUserFromToken(token: string): Promise<JWT | null> {
  try {
    if (!token || typeof token !== 'string') {
      console.error('[AUTH] Token vacío o no es string:', token);
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      // corrige la condición invertida
      console.error('[AUTH] Token inválido: formato incorrecto', {
        partsLength: parts.length,
        tokenPreview: token.slice(0, 60),
      });
      return null;
    }

    const payloadB64 = parts[1];

    const payloadJson = Buffer.from(
      payloadB64.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf-8');
    const payload = JSON.parse(payloadJson);

    const jwtData: JWT = {
      userId: payload.userId || payload.sub || '',
      userName: payload.userName || payload.name || '',
      userEmail: payload.userEmail || payload.email || '',
      userTypeId: payload.userTypeId || payload.role_id || '',
      userTypeName: payload.userTypeName || payload.role || 'employee',
      permission: payload.permission || payload.permissions || [],
      avatar: payload.avatar || payload.image || '',
    };

    return jwtData;
  } catch (error) {
    console.error('[AUTH] Error decodificando token:', error);
    console.error('[AUTH] Token que falló:', token);
    return null;
  }
}

/**
 * Configuración de NextAuth.js
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider para login con backend
    CredentialsProvider({
      id: 'credentials',
      name: 'Credenciales',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'usuario@empresa.com',
        },
        password: {
          label: 'Contraseña',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        try {
          // Usar la función authenticateUser local que incluye usuarios mock
          const user = await authenticateUser(credentials.email, credentials.password);

          if (user) {
            // Aseguramos que el rol sea uno de los tipos permitidos
            const validRole =
              user.role === 'admin' ||
              user.role === 'supervisor' ||
              user.role === 'employee' ||
              user.role === 'advisor'
                ? user.role
                : 'employee';

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: validRole,
              status: user.status,
              department: user.department,
              position: user.position,
              avatar: user.avatar,
              accessToken: user.accessToken,
            };
          }

          return null;
        } catch (error: any) {
          console.error('Error en login:', error);
          throw new Error(error.message || 'Error de autenticación');
        }
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      profile(profile) {
        console.log('Google profile:', profile);

        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role: 'employee',
          status: 'active',
          department: 'Sin asignar',
          position: 'Usuario',
          avatar: profile.picture,
        };
      },
    }),

    // Facebook OAuth - CONFIGURADO PERO INACTIVO (sin credenciales)
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            profile(profile) {
              console.log('Facebook profile:', profile);

              return {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                image: profile.picture?.data?.url,
                role: 'employee',
                status: 'active',
                department: 'Sin asignar',
                position: 'Usuario',
                avatar: profile.picture?.data?.url,
              };
            },
          }),
        ]
      : []),

    // Microsoft Azure AD OAuth - CONFIGURADO PERO INACTIVO (sin credenciales)
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            profile(profile) {
              console.log('Azure AD profile:', profile);

              return {
                id: profile.oid || profile.sub,
                email: profile.email || profile.upn,
                name: profile.name,
                image: null, // Azure AD no provee imagen por defecto
                role: 'employee',
                status: 'active',
                department: 'Sin asignar',
                position: 'Usuario',
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`,
              };
            },
          }),
        ]
      : []),

    // LinkedIn OAuth - CONFIGURADO PERO INACTIVO (sin credenciales)
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            profile(profile) {
              console.log('LinkedIn profile:', profile);

              return {
                id: profile.id,
                email: profile.email,
                name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
                image: null, // LinkedIn image será manejado por defecto
                role: 'employee',
                status: 'active',
                department: 'Sin asignar',
                position: 'Usuario',
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile.localizedFirstName}`,
              };
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hora
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Persistir datos del usuario en el token JWT
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.status = user.status;
        // Removemos campos opcionales para reducir el tamaño de la cookie
        // token.department = user.department;
        // token.position = user.position;
        // token.avatar = user.avatar;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Enviar propiedades al cliente desde el token JWT
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as 'admin' | 'supervisor' | 'employee' | 'advisor',
          status: token.status as 'active' | 'inactive' | 'suspended',
          // Campos opcionales removidos para reducir tamaño de cookie
          department: '',
          position: '',
          avatar: '',
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Permite redirecciones relativas o al mismo origen
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Permite redirecciones al mismo origen
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async signIn({ user, account, profile }) {
      // Permitir el sign in para todos los providers configurados
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Limpiar cookies problemáticas al iniciar sesión
      console.log('🧹 [AUTH] Limpiando cookies al iniciar sesión');
      // Las cookies se limpiarán automáticamente por NextAuth al crear nuevas
    },
    async signOut({ token, session }) {
      // Limpiar todas las cookies relacionadas con autenticación al cerrar sesión
      console.log('🧹 [AUTH] Limpiando cookies al cerrar sesión');
      // NextAuth limpiará automáticamente las cookies de sesión
    },
  },
  debug: process.env.NODE_ENV === 'development',

  // Configuración de cookies optimizada
  cookies: {
    sessionToken: {
      name: `auth.s`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hora
      },
    },
  },
};

export default authOptions;
