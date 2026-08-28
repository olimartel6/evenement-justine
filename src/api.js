import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from './config'

const sb = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function acheterBillet(nom, courriel, type) {
  const { data, error } = await sb.rpc('evt_create_ticket',
    { p_name: nom, p_email: courriel, p_type: type })
  if (error) throw new Error(error.message)
  return data
}
export async function lireBillet(code) {
  const { data, error } = await sb.rpc('evt_get_ticket', { p_code: code })
  if (error) throw new Error(error.message)
  return data
}
export async function scannerBillet(code, pin, benevole) {
  const { data, error } = await sb.rpc('evt_scan_ticket',
    { p_code: code, p_pin: pin, p_staff: benevole })
  if (error) throw new Error(error.message)
  return data
}
export async function lireStats(pin) {
  const { data, error } = await sb.rpc('evt_stats', { p_pin: pin })
  if (error) throw new Error(error.message)
  return data
}
