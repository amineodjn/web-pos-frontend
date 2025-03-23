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

    <ErrorUI
      v-else-if="menuStore.error"
      errorType="api"
      :title="translateAdminView('error.title')"
      :message="menuStore.error"
      :retryText="translateAdminView('error.retry')"
      @retry="menuStore.fetchMenuData()"
    />

    <div v-else class="relative">
      <LoadingOverlay
        v-if="isProcessing"
        :message="translateAdminView('processing')"
      />

      <TabsBar
        :tabs="[
          { label: translateAdminView('tabs.categories'), value: 'categories' },
          { label: translateAdminView('tabs.items'), value: 'items' }
        ]"
        v-model:activeTab="activeTab"
      >
        <template #actions>
          <button
            @click="confirmReset"
            :disabled="isProcessing"
            class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {{ translateButtons('reset') }}
          </button>
        </template>
      </TabsBar>

      <CategoryManager
        v-if="activeTab === 'categories'"
        :categories="menuStore.categories"
        :is-processing="isProcessing"
        :title="translateAdminView('categories.title')"
        :add-new-label="translateAdminView('categories.addNew')"
        :placeholder="translateAdminView('categories.placeholder')"
        :saving-label="translateButtons('saving')"
        :add-label="translateButtons('add')"
        :delete-label="translateButtons('delete')"
        :empty-message="translateAdminView('categories.empty')"
        @add="addCategory"
        @delete="confirmDeleteCategory"
      />

      <MenuItemsContainer
        v-if="activeTab === 'items'"
        :title="translateAdminView('items.title')"
        :items="filteredItems"
        :items-count-singular="
          translateAdminView('items.foundCount', {
            count: filteredItems.length
          })
        "
        :items-count-plural="
          translateAdminView('items.foundCountPlural', {
            count: filteredItems.length
          })
        "
        :search-placeholder="translateAdminView('items.searchPlaceholder')"
        :add-button-label="translateButtons('addNew')"
        :is-processing="isProcessing"
        :initial-search-query="searchQuery"
        @add-item="showAddItemModal = true"
        @search="updateSearchQuery"
      >
        <template #filters>
          <SelectBoxUI
            v-model="selectedCategory"
            :options="categoryOptions"
            :placeholder="translateAdminView('items.filterPlaceholder')"
            placeholderValue=""
          />
        </template>

        <template #items-grid>
          <div class="flex flex-wrap justify-center gap-4 px-4">
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
                <MenuCardActions
                  :is-processing="isProcessing"
                  :category="getCategoryForItem(item)"
                  @edit="editItem(item)"
                  @delete="confirmDeleteItem(item)"
                />
              </div>
            </div>
          </div>
        </template>

        <template #empty-state>
          <EmptyItemsView
            :title="translateAdminView('items.empty.title')"
            :description="translateAdminView('items.empty.description')"
            :button-label="translateButtons('addNew')"
            :is-processing="isProcessing"
            @add-item="showAddItemModal = true"
          />
        </template>
      </MenuItemsContainer>

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
import { ref, computed } from 'vue'
import { useMenuStore } from '../stores/menuStore'
import type { MenuItem } from '../types/MenuData'
import { resetMenuData } from '../services/api'
import SpinnerUI from '../components/common/SpinnerUI.vue'
import MenuCard from '../components/menu/MenuCard.vue'
import SelectBoxUI from '../components/common/SelectBoxUI.vue'
import ConfirmationModal from '../components/common/ConfirmationModal.vue'
import MenuItemModal from '../components/admin/MenuItemModal.vue'
import { useTranslate } from '../composables/useTranslate.ts'
import LoadingOverlay from '../components/admin/LoadingOverlay.vue'
import TabsBar from '../components/admin/TabsBar.vue'
import CategoryManager from '../components/admin/CategoryManager.vue'
import MenuItemsContainer from '../components/admin/MenuItemsContainer.vue'
import MenuCardActions from '../components/admin/MenuCardActions.vue'
import EmptyItemsView from '../components/admin/EmptyItemsView.vue'
import ErrorUI from '../components/common/ErrorUI.vue'

const menuStore = useMenuStore()
const isProcessing = ref(false)
const formError = ref('')
const searchQuery = ref('')
const activeTab = ref('items')

const { translate: translateAdminView } = useTranslate('adminView')
const { translate: translateButtons } = useTranslate('adminView.buttons')
const { translate: translateConfirmations } = useTranslate(
  'adminView.confirmations'
)

async function addCategory(categoryName: string) {
  if (categoryName && !isProcessing.value) {
    try {
      isProcessing.value = true
      await menuStore.addCategory(categoryName)
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

function updateSearchQuery(query: string) {
  searchQuery.value = query
}
</script>
