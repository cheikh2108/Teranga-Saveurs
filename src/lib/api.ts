import type { Dish, FullRestaurant, PublicRestaurant, RestaurantStats } from '../types/restaurant'
import { getSupabase } from './supabaseClient'

type SettingsRow = {
  id: number
  is_open: boolean
  hero_image_url: string
  whatsapp_e164: string
  site_visits: number
  last_visit_at: string | null
  admin_updates: number
  last_admin_update_at: string | null
}

type DishRow = {
  id: string
  name: string
  description: string
  price: number | string
  image_url: string
  is_active?: boolean
}

function mapDish(row: DishRow): Dish {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: typeof row.price === 'string' ? Number.parseFloat(row.price) : row.price,
    imageUrl: row.image_url,
    isActive: row.is_active ?? true, // Par défaut à true si la colonne n'existe pas encore
  }
}

function mapStats(s: SettingsRow): RestaurantStats {
  return {
    siteVisits: Number(s.site_visits),
    lastVisitAt: s.last_visit_at,
    adminUpdates: s.admin_updates,
    lastAdminUpdateAt: s.last_admin_update_at,
  }
}

export async function getAdminSession() {
  const { data, error } = await getSupabase().auth.getSession()
  if (error) throw new Error(error.message)
  return data.session
}

export async function loginAdmin(email: string, password: string): Promise<void> {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message)
}

export async function logoutAdmin(): Promise<void> {
  await getSupabase().auth.signOut()
}

export async function fetchPublicRestaurant(): Promise<PublicRestaurant> {
  const sb = getSupabase()
  const [{ data: s, error: es }, { data: dishRows, error: ed }] = await Promise.all([
    sb.from('restaurant_settings').select('is_open, hero_image_url, whatsapp_e164').eq('id', 1).maybeSingle(),
    sb.from('dishes').select('id, name, description, price, image_url, is_active').order('id', { ascending: true }),
  ])
  if (es) throw new Error(es.message)
  if (ed) throw new Error(ed.message)
  if (!s) throw new Error('Configuration restaurant introuvable (Supabase).')
  
  // On filtre pour ne garder que les plats actifs en public
  const allDishes = (dishRows ?? []).map((r) => mapDish(r as DishRow))
  const publicDishes = allDishes.filter((d) => d.isActive !== false)

  return {
    isOpen: s.is_open,
    heroImageUrl: s.hero_image_url,
    whatsappE164: s.whatsapp_e164,
    dishes: publicDishes,
  }
}

export async function trackVisit(): Promise<void> {
  try {
    const { error } = await getSupabase().rpc('increment_site_visits')
    if (error) console.warn('trackVisit', error.message)
  } catch {
    /* ignore */
  }
}

export async function fetchAdminState(): Promise<FullRestaurant> {
  const session = await getAdminSession()
  if (!session) throw new Error('Non connecté')

  const sb = getSupabase()
  const [{ data: s, error: es }, { data: dishRows, error: ed }] = await Promise.all([
    sb.from('restaurant_settings').select('*').eq('id', 1).single(),
    sb.from('dishes').select('*').order('id', { ascending: true }),
  ])
  if (es) throw new Error(es.message)
  if (ed) throw new Error(ed.message)
  if (!s) throw new Error('Lecture impossible')

  const row = s as SettingsRow
  return {
    isOpen: row.is_open,
    heroImageUrl: row.hero_image_url,
    whatsappE164: row.whatsapp_e164,
    dishes: (dishRows ?? []).map((r) => mapDish(r as DishRow)),
    stats: mapStats(row),
  }
}

export async function saveAdminRestaurant(body: {
  isOpen?: boolean
  heroImageUrl?: string
  whatsappE164?: string
  dishes?: Dish[]
}): Promise<FullRestaurant> {
  const session = await getAdminSession()
  if (!session) throw new Error('Non connecté')

  const sb = getSupabase()
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof body.isOpen === 'boolean') patch.is_open = body.isOpen
  if (typeof body.heroImageUrl === 'string') patch.hero_image_url = body.heroImageUrl.trim()
  if (typeof body.whatsappE164 === 'string') patch.whatsapp_e164 = body.whatsappE164.replace(/\D/g, '')

  if (Object.keys(patch).length > 1) {
    const { error } = await sb.from('restaurant_settings').update(patch).eq('id', 1)
    if (error) throw new Error(error.message)
  }

  if (Array.isArray(body.dishes) && body.dishes.length >= 1) {
    for (const d of body.dishes) {
      if (d.id !== '1' && d.id !== '2') continue
      const { error } = await sb
        .from('dishes')
        .update({
          name: d.name.slice(0, 120),
          description: d.description.slice(0, 400),
          price: Math.max(0, d.price),
          image_url: d.imageUrl.trim(),
          is_active: d.isActive ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', d.id)
      if (error) throw new Error(error.message)
    }
  }

  const { error: rpcErr } = await sb.rpc('finish_admin_edit')
  if (rpcErr) throw new Error(rpcErr.message)

  return fetchAdminState()
}

export async function uploadAdminImage(
  file: File,
  target: '1' | '2' | 'hero',
): Promise<{ imageUrl: string; db: FullRestaurant }> {
  const session = await getAdminSession()
  if (!session) throw new Error('Non connecté')

  const sb = getSupabase()
  const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '')
  const safeExt = ext.length ? ext : 'jpg'
  const path = `${target}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`

  const { error: upErr } = await sb.storage.from('dish-images').upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: true,
  })
  if (upErr) throw new Error(upErr.message)

  const {
    data: { publicUrl },
  } = sb.storage.from('dish-images').getPublicUrl(path)

  if (target === 'hero') {
    const { error } = await sb
      .from('restaurant_settings')
      .update({ hero_image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', 1)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await sb
      .from('dishes')
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', target)
    if (error) throw new Error(error.message)
  }

  const { error: rpcErr } = await sb.rpc('finish_admin_edit')
  if (rpcErr) throw new Error(rpcErr.message)

  return { imageUrl: publicUrl, db: await fetchAdminState() }
}
