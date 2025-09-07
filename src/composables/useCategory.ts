import { ref } from 'vue'
import type { MenuItem } from '../types/MenuData'
import { useToast } from './useToast'
import { useTranslate } from './useTranslate'

type Category = {
  categoryId: string
  categoryName: string
  categoryItems?: MenuItem[]
}

type MenuStore = {
  categories: Category[]
  addCategory: (name: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  deleteMenuItem: (categoryId: string, itemId: string) => Promise<void>
}

export function useCategory(menuStore: MenuStore) {
  const isProcessing = ref(false)
  const toast = useToast()
  const { translate: translateAdminView } = useTranslate('menuView')
  const { translate: translateConfirmations } = useTranslate(
    'menuView.confirmations'
  )

  const showConfirmation = ref(false)
  const confirmationTitle = ref('Confirm Action')
  const confirmationMessage = ref('')
  const confirmationResolve = ref<((value: boolean) => void) | null>(null)

  function showConfirmationDialog(
    title: string,
    message: string
  ): Promise<boolean> {
    confirmationTitle.value = title
    confirmationMessage.value = message
    showConfirmation.value = true

    return new Promise(resolve => {
      confirmationResolve.value = resolve
    })
  }

  async function addCategory(categoryName: string) {
    if (categoryName && !isProcessing.value) {
      try {
        isProcessing.value = true
        await menuStore.addCategory(categoryName)
        toast.success(
          translateAdminView('toast.success.addCategory', {
            name: categoryName
          })
        )
      } catch (err) {
        console.error('Failed to add category:', err)
        toast.error(
          translateAdminView('toast.error.addCategory', {
            message: err instanceof Error ? err.message : 'Unknown error'
          })
        )
      } finally {
        isProcessing.value = false
      }
    }
  }

  function getCategoryIdForItem(item: MenuItem): string {
    const category = menuStore.categories.find(cat =>
      cat.categoryItems?.some(i => i.id === item.id)
    )
    return category?.categoryId || ''
  }

  function getCategoryNameForItem(item: MenuItem): string {
    const category = menuStore.categories.find(cat =>
      cat.categoryItems?.some(i => i.id === item.id)
    )
    return category?.categoryName || ''
  }

  function handleConfirmation(confirmed: boolean) {
    showConfirmation.value = false
    if (confirmationResolve.value) {
      confirmationResolve.value(confirmed)
      confirmationResolve.value = null
    }
  }

  async function confirmDeleteCategory(category: Category) {
    const confirmed = await showConfirmationDialog(
      translateConfirmations('deleteCategory.title'),
      translateConfirmations('deleteCategory.message', {
        name: category.categoryName
      })
    )

    if (confirmed) {
      try {
        isProcessing.value = true
        await menuStore.deleteCategory(category.categoryId)
        toast.success(translateAdminView('toast.success.deleteCategory'))
      } catch (err) {
        toast.error(
          translateAdminView('toast.error.deleteCategory', {
            message: err instanceof Error ? err.message : 'Unknown error'
          })
        )
      } finally {
        isProcessing.value = false
      }
    }
  }

  async function confirmDeleteItem(item: MenuItem) {
    const categoryId = getCategoryIdForItem(item)
    const confirmed = await showConfirmationDialog(
      translateConfirmations('deleteItem.title'),
      translateConfirmations('deleteItem.message', {
        name: item.name
      })
    )

    if (confirmed) {
      try {
        isProcessing.value = true
        await menuStore.deleteMenuItem(categoryId, item.id)
        toast.success(translateAdminView('toast.success.deleteItem'))
      } catch (err) {
        toast.error(
          translateAdminView('toast.error.generic', {
            message: err instanceof Error ? err.message : 'Unknown error'
          })
        )
      } finally {
        isProcessing.value = false
      }
    }
  }

  return {
    isProcessing,
    showConfirmation,
    confirmationTitle,
    confirmationMessage,
    addCategory,
    getCategoryNameForItem,
    handleConfirmation,
    confirmDeleteCategory,
    confirmDeleteItem
  }
}
