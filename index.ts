export { corpusTextService } from './services/corpusTextService'

export type {
  CorpusText,
  CorpusTextFormData,
  PaginatedResponse as CorpusTextPaginatedResponse,
  SingleResponse as CorpusTextSingleResponse
} from './services/corpusTextService'

export { default as router } from './router/index'
export { TextMiningMenuBuilder, textMiningMenuBuilder } from './config/menuBuilder'
