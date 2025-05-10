import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { Category, MenuItem } from '@/types/MenuData';
import { useToast } from './useToast';
import { useTranslate } from './useTranslate';

type MenuStore = {
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  deleteMenuItem: (categoryId: string, itemId: string) => Promise<void>;
};

export const useCategory = (
  menuStore: MenuStore
): {
  isProcessing: Ref<boolean>;
  showConfirmation: Ref<boolean>;
  confirmationTitle: Ref<string>;
  confirmationMessage: Ref<string>;
  handleAddCategory: (categoryName: string) => Promise<void>;
  handleGetCategoryNameForItem: (item: MenuItem) => string;
  handleConfirmation: (confirmed: boolean) => void;
  handleConfirmDeleteCategory: (category: Category) => Promise<void>;
  handleConfirmDeleteItem: (item: MenuItem) => Promise<void>;
  categories: ComputedRef<Category[]>;
} => {
  const isProcessing = ref(false);
  const toast = useToast();
  const { translate: translateAdminView } = useTranslate('menuView');
  const { translate: translateConfirmations } = useTranslate('menuView.confirmations');

  const showConfirmation = ref(false);
  const confirmationTitle = ref('Confirm Action');
  const confirmationMessage = ref('');
  const confirmationResolve = ref<((value: boolean) => void) | null>(null);

  const categories = ref<Category[]>([]);

  const handleShowConfirmationDialog = (title: string, message: string): Promise<boolean> => {
    confirmationTitle.value = title;
    confirmationMessage.value = message;
    showConfirmation.value = true;

    return new Promise(resolve => {
      confirmationResolve.value = resolve;
    });
  };

  const handleAddCategory = async (categoryName: string): Promise<void> => {
    if (categoryName && !isProcessing.value) {
      try {
        isProcessing.value = true;
        await menuStore.addCategory(categoryName);
        toast.success(
          translateAdminView('toast.success.addCategory', {
            name: categoryName,
          })
        );
      } catch (err) {
        console.error('Failed to add category:', err);
        toast.error(
          translateAdminView('toast.error.addCategory', {
            message: err instanceof Error ? err.message : 'Unknown error',
          })
        );
      } finally {
        isProcessing.value = false;
      }
    }
  };

  const handleGetCategoryIdForItem = (item: MenuItem): string => {
    const category = categories.value.find(cat => cat.categoryItems.some(i => i.id === item.id));
    return category?.categoryId || '';
  };

  const handleGetCategoryNameForItem = (item: MenuItem): string => {
    const category = menuStore.categories.find(cat =>
      cat.categoryItems?.some(i => i.id === item.id)
    );
    return category?.categoryName || '';
  };

  const handleConfirmation = (confirmed: boolean): void => {
    showConfirmation.value = false;
    if (confirmationResolve.value) {
      confirmationResolve.value(confirmed);
      confirmationResolve.value = null;
    }
  };

  const handleConfirmDeleteCategory = async (category: Category): Promise<void> => {
    const confirmed = await handleShowConfirmationDialog(
      translateConfirmations('deleteCategory.title'),
      translateConfirmations('deleteCategory.message', {
        name: category.categoryName,
      })
    );

    if (confirmed) {
      try {
        isProcessing.value = true;
        await menuStore.deleteCategory(category.categoryId);
        toast.success(translateAdminView('toast.success.deleteCategory'));
      } catch (err) {
        toast.error(
          translateAdminView('toast.error.deleteCategory', {
            message: err instanceof Error ? err.message : 'Unknown error',
          })
        );
      } finally {
        isProcessing.value = false;
      }
    }
  };

  const handleConfirmDeleteItem = async (item: MenuItem): Promise<void> => {
    const categoryId = handleGetCategoryIdForItem(item);
    const confirmed = await handleShowConfirmationDialog(
      translateConfirmations('deleteItem.title'),
      translateConfirmations('deleteItem.message', {
        name: item.name,
      })
    );

    if (confirmed) {
      try {
        isProcessing.value = true;
        await menuStore.deleteMenuItem(categoryId, item.id);
        toast.success(translateAdminView('toast.success.deleteItem'));
      } catch (err) {
        toast.error(
          translateAdminView('toast.error.generic', {
            message: err instanceof Error ? err.message : 'Unknown error',
          })
        );
      } finally {
        isProcessing.value = false;
      }
    }
  };

  return {
    isProcessing,
    showConfirmation,
    confirmationTitle,
    confirmationMessage,
    handleAddCategory,
    handleGetCategoryNameForItem,
    handleConfirmation,
    handleConfirmDeleteCategory,
    handleConfirmDeleteItem,
    categories: computed(() => categories.value),
  };
};
