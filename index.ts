export { corpusTextService } from './services/corpusTextService'
export { keywordService } from './services/keywordService'

export type {
  CorpusText,
  CorpusTextFormData,
  PaginatedResponse as CorpusTextPaginatedResponse,
  SingleResponse as CorpusTextSingleResponse
} from './services/corpusTextService'

export type {
  Keyword,
  KeywordFormData,
  KeywordOption,
  PaginatedResponse as KeywordPaginatedResponse,
  SingleResponse as KeywordSingleResponse
} from './services/keywordService'

export { default as router } from './router/index'
export { TextMiningMenuBuilder, textMiningMenuBuilder } from './config/menuBuilder'
