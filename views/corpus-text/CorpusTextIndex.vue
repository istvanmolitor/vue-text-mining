<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { corpusTextService, type CorpusText } from '../../services/corpusTextService'

const router = useRouter()
const corpusTexts = ref<CorpusText[]>([])
const isLoading = ref(false)

const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<CorpusText>[] = [
  { key: 'name', label: 'Nev', sortable: true },
  { key: 'is_updated', label: 'Frissitve', sortable: true, width: '120px' },
  { key: 'text', label: 'Szoveg', sortable: false },
]

const fetchCorpusTexts = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await corpusTextService.getAll(params)
    corpusTexts.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a corpus text elemek betoltesekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteCorpusText = async (id: number) => {
  try {
    await corpusTextService.delete(id)
    toastService.success('A corpus text sikeresen torolve!')
    await fetchCorpusTexts({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a corpus text torlesekor:', error)
    toastService.error('Hiba tortent a torles soran.')
  }
}

const editCorpusText = (id: number) => {
  router.push(`/admin/text-mining/corpus-text/${id}/edit`)
}

onMounted(() => {
  fetchCorpusTexts({ page: 1, sort: 'id', direction: 'desc' })
})
</script>

<template>
  <AdminLayout page-title="CorpusText elemek">
    <DataTable
      :columns="columns"
      :data="corpusTexts"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Kereses nev vagy szoveg alapjan..."
      default-sort="id"
      default-direction="desc"
      @fetch="fetchCorpusTexts"
    >
      <template #actions>
        <CreateButton to="/admin/text-mining/corpus-text/create">Uj CorpusText</CreateButton>
      </template>

      <template #cell-text="{ row }">
        <span class="block max-w-xl truncate" :title="row.text">{{ row.text }}</span>
      </template>

      <template #cell-is_updated="{ row }">
        <span>{{ row.is_updated ? 'Igen' : 'Nem' }}</span>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editCorpusText(row.id)" />
        <DeleteButton @confirm="deleteCorpusText(row.id)" />
      </template>

      <template #empty>
        Nincs megjelenitheto corpus text.
      </template>
    </DataTable>
  </AdminLayout>
</template>
