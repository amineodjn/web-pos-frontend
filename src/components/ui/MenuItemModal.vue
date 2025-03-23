<template>
  <div>
    <button 
      type="button" 
      class="hidden" 
      data-modal-target="menuItemModal" 
      data-modal-toggle="menuItemModal"
    ></button>    
    <div 
      id="menuItemModal" 
      tabindex="-1" 
      aria-hidden="true" 
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative w-full max-w-2xl max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ itemToEdit ? 'Edit' : 'Add' }} Menu Item
            </h3>
            <button 
              @click="cancel" 
              type="button" 
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
              data-modal-hide="menuItemModal"
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="p-4 md:p-5 space-y-4 relative">
            <div v-if="isProcessing" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 dark:bg-gray-800 dark:bg-opacity-80">
              <div class="text-center">
                <SpinnerUI />
                <p class="text-gray-600 mt-4 dark:text-gray-300">Saving...</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="item-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name <span class="text-red-500">*</span></label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  id="item-name" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                  required
                />
              </div>
              <div>
                <SelectBoxUI
                  v-model="form.category"
                  :options="categoryOptions"
                  placeholder="Select a category"
                  placeholderValue=""
                  placeholderDisabled
                  required
                >
                  <template #label>
                    Category <span class="text-red-500">*</span>
                  </template>
                </SelectBoxUI>
              </div>
              <div>
                <label for="item-price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price <span class="text-red-500">*</span></label>
                <input 
                  v-model.number="form.price" 
                  type="number" 
                  step="0.01" 
                  id="item-price" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                  required
                />
              </div>
              <div>
                <label for="item-currency" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Currency <span class="text-red-500">*</span></label>
                <input 
                  v-model="form.currency" 
                  type="text" 
                  id="item-currency" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                  required
                />
              </div>
              <div class="md:col-span-2">
                <label for="item-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description <span class="text-red-500">*</span></label>
                <textarea 
                  v-model="form.description" 
                  id="item-description" 
                  rows="3" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                  required
                ></textarea>
              </div>
              <div class="md:col-span-2">
                <label for="item-image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image URL <span class="text-red-500">*</span></label>
                <input 
                  v-model="form.imageUrl" 
                  type="text" 
                  id="item-image" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                  required
                />
              </div>
              <div>
                <div class="flex items-center">
                  <input 
                    v-model="form.available" 
                    id="item-available" 
                    type="checkbox" 
                    class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                  />
                  <label for="item-available" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Available</label>
                </div>
              </div>
              <div class="md:col-span-2 pt-2">
                <div id="accordion-collapse" data-accordion="collapse">
                  <h2 id="accordion-collapse-heading-1">
                    <button type="button" 
                      class="flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" 
                      data-accordion-target="#accordion-collapse-body-1" 
                      aria-expanded="false" 
                      aria-controls="accordion-collapse-body-1"
                    >
                      <span class="flex items-center">
                        <svg class="w-5 h-5 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.6-8.5h0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        Item Details
                      </span>
                      <svg data-accordion-icon class="w-3 h-3 shrink-0 rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                      </svg>
                    </button>
                  </h2>
                  <div id="accordion-collapse-body-1" class="hidden" aria-labelledby="accordion-collapse-heading-1">
                    <div class="p-3 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="item-ingredients" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ingredients</label>
                          <input 
                            v-model="ingredientsText" 
                            type="text" 
                            id="item-ingredients" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            placeholder="Ice cream, Whipped cream, Nuts"
                          />
                          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple ingredients with commas</p>
                        </div>
                        <div>
                          <label for="item-meats" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Meats</label>
                          <input 
                            v-model="meatsText" 
                            type="text" 
                            id="item-meats" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            placeholder="Chicken, Beef, Pork"
                          />
                          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple meats with commas</p>
                        </div>
                        <div>
                          <label for="item-sauces" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sauces</label>
                          <input 
                            v-model="saucesText" 
                            type="text" 
                            id="item-sauces" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            placeholder="Chocolate, Caramel, Strawberry"
                          />
                          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple sauces with commas</p>
                        </div>
                        <div>
                          <label for="item-sizes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sizes</label>
                          <input 
                            v-model="sizesText" 
                            type="text" 
                            id="item-sizes" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            placeholder="Small, Regular, Large"
                          />
                          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple sizes with commas</p>
                        </div>
                        <div class="md:col-span-2">
                          <label for="item-tags" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                          <input 
                            v-model="tagsText" 
                            type="text" 
                            id="item-tags" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            placeholder="Sweet, Cold, Spicy, Vegetarian"
                          />
                          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple tags with commas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="formError" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
                </svg>
                <span class="font-medium">{{ formError }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 gap-3">
            <button 
              @click="cancel" 
              data-modal-hide="menuItemModal" 
              type="button" 
              :disabled="isProcessing"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              @click="save" 
              type="button" 
              class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isFormValid || isProcessing"
            >
              <span v-if="isProcessing">
                <SpinnerUI class="w-4 h-4" />
              </span>
              <span v-else>
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12l5 5L20 7"/>
                </svg>
              </span>
              <span>{{ isProcessing ? 'Saving...' : 'Save' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import type { MenuItem, MenuItemDetails } from '../../types/MenuData';
import SpinnerUI from './SpinnerUI.vue';
import SelectBoxUI from './SelectBoxUI.vue';
import { Modal, initFlowbite } from 'flowbite';
interface MenuItemForm {
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  imageUrl: string;
  available: boolean;
  details: {
    ingredients: string[];
    meats: string[];
    sauces: string[];
    sizes: string[];
    tags: string[];
  };
  tags: null | string[];
}
const props = defineProps<{
  show: boolean;
  itemToEdit: MenuItem | null;
  categoryOptions: { label: string; value: string }[];
  isProcessing: boolean;
  formError: string;
}>();
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'save', item: any): void;
  (e: 'cancel'): void;
}>();
const defaultForm: MenuItemForm = {
  name: '',
  category: '',
  price: 0,
  currency: 'PLN',
  description: '',
  imageUrl: '../../../images/default.jpg',
  available: true,
  details: {
    ingredients: [],
    meats: [],
    sauces: [],
    sizes: ['Regular'],
    tags: []
  },
  tags: null
};
const form = reactive<MenuItemForm>({ ...defaultForm });
const ingredientsText = ref('');
const meatsText = ref('');
const saucesText = ref('');
const sizesText = ref('');
const tagsText = ref('');
watch(ingredientsText, (newVal) => {
  form.details.ingredients = parseCommaSeparatedText(newVal);
});
watch(meatsText, (newVal) => {
  form.details.meats = parseCommaSeparatedText(newVal);
});
watch(saucesText, (newVal) => {
  form.details.sauces = parseCommaSeparatedText(newVal);
});
watch(sizesText, (newVal) => {
  form.details.sizes = parseCommaSeparatedText(newVal);
});
watch(tagsText, (newVal) => {
  form.details.tags = parseCommaSeparatedText(newVal);
});
function parseCommaSeparatedText(text: string): string[] {
  if (!text) return [];
  return text.split(',')
    .map(item => item.trim())
    .filter(item => item !== '');
}
function arrayToCommaSeparatedText(arr: string[] | undefined): string {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(', ');
}
const isFormValid = computed(() => {
  return form.name.trim() !== '' &&
         form.category !== '' &&
         form.price > 0 &&
         form.currency.trim() !== '' &&
         form.description.trim() !== '' &&
         form.imageUrl.trim() !== '';
});
let modal: any = null;
onMounted(() => {
  initFlowbite();
  const $modalElement = document.getElementById('menuItemModal');
  if ($modalElement) {
    modal = new Modal($modalElement, {
      placement: 'center',
      backdrop: 'static',
      closable: true
    });
  }
});
watch(() => props.show, async (newVal) => {
  if (!modal) return;
  if (newVal) {
    if (props.itemToEdit) {
      const category = getCategoryFromItem(props.itemToEdit);
      Object.assign(form, defaultForm, {
        ...props.itemToEdit,
        category
      });
      ingredientsText.value = arrayToCommaSeparatedText(props.itemToEdit.details?.ingredients);
      meatsText.value = arrayToCommaSeparatedText(props.itemToEdit.details?.meats);
      saucesText.value = arrayToCommaSeparatedText(props.itemToEdit.details?.sauces);
      sizesText.value = arrayToCommaSeparatedText(props.itemToEdit.details?.sizes);
      tagsText.value = arrayToCommaSeparatedText(props.itemToEdit.details?.tags);
    } else {
      Object.assign(form, defaultForm);
      ingredientsText.value = '';
      meatsText.value = '';
      saucesText.value = '';
      sizesText.value = 'Regular';
      tagsText.value = '';
    }
    await nextTick();
    modal.show();
    nextTick(() => {
      initFlowbite();
    });
  } else {
    modal.hide();
  }
});
watch(() => props.itemToEdit, (newVal) => {
  if (newVal) {
    const category = getCategoryFromItem(newVal);
    Object.assign(form, defaultForm, {
      ...newVal,
      category
    });
    ingredientsText.value = arrayToCommaSeparatedText(newVal.details?.ingredients);
    meatsText.value = arrayToCommaSeparatedText(newVal.details?.meats);
    saucesText.value = arrayToCommaSeparatedText(newVal.details?.sauces);
    sizesText.value = arrayToCommaSeparatedText(newVal.details?.sizes);
    tagsText.value = arrayToCommaSeparatedText(newVal.details?.tags);
  }
});
function getCategoryFromItem(item: MenuItem): string {
  return (item as any).category || '';
}
function save() {
  if (!isFormValid.value || props.isProcessing) return;
  form.details.ingredients = parseCommaSeparatedText(ingredientsText.value);
  form.details.meats = parseCommaSeparatedText(meatsText.value);
  form.details.sauces = parseCommaSeparatedText(saucesText.value);
  form.details.sizes = parseCommaSeparatedText(sizesText.value) || ['Regular'];
  form.details.tags = parseCommaSeparatedText(tagsText.value);
  emit('save', {
    name: form.name,
    category: form.category,
    price: form.price,
    currency: form.currency,
    description: form.description,
    imageUrl: form.imageUrl,
    available: form.available,
    details: form.details,
    tags: form.tags
  });
}
function cancel() {
  emit('update:show', false);
  emit('cancel');
}
</script> 