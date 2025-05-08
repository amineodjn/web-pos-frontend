import { ref, reactive, computed, watch } from 'vue'
import type { MenuItem } from '../types/MenuData'
import { useMenuStore } from '../stores/menuStore'
import { DEFAULT_FORM } from '../constants/menu'

export function useMenuItemForm(isProcessing: boolean) {
  const form = reactive({ ...DEFAULT_FORM })
  const ingredientsText = ref('')
  const meatsText = ref('')
  const saucesText = ref('')
  const sizesText = ref('Regular')
  const tagsText = ref('')

  const isFormValid = computed(() => {
    const price = parseFloat(form.price || '0')
    return Boolean(
      form.name?.trim() &&
        form.category_id &&
        !isNaN(price) &&
        price > 0 &&
        form.currency?.trim() &&
        form.description?.trim()
    )
  })

  function parseCommaSeparatedText(text: string): string[] {
    return text
      ? text
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
      : []
  }

  function resetForm() {
    Object.assign(form, DEFAULT_FORM)
    ingredientsText.value = ''
    meatsText.value = ''
    saucesText.value = ''
    sizesText.value = 'Regular'
    tagsText.value = ''
  }

  function initializeForm(item: MenuItem) {
    const category = getCategoryFromItem(item)
    const existingImageUrl = item.imageUrl || ''

    Object.assign(form, DEFAULT_FORM, {
      ...item,
      category_id: category,
      imageUrl: existingImageUrl,
      details: {
        ingredients: item.details?.ingredients || [],
        meats: item.details?.meats || [],
        sauces: item.details?.sauces || [],
        sizes: item.details?.sizes || [],
        tags: item.details?.tags || []
      }
    })

    ingredientsText.value = item.details?.ingredients?.join(', ') || ''
    meatsText.value = item.details?.meats?.join(', ') || ''
    saucesText.value = item.details?.sauces?.join(', ') || ''
    sizesText.value = item.details?.sizes?.join(', ') || 'Regular'
    tagsText.value = item.details?.tags?.join(', ') || ''
  }

  function getCategoryFromItem(item: MenuItem): string {
    if ((item as any).category) {
      return (item as any).category
    }

    const menuStore = useMenuStore()
    for (const category in menuStore.items) {
      if (menuStore.items[category].some((i: any) => i.id === item.id)) {
        return category
      }
    }
    return ''
  }

  function validatePrice(value: string | number): string {
    if (typeof value === 'number') {
      return value.toFixed(1)
    }
    const cleaned = String(value).replace(/[^\d.]/g, '')
    const floatValue = parseFloat(cleaned)
    return !isNaN(floatValue) ? floatValue.toFixed(2) : ''
  }

  function prepareFormData() {
    if (!isFormValid.value || isProcessing) return null

    const { price, ...rest } = form
    const validatedPrice = validatePrice(price)

    if (!validatedPrice) {
      return null
    }

    return {
      ...rest,
      price: Number(validatedPrice)
    }
  }

  // Watch all text fields
  watch(ingredientsText, newVal => {
    form.details.ingredients = parseCommaSeparatedText(newVal)
  })

  watch(meatsText, newVal => {
    form.details.meats = parseCommaSeparatedText(newVal)
  })

  watch(saucesText, newVal => {
    form.details.sauces = parseCommaSeparatedText(newVal)
  })

  watch(sizesText, newVal => {
    form.details.sizes = parseCommaSeparatedText(newVal)
  })

  watch(tagsText, newVal => {
    form.details.tags = parseCommaSeparatedText(newVal)
  })

  return {
    form,
    ingredientsText,
    meatsText,
    saucesText,
    sizesText,
    tagsText,
    isFormValid,
    resetForm,
    initializeForm,
    prepareFormData
  }
}
