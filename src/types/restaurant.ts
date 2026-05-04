export type Dish = {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  isActive?: boolean
}

export type RestaurantStats = {
  siteVisits: number
  lastVisitAt: string | null
  adminUpdates: number
  lastAdminUpdateAt: string | null
}

export type PublicRestaurant = {
  isOpen: boolean
  heroImageUrl: string
  whatsappE164: string
  dishes: Dish[]
}

export type FullRestaurant = PublicRestaurant & {
  stats: RestaurantStats
}
