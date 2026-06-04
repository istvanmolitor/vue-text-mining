<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, InputError, LoadingSpinner, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Input from '@admin/components/ui/Input.vue'
import Label from '@admin/components/ui/Label.vue'
import Select from '@admin/components/ui/Select.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { keywordService, type KeywordFormData, type KeywordOption } from '../../services/keywordService'

const router = useRouter()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})
const aliasOptions = ref<KeywordOption[]>([])

const form = reactive<KeywordFormData>({
  name: '',
  is_stop_word: false,
  alias_keyword_id: null,
})

const fetchCreateData = async () => {
  try {
    isLoading.value = true
    const { data } = await keywordService.getCreateData()
    aliasOptions.value = data.alias_keywords ?? []
  } catch (error) {
    console.error('Hiba a create adatok betoltesekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const response: any = await keywordService.create(form)
    toastService.success('Kulcsszo sikeresen letrehozva!')

    const createdId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdId !== undefined && createdId !== null) {
      await router.push({
        name: 'text-mining-keyword-edit',
        params: {
          id: String(createdId),
        },
      })
      return
    }

    await router.push('/admin/text-mining/keyword')
  } catch (error: any) {
    console.error('Hiba a kulcsszo letrehozasakor:', error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      toastService.error('Kerd lek a hibak javitasat.')
    } else {
      toastService.error('Hiba tortent a mentes soran.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchCreateData()
})
</script>

<template>
  <AdminLayout page-title="Uj Keyword">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/text-mining/keyword" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betoltes..." />
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Keyword adatok</CardTitle>
        <CardDescription>Add meg az uj keyword adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Kulcsszo</Label>
          <Input id="name" v-model="form.name" placeholder="pelda" />
          <InputError :message="errors.name" />
        </div>

        <div class="space-y-2">
          <Label for="alias_keyword_id">Alias keyword</Label>
          <Select
            id="alias_keyword_id"
            v-model="form.alias_keyword_id"
            :options="aliasOptions"
            label-field="name"
            value-field="id"
            placeholder="Nincs alias"
            clearable
          />
          <InputError :message="errors.alias_keyword_id" />
        </div>

        <div class="flex items-center gap-2">
          <Checkbox v-model="form.is_stop_word" />
          <Label>Stop szo</Label>
        </div>
        <InputError :message="errors.is_stop_word" />
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/text-mining/keyword')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
