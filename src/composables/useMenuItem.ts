import { ref } from 'vue'
import type { MenuItem, MenuItemDetails } from '../types/MenuData'
import type { ItemFormData } from '../types/menu'
import {
  DEFAULT_DETAILS,
  DEFAULT_CURRENCY,
  DEFAULT_AVAILABLE,
  DEFAULT_IMAGE_URL
} from '../constants/menu'
import { useToast } from './useToast'
import { useTranslate } from './useTranslate'
import config from '../config/api.config'

export function useMenuItem(menuStore: any) {
  const isProcessing = ref(false)
  const formError = ref('')
  const itemToEdit = ref<MenuItem | null>(null)
  const showAddItemModal = ref(false)
  const toast = useToast()
  const { translate: translateAdminView } = useTranslate('menuView')

  function formatItemDetails(
    details?: Partial<MenuItemDetails>
  ): MenuItemDetails {
    if (!details) return DEFAULT_DETAILS

    return {
      ingredients:
        Array.isArray(details.ingredients) && details.ingredients.length > 0
          ? details.ingredients
          : DEFAULT_DETAILS.ingredients,
      meats:
        Array.isArray(details.meats) && details.meats.length > 0
          ? details.meats
          : DEFAULT_DETAILS.meats,
      sauces:
        Array.isArray(details.sauces) && details.sauces.length > 0
          ? details.sauces
          : DEFAULT_DETAILS.sauces,
      sizes:
        Array.isArray(details.sizes) && details.sizes.length > 0
          ? details.sizes
          : DEFAULT_DETAILS.sizes,
      tags:
        Array.isArray(details.tags) && details.tags.length > 0
          ? details.tags
          : DEFAULT_DETAILS.tags
    }
  }

  function handleError(error: unknown, context: string): string {
    console.error(`Error in ${context}:`, error)
    return error instanceof Error ? error.message : 'Unknown error'
  }

  function editItem(item: MenuItem) {
    itemToEdit.value = item
    showAddItemModal.value = true
    formError.value = ''
  }

  function cancelItemEdit() {
    if (isProcessing.value) return
    itemToEdit.value = null
    showAddItemModal.value = false
    formError.value = ''
  }

  async function handleItemSave(itemData: ItemFormData) {
    if (isProcessing.value) return

    try {
      isProcessing.value = true
      formError.value = ''

      if (itemToEdit.value) {
        await handleItemUpdate(itemData)
      } else {
        await handleItemCreation(itemData)
      }

      cancelItemEdit()
    } catch (err) {
      const errorMessage = handleError(err, 'save item')
      formError.value = errorMessage

      const toastMessage = itemToEdit.value
        ? translateAdminView('toast.error.updateItem', {
            message: errorMessage
          })
        : translateAdminView('toast.error.addItem', { message: errorMessage })

      toast.error(toastMessage)
    } finally {
      isProcessing.value = false
    }
  }

  async function handleItemUpdate(itemData: ItemFormData) {
    if (!itemToEdit.value?.id) {
      throw new Error('No item selected for update')
    }

    const currentCategory = menuStore.categories.find((cat: any) =>
      cat.categoryItems?.some((i: any) => i.id === itemToEdit.value?.id)
    )

    if (!currentCategory) {
      throw new Error('Category not found for the item')
    }

    const itemExists = currentCategory.categoryItems?.some(
      (item: MenuItem) => item.id === itemToEdit.value?.id
    )

    if (!itemExists) {
      throw new Error('Item not found in the current category')
    }

    try {
      if (currentCategory.categoryId !== itemData.category_id) {
        await handleCategoryChange(itemData, currentCategory.categoryId)
        return
      }

      const updatedItem = createMenuItemObject(
        itemData,
        currentCategory.categoryId
      )
      await menuStore.updateMenuItem(currentCategory.categoryId, updatedItem)
      toast.success(translateAdminView('toast.success.updateItem'))
    } catch (error) {
      console.error('Error updating menu item:', error)
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to update menu item. Please try again.'
      )
    }
  }

  async function handleCategoryChange(
    itemData: ItemFormData,
    oldCategoryId: string
  ) {
    if (!itemToEdit.value?.id) {
      throw new Error('No item selected for category change')
    }

    try {
      await menuStore.deleteMenuItem(oldCategoryId, itemToEdit.value.id)

      const newItem = {
        ...itemData,
        details: formatItemDetails(itemData.details),
        available: itemData.available ?? DEFAULT_AVAILABLE,
        currency: itemData.currency ?? DEFAULT_CURRENCY,
        imageUrl: itemData.imageUrl ?? DEFAULT_IMAGE_URL
      }

      await menuStore.addMenuItem(itemData.category_id, newItem)
      toast.success(translateAdminView('toast.success.updateItem'))
    } catch (error) {
      console.error('Error changing item category:', error)
      try {
        const originalItem = createMenuItemObject(itemData, oldCategoryId)
        await menuStore.addMenuItem(oldCategoryId, originalItem)
      } catch (restoreError) {
        console.error(
          'Failed to restore item after category change error:',
          restoreError
        )
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to change item category. Please try again.'
      )
    }
  }

  async function handleItemCreation(itemData: ItemFormData) {
    const newItem = {
      ...itemData,
      details: formatItemDetails(itemData.details),
      available: itemData.available ?? DEFAULT_AVAILABLE,
      currency: itemData.currency ?? DEFAULT_CURRENCY,
      imageUrl: itemData.imageUrl ?? DEFAULT_IMAGE_URL
    }

    await menuStore.addMenuItem(itemData.category_id, newItem)
    toast.success(translateAdminView('toast.success.addItem'))
  }

  function createMenuItemObject(
    itemData: ItemFormData,
    categoryId: string
  ): MenuItem {
    return {
      ...itemData,
      id: itemToEdit.value?.id || '',
      itemNumber: 0,
      category_id: categoryId,
      organization_id: config.defaultParams.organization_id,
      details: formatItemDetails(itemData.details),
      available: itemData.available ?? DEFAULT_AVAILABLE,
      currency: itemData.currency ?? DEFAULT_CURRENCY,
      imageUrl: itemData.imageUrl ?? DEFAULT_IMAGE_URL
    }
  }

  return {
    isProcessing,
    formError,
    itemToEdit,
    showAddItemModal,
    editItem,
    cancelItemEdit,
    handleItemSave
  }
}
