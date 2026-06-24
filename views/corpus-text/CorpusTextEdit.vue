<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, InputError, LoadingSpinner, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { corpusTextService, type CorpusTextFormData } from '../../services/corpusTextService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})

const form = reactive<CorpusTextFormData>({
  name: '',
  text: '',
})

const fetchCorpusText = async () => {
  const id = route.params.id as string

  try {
    isLoading.value = true
    const { data } = await corpusTextService.getEditData(id)
    form.name = data.data.name
    form.text = data.data.text
  } catch (error) {
    console.error('Hiba a corpus text betoltesekor:', error)
    await router.push('/admin/text-mining/corpus-text')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string

  try {
    isSaving.value = true
    errors.value = {}
    await corpusTextService.update(id, form)
    toastService.success('CorpusText sikeresen frissitve!')
    await router.push('/admin/text-mining/corpus-text')
  } catch (error: any) {
    console.error('Hiba a corpus text frissitesekor:', error)
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
  fetchCorpusText()
})
</script>

<template>
  <AdminLayout page-title="CorpusText szerkesztese">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/text-mining/corpus-text" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betoltes..." />
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>CorpusText adatok</CardTitle>
        <CardDescription>Modositsd a corpus text adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Nev" v-model="form.name" placeholder="Pelda corpus" :errors="errors.name" />

        <div class="space-y-2">
          <Label for="text">Szoveg</Label>
          <Textarea id="text" v-model="form.text" class="min-h-[180px]" />
          <InputError :message="errors.text" />
        </div>
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/text-mining/corpus-text')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
