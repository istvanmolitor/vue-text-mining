<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, InputError, LoadingSpinner, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Select from '@admin/components/ui/Select.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { keywordService, type KeywordFormData, type KeywordOption } from '../../services/keywordService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})
const aliasOptions = ref<KeywordOption[]>([])

const form = reactive<KeywordFormData>({
  name: '',
  is_stop_word: false,
  alias_keyword_id: null,
})

const fetchKeyword = async () => {
  const id = route.params.id as string

  try {
    isLoading.value = true
    const { data } = await keywordService.getEditData(id)

    if (data.data) {
      form.name = data.data.name
      form.is_stop_word = data.data.is_stop_word
      form.alias_keyword_id = data.data.alias_keyword_id
    }

    aliasOptions.value = data.alias_keywords ?? []
  } catch (error) {
    console.error('Hiba a kulcsszo betoltesekor:', error)
    await router.push('/admin/text-mining/keyword')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string

  try {
    isSaving.value = true
    errors.value = {}
    await keywordService.update(id, form)
    toastService.success('Kulcsszo sikeresen frissitve!')
    await router.push('/admin/text-mining/keyword')
  } catch (error: any) {
    console.error('Hiba a kulcsszo frissitesekor:', error)
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
  fetchKeyword()
})
</script>

<template>
  <AdminLayout page-title="Keyword szerkesztese">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/text-mining/keyword" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betoltes..." />
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Keyword adatok</CardTitle>
        <CardDescription>Modositsd a keyword adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Kulcsszo" v-model="form.name" placeholder="pelda" :errors="errors.name" />

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
