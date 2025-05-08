import { ref } from 'vue'
import type { MenuItem } from '../types/MenuData'
import { useToast } from './useToast'
import { useTranslate } from './useTranslate'

export function useCategory(menuStore: any) {
  const isProcessing = ref(false)
  const toast = useToast()
  const { translate: translateAdminView } = useTranslate('menuView')
  const { translate: translateConfirmations } = useTranslate(
    'menuView.confirmations'
  )

  const showConfirmation = ref(false)
  const confirmationTitle = ref('Confirm Action')
  const confirmationMessage = ref('')
  const pendingAction = ref<() => Promise<void>>(() => Promise.resolve())

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
    const category = menuStore.categories.find((cat: any) =>
      cat.categoryItems?.some((i: any) => i.id === item.id)
    )
    return category?.categoryId || ''
  }

  function getCategoryNameForItem(item: MenuItem): string {
    const category = menuStore.categories.find((cat: any) =>
      cat.categoryItems?.some((i: any) => i.id === item.id)
    )
    return category?.categoryName || ''
  }

  function isCategoryDeletion(): boolean {
    return (
      confirmationTitle.value === translateConfirmations('deleteCategory.title')
    )
  }

  async function confirmAction() {
    if (isProcessing.value) return

    try {
      isProcessing.value = true
      await pendingAction.value()
      showConfirmation.value = false

      if (isCategoryDeletion()) {
        toast.success(translateAdminView('toast.success.deleteCategory'))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'

      if (isCategoryDeletion()) {
        toast.error(
          translateAdminView('toast.error.deleteCategory', {
            message: errorMessage
          })
        )
      } else {
        toast.error(
          translateAdminView('toast.error.generic', { message: errorMessage })
        )
      }
    } finally {
      isProcessing.value = false
    }
  }

  function confirmDeleteCategory(category: any) {
    confirmationTitle.value = translateConfirmations('deleteCategory.title')
    confirmationMessage.value = translateConfirmations(
      'deleteCategory.message',
      {
        name: category.categoryName
      }
    )
    pendingAction.value = () => menuStore.deleteCategory(category.categoryId)
    showConfirmation.value = true
  }

  function confirmDeleteItem(item: MenuItem) {
    const categoryId = getCategoryIdForItem(item)
    confirmationTitle.value = translateConfirmations('deleteItem.title')
    confirmationMessage.value = translateConfirmations('deleteItem.message', {
      name: item.name
    })
    pendingAction.value = async () => {
      await menuStore.deleteMenuItem(categoryId, item.id)
      toast.success(translateAdminView('toast.success.deleteItem'))
    }
    showConfirmation.value = true
  }

  return {
    isProcessing,
    showConfirmation,
    confirmationTitle,
    confirmationMessage,
    addCategory,
    getCategoryNameForItem,
    confirmAction,
    confirmDeleteCategory,
    confirmDeleteItem
  }
}
