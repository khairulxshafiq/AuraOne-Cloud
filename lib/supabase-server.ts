import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';

/**
 * Creates a server-side Supabase client for Next.js Route Handlers using cookies and authorization headers.
 * Never uses or exposes the service-role key.
 */
export function createRouteHandlerSupabaseClient(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Konfigurasi Supabase tidak lengkap pada pelayan.');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {
        // Read-only session inspection for chat route
      },
    },
  });
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

/**
 * Authenticates an incoming Next.js request server-side.
 * Rejects with null if missing or invalid.
 */
export async function authenticateChatRequest(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const supabase = createRouteHandlerSupabaseClient(req);

    // Support both Bearer authorization header and cookie-based sessions
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  } catch {
    return null;
  }
}

