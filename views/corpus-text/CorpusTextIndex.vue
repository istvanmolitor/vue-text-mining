<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { corpusTextService } from '../../services/corpusTextService'

const router = useRouter()
const table = ref()

const deleteCorpusText = async (id: number) => {
  try {
    await corpusTextService.delete(id)
    toastService.success('A corpus text sikeresen torolve!')
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a corpus text torlesekor:', error)
    toastService.error('Hiba tortent a torles soran.')
  }
}

const editCorpusText = (id: number) => {
  router.push(`/admin/text-mining/corpus-text/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="CorpusText elemek">
    <DataTable
      ref="table"
      url="/api/admin/text-mining/corpus-texts"
    >
      <template #actions>
        <CreateButton to="/admin/text-mining/corpus-text/create">Uj CorpusText</CreateButton>
      </template>

      <template #cell-text="{ row }">
        <span class="block max-w-xl truncate" :title="(row as any).text">{{ (row as any).text }}</span>
      </template>

      <template #cell-is_updated="{ row }">
        <span>{{ (row as any).is_updated ? 'Igen' : 'Nem' }}</span>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editCorpusText((row as any).id)" />
        <DeleteButton @confirm="deleteCorpusText((row as any).id)" />
      </template>

      <template #empty>
        Nincs megjelenitheto corpus text.
      </template>
    </DataTable>
  </AdminLayout>
</template>
