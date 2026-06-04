import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface KeywordOption {
  id: number
  name: string
}

export interface Keyword {
  id: number
  name: string
  is_stop_word: boolean
  alias_keyword_id: number | null
  alias_keyword?: KeywordOption | null
}

export interface KeywordFormData {
  name: string
  is_stop_word: boolean
  alias_keyword_id: number | null
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters?: {
    search?: string
    sort?: string
    direction?: string
  }
}

export interface SingleResponse<T> {
  data: T
}

export interface KeywordCreateEditResponse {
  data?: Keyword
  alias_keywords: KeywordOption[]
}

export const keywordService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number; per_page?: number }) {
    return api.get<PaginatedResponse<Keyword>>('/api/admin/text-mining/keywords', { params })
  },

  getById(id: number | string) {
    return api.get<SingleResponse<Keyword>>(`/api/admin/text-mining/keywords/${id}`)
  },

  getCreateData() {
    return api.get<KeywordCreateEditResponse>('/api/admin/text-mining/keywords/create')
  },

  getEditData(id: number | string) {
    return api.get<KeywordCreateEditResponse>(`/api/admin/text-mining/keywords/${id}/edit`)
  },

  create(data: KeywordFormData) {
    return api.post<SingleResponse<Keyword>>('/api/admin/text-mining/keywords', data)
  },

  update(id: number | string, data: KeywordFormData) {
    return api.put<SingleResponse<Keyword>>(`/api/admin/text-mining/keywords/${id}`, data)
  },

  delete(id: number | string) {
    return api.delete(`/api/admin/text-mining/keywords/${id}`)
  },
}
