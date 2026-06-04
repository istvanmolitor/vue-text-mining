<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { keywordService, type Keyword } from '../../services/keywordService'

const router = useRouter()
const keywords = ref<Keyword[]>([])
const isLoading = ref(false)

const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<Keyword>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Kulcsszo', sortable: true },
  { key: 'alias_keyword', label: 'Alias', sortable: false },
  { key: 'is_stop_word', label: 'Stop szo', sortable: true, width: '120px' },
]

const fetchKeywords = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await keywordService.getAll(params)
    keywords.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a kulcsszavak betoltesekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteKeyword = async (id: number) => {
  try {
    await keywordService.delete(id)
    toastService.success('A kulcsszo sikeresen torolve!')
    await fetchKeywords({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a kulcsszo torlesekor:', error)
    toastService.error('Hiba tortent a torles soran.')
  }
}

const editKeyword = (id: number) => {
  router.push(`/admin/text-mining/keyword/${id}/edit`)
}

onMounted(() => {
  fetchKeywords({ page: 1, sort: 'name', direction: 'asc' })
})
</script>

<template>
  <AdminLayout page-title="Kulcsszavak">
    <DataTable
      :columns="columns"
      :data="keywords"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Kereses kulcsszo alapjan..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchKeywords"
    >
      <template #actions>
        <CreateButton to="/admin/text-mining/keyword/create">Uj Keyword</CreateButton>
      </template>

      <template #cell-alias_keyword="{ row }">
        <span>{{ row.alias_keyword?.name ?? '-' }}</span>
      </template>

      <template #cell-is_stop_word="{ row }">
        <span
          v-if="row.is_stop_word"
          class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
        >
          Igen
        </span>
        <span
          v-else
          class="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
        >
          Nem
        </span>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editKeyword(row.id)" />
        <DeleteButton @confirm="deleteKeyword(row.id)" />
      </template>

      <template #empty>
        Nincs megjelenitheto kulcsszo.
      </template>
    </DataTable>
  </AdminLayout>
</template>
