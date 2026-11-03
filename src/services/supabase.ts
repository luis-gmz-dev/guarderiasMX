import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = Boolean(url && key)

export const supabase = createClient(
  url || 'https://example.supabase.co',
  key || 'missing-publishable-key',
)

export function exigirSupabase(): void {
  if (!supabaseConfigured) {
    throw new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.')
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  exigirSupabase()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  if (!supabaseConfigured) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function esAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.rol === 'admin'
}
