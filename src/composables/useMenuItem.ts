import { ref, type Ref } from 'vue';
import type { MenuItem, MenuItemDetails } from '../types/MenuData';
import type { ItemFormData } from '../types/menu';
import {
  DEFAULT_DETAILS,
  DEFAULT_CURRENCY,
  DEFAULT_AVAILABLE,
  DEFAULT_IMAGE_URL,
} from '../constants/menu';
import { useToast } from './useToast';
import { useTranslate } from './useTranslate';
import config from '../config/api.config';
import { useMenuStore } from '../stores/menuStore';

export const useMenuItem = (): {
  isProcessing: Ref<boolean>;
  formError: Ref<string>;
  currentItem: Ref<MenuItem | null>;
  showAddItemModal: Ref<boolean>;
  handleEditItem: (item: MenuItem) => void;
  handleCancelItemEdit: () => void;
  handleItemSave: (itemData: ItemFormData) => Promise<void>;
  handleItemCreation: (itemData: ItemFormData) => Promise<void>;
  handleCreateMenuItemObject: (itemData: ItemFormData, categoryId: string) => MenuItem;
} => {
  const menuStore = useMenuStore();
  const { success: showSuccess, error: showError } = useToast();
  const isProcessing = ref(false);
  const formError = ref('');
  const currentItem = ref<MenuItem | null>(null);
  const showAddItemModal = ref(false);
  const { translate: translateAdminView } = useTranslate('menuView');

  const handleFormatItemDetails = (item: MenuItem | ItemFormData): MenuItemDetails => {
    if (!item.details) return DEFAULT_DETAILS;

    return {
      ingredients: Array.isArray(item.details.ingredients) ? item.details.ingredients : [],
      meats: Array.isArray(item.details.meats) ? item.details.meats : [],
      sauces: Array.isArray(item.details.sauces) ? item.details.sauces : [],
      sizes: Array.isArray(item.details.sizes) ? item.details.sizes : [],
      tags: Array.isArray(item.details.tags) ? item.details.tags : [],
    };
  };

  const handleError = (error: Error): string => {
    return error.message;
  };

  const handleEditItem = (item: MenuItem): void => {
    currentItem.value = item;
    showAddItemModal.value = true;
    formError.value = '';
  };

  const handleCancelItemEdit = (): void => {
    if (isProcessing.value) return;
    currentItem.value = null;
    showAddItemModal.value = false;
    formError.value = '';
  };

  const handleItemSave = async (itemData: ItemFormData): Promise<void> => {
    if (isProcessing.value) return;

    try {
      isProcessing.value = true;
      formError.value = '';

      if (currentItem.value) {
        await handleItemUpdate(itemData);
      } else {
        await handleItemCreation(itemData);
      }

      handleCancelItemEdit();
    } catch (err) {
      const errorMessage = handleError(err as Error);
      formError.value = errorMessage;

      const toastMessage = currentItem.value
        ? translateAdminView('toast.error.updateItem', {
            message: errorMessage,
          })
        : translateAdminView('toast.error.addItem', { message: errorMessage });

      showError(toastMessage);
    } finally {
      isProcessing.value = false;
    }
  };

  const handleItemUpdate = async (itemData: ItemFormData): Promise<void> => {
    if (!currentItem.value?.id) {
      throw new Error('No item selected for update');
    }

    const currentCategory = menuStore.categories.find(cat =>
      cat.categoryItems?.some(i => i.id === currentItem.value?.id)
    );

    if (!currentCategory) {
      throw new Error('Category not found for the item');
    }

    const itemExists = currentCategory.categoryItems?.some(
      item => item.id === currentItem.value?.id
    );

    if (!itemExists) {
      throw new Error('Item not found in the current category');
    }

    try {
      if (currentCategory.categoryId !== itemData.category_id) {
        await handleCategoryChange(itemData, currentCategory.categoryId);
        return;
      }

      const updatedItem = handleCreateMenuItemObject(itemData, currentCategory.categoryId);
      await menuStore.handleUpdateMenuItem(currentCategory.categoryId, updatedItem);
      showSuccess(translateAdminView('toast.success.updateItem'));
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update menu item. Please try again.'
      );
    }
  };

  const handleCategoryChange = async (
    itemData: ItemFormData,
    oldCategoryId: string
  ): Promise<void> => {
    if (!currentItem.value?.id) {
      throw new Error('No item selected for category change');
    }

    try {
      await menuStore.handleDeleteMenuItem(oldCategoryId, currentItem.value.id);

      const newItem = {
        ...itemData,
        details: handleFormatItemDetails(itemData),
        available: itemData.available ?? DEFAULT_AVAILABLE,
        currency: itemData.currency ?? DEFAULT_CURRENCY,
        imageUrl: itemData.imageUrl ?? DEFAULT_IMAGE_URL,
      };

      await menuStore.handleAddMenuItem(itemData.category_id, newItem);
      showSuccess(translateAdminView('toast.success.updateItem'));
    } catch (error) {
      console.error('Error changing item category:', error);
      try {
        const originalItem = handleCreateMenuItemObject(itemData, oldCategoryId);
        await menuStore.handleAddMenuItem(oldCategoryId, originalItem);
      } catch (restoreError) {
        console.error('Failed to restore item after category change error:', restoreError);
      }
      throw new Error(
        error instanceof Error ? error.message : 'Failed to change item category. Please try again.'
      );
    }
  };

  const handleItemCreation = async (itemData: ItemFormData): Promise<void> => {
    const newItem = {
      ...itemData,
      details: handleFormatItemDetails(itemData),
      available: itemData.available ?? DEFAULT_AVAILABLE,
      currency: itemData.currency ?? DEFAULT_CURRENCY,
      imageUrl: itemData.imageUrl ?? DEFAULT_IMAGE_URL,
    };

    await menuStore.handleAddMenuItem(itemData.category_id, newItem);
    showSuccess(translateAdminView('toast.success.addItem'));
  };

  const handleCreateMenuItemObject = (itemData: ItemFormData, categoryId: string): MenuItem => {
    return {
      ...itemData,
      id: currentItem.value?.id || '',
      itemNumber: currentItem.value?.itemNumber || 0,
      category_id: categoryId,
      organization_id: config.defaultParams.organization_id,
      details: handleFormatItemDetails(itemData),
      available: itemData.available ?? DEFAULT_AVAILABLE,
      currency: itemData.currency ?? DEFAULT_CURRENCY,
      imageUrl: itemData.imageUrl ?? DEFAULT_IMAGE_URL,
    };
  };

  return {
    isProcessing,
    formError,
    currentItem,
    showAddItemModal,
    handleEditItem,
    handleCancelItemEdit,
    handleItemSave,
    handleItemCreation,
    handleCreateMenuItemObject,
  };
};
