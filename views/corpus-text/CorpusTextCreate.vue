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
import { useRouter } from 'vue-router'
import { corpusTextService, type CorpusTextFormData } from '../../services/corpusTextService'

const router = useRouter()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})

const form = reactive<CorpusTextFormData>({
  name: '',
  text: '',
})

const fetchCreateData = async () => {
  try {
    isLoading.value = true
    await corpusTextService.getCreateData()
  } catch (error) {
    console.error('Hiba a letrehozas elokeszitese kozben:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const response: any = await corpusTextService.create(form)
    toastService.success('CorpusText sikeresen letrehozva!')

    const createdId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdId !== undefined && createdId !== null) {
      await router.push({
        name: 'text-mining-corpus-text-edit',
        params: {
          id: String(createdId),
        },
      })
      return
    }

    await router.push('/admin/text-mining/corpus-text')
  } catch (error: any) {
    console.error('Hiba a corpus text letrehozasakor:', error)
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
  <AdminLayout page-title="Uj CorpusText">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/text-mining/corpus-text" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betoltes..." />
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>CorpusText adatok</CardTitle>
        <CardDescription>Add meg az uj corpus text adatait.</CardDescription>
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
