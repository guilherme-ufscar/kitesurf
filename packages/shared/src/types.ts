import {
  Condition,
  ListingStatus,
  Modality,
  SubscriptionPlan,
  VerificationLevel,
} from './enums'

export interface UserPublic {
  id: string
  name: string
  avatarUrl: string | null
  reputationScore: number
  verificationLevel: VerificationLevel
  totalSales: number
  city: string
  state: string
  createdAt: string
}

export interface ListingCard {
  id: string
  title: string
  slug: string
  price: number
  currency: string
  condition: Condition
  modality: Modality
  status: ListingStatus
  city: string
  state: string
  coverImageUrl: string | null
  isFeatured: boolean
  viewsCount: number
  favoritesCount: number
  createdAt: string
  seller: Pick<UserPublic, 'id' | 'name' | 'avatarUrl' | 'verificationLevel'>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}
