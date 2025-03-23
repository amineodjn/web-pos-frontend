<template>
  <div class="admin-view relative bg-white dark:bg-dark-bg p-5 rounded">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      {{ translateAdminView('title') }}
    </h1>
    <div
      v-if="menuStore.isLoading"
      class="text-center py-8 flex flex-col items-center justify-center min-h-[200px]"
    >
      <SpinnerUI />
      <p class="text-gray-600 dark:text-gray-300 mt-4">
        {{ translateAdminView('loading') }}
      </p>
    </div>
    <div
      v-else-if="menuStore.error"
      class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6"
    >
      <p class="font-bold">{{ translateAdminView('error.title') }}</p>
      <p>{{ menuStore.error }}</p>
      <button
        @click="menuStore.fetchMenuData()"
        class="mt-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-1 rounded"
      >
        {{ translateAdminView('error.retry') }}
      </button>
    </div>
    <div v-else class="relative">
      <div
        v-if="isProcessing"
        class="absolute inset-0 bg-white bg-opacity-70 dark:bg-dark-bg dark:bg-opacity-70 flex items-center justify-center z-50"
      >
        <div class="text-center">
          <SpinnerUI />
          <p class="text-gray-600 dark:text-gray-300 mt-4">
            {{ translateAdminView('processing') }}
          </p>
        </div>
      </div>
      <div class="flex mb-6">
        <div class="mr-4">
          <button
            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
            @click="activeTab = 'categories'"
          >
            {{ translateAdminView('tabs.categories') }}
          </button>
        </div>
        <div class="mr-4">
          <button
            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
            @click="activeTab = 'items'"
          >
            {{ translateAdminView('tabs.items') }}
          </button>
        </div>
        <div class="ml-auto">
          <button
            @click="confirmReset"
            :disabled="isProcessing"
            class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {{ translateButtons('reset') }}
          </button>
        </div>
      </div>
      <div v-if="activeTab === 'categories'" class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {{ translateAdminView('categories.title') }}
        </h2>
        <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 class="font-medium mb-2 text-gray-900 dark:text-white">
            {{ translateAdminView('categories.addNew') }}
          </h3>
          <div class="flex">
            <input
              v-model="newCategory"
              class="border border-gray-300 dark:border-gray-600 p-2 rounded mr-2 flex-grow bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              :placeholder="translateAdminView('categories.placeholder')"
            />
            <button
              @click="addCategory"
              :disabled="!newCategory || isProcessing"
              class="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              <span v-if="isProcessing">{{ translateButtons('saving') }}</span>
              <span v-else>{{ translateButtons('add') }}</span>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="category in menuStore.categories"
            :key="category"
            class="p-4 border border-gray-300 dark:border-gray-600 rounded flex justify-between items-center bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
          >
            <span>{{ category }}</span>
            <button
              @click="confirmDeleteCategory(category)"
              :disabled="isProcessing"
              class="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              {{ translateButtons('delete') }}
            </button>
          </div>
          <div
            v-if="menuStore.categories.length === 0"
            class="p-4 text-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-bg"
          >
            {{ translateAdminView('categories.empty') }}
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'items'" class="flex flex-col mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ translateAdminView('items.title') }}
          </h2>
          <span class="text-gray-500 dark:text-gray-400 text-sm">
            {{
              filteredItems.length === 1
                ? translateAdminView('items.foundCount', {
                    count: filteredItems.length
                  })
                : translateAdminView('items.foundCountPlural', {
                    count: filteredItems.length
                  })
            }}
          </span>
        </div>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex-grow mr-4 max-w-xs">
            <SearchInputUI
              v-model="searchQuery"
              label="Search Items"
              :placeholder="translateAdminView('items.searchPlaceholder')"
              class="w-full"
            />
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="showAddItemModal = true"
              :disabled="isProcessing"
              class="bg-red-600 mt-8 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14m-7 7V5"
                />
              </svg>
              {{ translateButtons('addNew') }}
            </button>
            <div class="flex flex-col">
              <SelectBoxUI
                v-model="selectedCategory"
                :options="categoryOptions"
                :label="translateAdminView('items.filterLabel')"
                :placeholder="translateAdminView('items.filterPlaceholder')"
                placeholderValue=""
              />
            </div>
          </div>
        </div>
        <div
          v-if="filteredItems.length > 0"
          class="flex flex-wrap justify-center gap-4 px-4"
        >
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="flex justify-center relative group"
          >
            <div class="relative overflow-hidden rounded-lg">
              <MenuCard
                :imageUrl="item.imageUrl"
                :name="item.name"
                :description="item.description"
                :details="item.details"
                :price="item.price"
                :currency="item.currency"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"
              >
                <div
                  class="bg-gray-800 bg-opacity-75 backdrop-blur-sm p-3 rounded-lg flex gap-3"
                >
                  <button
                    @click="editItem(item)"
                    :disabled="isProcessing"
                    class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50 flex items-center transition-transform hover:scale-110"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="confirmDeleteItem(item)"
                    :disabled="isProcessing"
                    class="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded-full disabled:opacity-50 flex items-center transition-transform hover:scale-110"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                      />
                    </svg>
                  </button>
                </div>
                <div class="text-center mt-2">
                  <span
                    class="badge bg-gray-800 text-white px-3 py-1 rounded-full text-xs"
                  >
                    {{ getCategoryForItem(item) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-bg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
            {{ translateAdminView('items.empty.title') }}
          </p>
          <p class="mt-1 text-gray-500 dark:text-gray-400">
            {{ translateAdminView('items.empty.description') }}
          </p>
          <button
            @click="showAddItemModal = true"
            :disabled="isProcessing"
            class="mt-6 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 mx-auto transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14m-7 7V5"
              />
            </svg>
            {{ translateButtons('addNew') }}
          </button>
        </div>
      </div>
      <MenuItemModal
        v-model:show="showAddItemModal"
        :item-to-edit="itemToEdit"
        :category-options="categoryOptions"
        :is-processing="isProcessing"
        :form-error="formError"
        @save="handleItemSave"
        @cancel="cancelItemEdit"
      />
      <ConfirmationModal
        v-model="showConfirmation"
        :title="confirmationTitle"
        :message="confirmationMessage"
        :is-processing="isProcessing"
        @confirm="confirmAction"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useMenuStore } from '../stores/menuStore'
import type { MenuItem } from '../types/MenuData'
import { resetMenuData } from '../services/api'
import SpinnerUI from '../components/ui/SpinnerUI.vue'
import MenuCard from '../components/ui/MenuCard.vue'
import SelectBoxUI from '../components/ui/SelectBoxUI.vue'
import SearchInputUI from '../components/ui/SearchInputUI.vue'
import ConfirmationModal from '../components/ui/ConfirmationModal.vue'
import MenuItemModal from '../components/ui/MenuItemModal.vue'
import { useTranslate } from '../composables/useTranslate.ts'

const menuStore = useMenuStore()
const isProcessing = ref(false)
const formError = ref('')
const searchQuery = ref('')
const activeTab = ref('items')
const newCategory = ref('')

const { translate: translateAdminView } = useTranslate('adminView')
const { translate: translateButtons } = useTranslate('adminView.buttons')
const { translate: translateConfirmations } = useTranslate(
  'adminView.confirmations'
)

async function addCategory() {
  if (newCategory.value.trim() && !isProcessing.value) {
    try {
      isProcessing.value = true
      await menuStore.addCategory(newCategory.value.trim())
      newCategory.value = ''
    } catch (err) {
      console.error('Failed to add category:', err)
    } finally {
      isProcessing.value = false
    }
  }
}

const selectedCategory = ref('')
const showAddItemModal = ref(false)
const itemToEdit = ref<MenuItem | null>(null)

const filteredItems = computed(() => {
  let items = selectedCategory.value
    ? menuStore.items[selectedCategory.value] || []
    : menuStore.allItems

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    items = items.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    )
  }
  return items
})

