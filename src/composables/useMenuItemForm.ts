import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';
import type { MenuItem, Category } from '../types/MenuData';
import { useMenuStore } from '../stores/menuStore';
import type { ItemFormData } from '@/types/menu';

interface FormDetails {
  ingredients: string[];
  meats: string[];
  sauces: string[];
  sizes: string[];
  tags: string[];
}

interface FormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  imageUrl: string;
  available: boolean;
  currency: string;
  details: FormDetails;
}

export const useMenuItemForm = (): {
  form: Ref<FormData>;
  ingredientsText: Ref<string>;
  meatsText: Ref<string>;
  saucesText: Ref<string>;
  sizesText: Ref<string>;
  tagsText: Ref<string>;
  isFormValid: ComputedRef<boolean>;
  handleResetForm: () => void;
  handleInitializeForm: (item: ItemFormData) => void;
  handleGetCategoryFromItem: (item: MenuItem | ItemFormData) => string;
  handleValidatePrice: (price: number) => boolean;
  handlePrepareFormData: () => ItemFormData | undefined;
} => {
  const menuStore = useMenuStore();
  const form = ref<FormData>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    imageUrl: '',
    available: true,
    currency: 'PLN',
    details: {
      ingredients: [],
      meats: [],
      sauces: [],
      sizes: [],
      tags: [],
    },
  });

  const ingredientsText = ref('');
  const meatsText = ref('');
  const saucesText = ref('');
  const sizesText = ref('Regular');
  const tagsText = ref('');

  const isFormValid = computed(() => {
    const price = parseFloat(form.value.price?.toString() || '0');
    return Boolean(
      form.value.name?.trim() &&
        form.value.category_id &&
        !isNaN(price) &&
        price > 0 &&
        form.value.currency?.trim() &&
        form.value.description?.trim()
    );
  });

  const handleParseCommaSeparatedText = (text: string): string[] => {
    return text
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  };

  const handleResetForm = (): void => {
    form.value = {
      name: '',
      description: '',
      price: 0,
      category_id: '',
      imageUrl: '',
      available: true,
      currency: 'PLN',
      details: {
        ingredients: [],
        meats: [],
        sauces: [],
        sizes: [],
        tags: [],
      },
    };
    ingredientsText.value = '';
    meatsText.value = '';
    saucesText.value = '';
    sizesText.value = 'Regular';
    tagsText.value = '';
  };

  const handleInitializeForm = (item: ItemFormData): void => {
    const category = handleGetCategoryFromItem(item);
    const existingImageUrl = item.imageUrl || '';

    form.value = {
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      category_id: category,
      imageUrl: existingImageUrl,
      available: item.available ?? true,
      currency: item.currency || 'PLN',
      details: {
        ingredients: item.details?.ingredients || [],
        meats: item.details?.meats || [],
        sauces: item.details?.sauces || [],
        sizes: item.details?.sizes || [],
        tags: item.details?.tags || [],
      },
    };

    ingredientsText.value = item.details?.ingredients?.join(', ') || '';
    meatsText.value = item.details?.meats?.join(', ') || '';
    saucesText.value = item.details?.sauces?.join(', ') || '';
    sizesText.value = item.details?.sizes?.join(', ') || 'Regular';
    tagsText.value = item.details?.tags?.join(', ') || '';
  };

  const handleGetCategoryFromItem = (item: MenuItem | ItemFormData): string => {
    if ('id' in item) {
      const category = menuStore.categories.find((cat: Category) =>
        cat.categoryItems.some((i: MenuItem) => i.id === item.id)
      );
      return category?.categoryName || '';
    }
    return '';
  };

  const handleValidatePrice = (price: number): boolean => {
    return price >= 0;
  };

  const handlePrepareFormData = (): ItemFormData | undefined => {
    if (!isFormValid.value) return undefined;

    const { price, ...rest } = form.value;
    const validatedPrice = handleValidatePrice(price);

    if (!validatedPrice) {
      return undefined;
    }

    return {
      ...rest,
      price: Number(validatedPrice),
    };
  };

  // Watch all text fields
  watch(ingredientsText, newVal => {
    form.value.details.ingredients = handleParseCommaSeparatedText(newVal);
  });

  watch(meatsText, newVal => {
    form.value.details.meats = handleParseCommaSeparatedText(newVal);
  });

  watch(saucesText, newVal => {
    form.value.details.sauces = handleParseCommaSeparatedText(newVal);
  });

  watch(sizesText, newVal => {
    form.value.details.sizes = handleParseCommaSeparatedText(newVal);
  });

  watch(tagsText, newVal => {
    form.value.details.tags = handleParseCommaSeparatedText(newVal);
  });

  return {
    form,
    ingredientsText,
    meatsText,
    saucesText,
    sizesText,
    tagsText,
    isFormValid,
    handleResetForm,
    handleInitializeForm,
    handleGetCategoryFromItem,
    handleValidatePrice,
    handlePrepareFormData,
  };
};
