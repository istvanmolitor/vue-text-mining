import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface CorpusText {
  id: number
  name: string
  text: string
  is_updated: boolean
  tokens: string
  created_at?: string | null
  updated_at?: string | null
}

export interface CorpusTextFormData {
  name: string
  text: string
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
  columns?: Array<{ key: string; label: string; sortable: boolean }>
}

export interface SingleResponse<T> {
  data: T
}

export const corpusTextService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number; per_page?: number }) {
    return api.get<PaginatedResponse<CorpusText>>('/api/admin/text-mining/corpus-texts', { params })
  },

  getById(id: number | string) {
    return api.get<SingleResponse<CorpusText>>(`/api/admin/text-mining/corpus-texts/${id}`)
  },

  getCreateData() {
    return api.get('/api/admin/text-mining/corpus-texts/create')
  },

  getEditData(id: number | string) {
    return api.get<SingleResponse<CorpusText>>(`/api/admin/text-mining/corpus-texts/${id}/edit`)
  },

  create(data: CorpusTextFormData) {
    return api.post<SingleResponse<CorpusText>>('/api/admin/text-mining/corpus-texts', data)
  },

  update(id: number | string, data: CorpusTextFormData) {
    return api.put<SingleResponse<CorpusText>>(`/api/admin/text-mining/corpus-texts/${id}`, data)
  },

  delete(id: number | string) {
    return api.delete(`/api/admin/text-mining/corpus-texts/${id}`)
  },
}
