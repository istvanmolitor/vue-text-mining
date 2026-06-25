import type { RouteRecordRaw } from 'vue-router'

const textMiningRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/text-mining/corpus-text',
    name: 'text-mining-corpus-texts',
    component: () => import('../views/corpus-text/CorpusTextIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/text-mining/corpus-text/create',
    name: 'text-mining-corpus-text-create',
    component: () => import('../views/corpus-text/CorpusTextCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/text-mining/corpus-text/:id/edit',
    name: 'text-mining-corpus-text-edit',
    component: () => import('../views/corpus-text/CorpusTextEdit.vue'),
    meta: { requiresAuth: true }
  },
]

export default textMiningRoutes
