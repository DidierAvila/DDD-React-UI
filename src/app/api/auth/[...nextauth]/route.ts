/**
 * NextAuth.js API Route Handler
 * SignoSST Web Frontend - Next.js TypeScript
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