const categoryOptions = computed(() => {
  return menuStore.categories.map(category => ({
    label: category,
    value: category
  }))
})

function getCategoryForItem(item: MenuItem): string {
  for (const category in menuStore.items) {
    if (menuStore.items[category].some(i => i.id === item.id)) {
      return category
    }
  }
  return 'Unknown'
}

function editItem(item: MenuItem) {
  itemToEdit.value = item
  showAddItemModal.value = true
  formError.value = ''
}

async function handleItemSave(itemData: any) {
  if (isProcessing.value) return
  try {
    isProcessing.value = true
    formError.value = ''
    if (itemToEdit.value) {
      const category = getCategoryForItem(itemToEdit.value)
      if (category !== itemData.category) {
        await menuStore.deleteMenuItem(category, itemToEdit.value.id)
        await menuStore.addMenuItem(itemData.category, {
          ...itemData
        } as Omit<MenuItem, 'id' | 'itemNumber'>)
      } else {
        await menuStore.updateMenuItem(category, {
          ...itemData,
          id: itemToEdit.value.id,
          itemNumber: itemToEdit.value.itemNumber
        })
      }
    } else {
      await menuStore.addMenuItem(itemData.category, itemData)
    }
    cancelItemEdit()
  } catch (err) {
    console.error('Failed to save item:', err)
    formError.value =
      err instanceof Error
        ? err.message
        : 'Failed to save item. Please try again.'
  } finally {
    isProcessing.value = false
  }
}

function cancelItemEdit() {
  if (isProcessing.value) return
  itemToEdit.value = null
  showAddItemModal.value = false
  formError.value = ''
}

const showConfirmation = ref(false)
const confirmationTitle = ref('Confirm Action')
const confirmationMessage = ref('')
const pendingAction = ref<() => Promise<void>>(() => Promise.resolve())

async function confirmAction() {
  if (isProcessing.value) return
  try {
    isProcessing.value = true
    await pendingAction.value()
    showConfirmation.value = false
  } catch (err) {
    console.error('Action failed:', err)
  } finally {
    isProcessing.value = false
  }
}

function confirmDeleteCategory(category: string) {
  confirmationTitle.value = translateConfirmations('deleteCategory.title')
  confirmationMessage.value = translateConfirmations('deleteCategory.message', {
    name: category
  })
  pendingAction.value = () => menuStore.deleteCategory(category)
  showConfirmation.value = true
}

function confirmDeleteItem(item: MenuItem) {
  const category = getCategoryForItem(item)
  confirmationTitle.value = translateConfirmations('deleteItem.title')
  confirmationMessage.value = translateConfirmations('deleteItem.message', {
    name: item.name
  })
  pendingAction.value = () => menuStore.deleteMenuItem(category, item.id)
  showConfirmation.value = true
}

function confirmReset() {
  confirmationTitle.value = translateConfirmations('resetData.title')
  confirmationMessage.value = translateConfirmations('resetData.message')
  pendingAction.value = async () => {
    await resetMenuData()
    await menuStore.fetchMenuData()
  }
  showConfirmation.value = true
}
</script>
