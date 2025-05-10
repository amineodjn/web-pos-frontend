<template>
  <div class="flex h-screen dark:bg-dark-bg">
    <Sidebar v-model="isSidebarCollapsed" />
    <div
      class="flex-1 transition-all duration-300"
      :class="[isSidebarCollapsed ? 'ml-16' : 'ml-64']"
    >
      <div class="admin-view relative bg-white dark:bg-dark-bg p-5 rounded">
        <!-- Menu Management Content -->
        <template v-if="$route.path === '/admin/menu'">
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
              v-if="itemProcessing"
              :message="translateAdminView('processing')"
            />

            <div class="flex justify-end mb-6">
              <TabsBar :tabs="tabs" v-model:activeTab="activeTab" />
            </div>

            <CategoryManager
              v-if="activeTab === 'categories'"
              :categories="menuStore.categories"
              :is-processing="categoryProcessing"
              :config="categoryConfig"
              @add="addCategory"
              @delete="confirmDeleteCategory"
            />

            <MenuItemsContainer
              v-if="activeTab === 'items'"
              :header-config="headerConfig"
              :state-config="stateConfig"
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
                <div
                  class="gap-x-16 gap-y-8 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-2 px-4"
                >
                  <div
                    v-for="item in filteredItems"
                    :key="item.id"
                    class="relative group"
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
                        :is-processing="itemProcessing"
                        :category="getCategoryNameForItem(item)"
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
                  :is-processing="itemProcessing"
                  @add-item="showAddItemModal = true"
                />
              </template>
            </MenuItemsContainer>

            <MenuItemModal
              v-model="showAddItemModal"
              :item-to-edit="itemToEdit"
              :category-options="categoryOptions"
              :is-processing="itemProcessing"
              :form-error="formError"
              @save="handleItemSave"
              @cancel="cancelItemEdit"
            />

            <ConfirmationModal
              v-model="showConfirmation"
              :title="confirmationTitle"
              :message="confirmationMessage"
              :is-processing="categoryProcessing"
              @confirm="() => handleConfirmation(true)"
              @cancel="() => handleConfirmation(false)"
            />
          </div>
        </template>

        <!-- Child Routes Content -->
        <router-view v-else></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMenuStore } from '../stores/menuStore.ts'
import type { HeaderConfig, StateConfig, CategoryConfig } from '../types/menu'
import { useMenuItem } from '../composables/useMenuItem'
import { useCategory } from '../composables/useCategory'
import { useTranslate } from '../composables/useTranslate.ts'
import SpinnerUI from '../components/common/SpinnerUI.vue'
import MenuCard from '../components/menu/MenuCard.vue'
import SelectBoxUI from '../components/common/SelectBoxUI.vue'
import ConfirmationModal from '../components/common/ConfirmationModal.vue'
import MenuItemModal from '../components/admin/MenuItemModal.vue'
import LoadingOverlay from '../components/admin/LoadingOverlay.vue'
import TabsBar from '../components/admin/TabsBar.vue'
import CategoryManager from '../components/admin/CategoryManager.vue'
import MenuItemsContainer from '../components/admin/MenuItemsContainer.vue'
import MenuCardActions from '../components/admin/MenuCardActions.vue'
import EmptyItemsView from '../components/admin/EmptyItemsView.vue'
import ErrorUI from '../components/common/ErrorUI.vue'
import Sidebar from '../components/admin/Sidebar.vue'

const menuStore = useMenuStore()
const { translate: translateAdminView } = useTranslate('menuView')
const { translate: translateButtons } = useTranslate('menuView.buttons')

const isSidebarCollapsed = ref(false)
const searchQuery = ref('')
const activeTab = ref('items')
const selectedCategory = ref('')

const {
  isProcessing: itemProcessing,
  formError,
  itemToEdit,
  showAddItemModal,
  editItem,
  cancelItemEdit,
  handleItemSave
} = useMenuItem(menuStore)

const {
  isProcessing: categoryProcessing,
  showConfirmation,
  confirmationTitle,
  confirmationMessage,
  addCategory,
  getCategoryNameForItem,
  handleConfirmation,
  confirmDeleteCategory,
  confirmDeleteItem
} = useCategory(menuStore)

const filteredItems = computed(() => {
  let items = selectedCategory.value
    ? menuStore.categories.find(c => c.categoryId === selectedCategory.value)
        ?.categoryItems || []
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

const tabs = computed(() => [
  {
    label: translateAdminView('tabs.categories'),
    value: 'categories'
  },
  {
    label: translateAdminView('tabs.items'),
    value: 'items'
  }
])

const categoryOptions = computed(() => {
  return (menuStore.categories || []).map(category => ({
    label: category.categoryName,
    value: category.categoryId
  }))
})

const headerConfig = computed<HeaderConfig>(() => ({
  title: translateAdminView('items.title'),
  items: filteredItems.value,
  itemsCountSingular: translateAdminView('items.foundCount', {
    count: filteredItems.value.length
  }),
  itemsCountPlural: translateAdminView('items.foundCountPlural', {
    count: filteredItems.value.length
  }),
  searchPlaceholder: translateAdminView('items.searchPlaceholder'),
  addButtonLabel: translateButtons('addNew')
}))

const stateConfig = computed<StateConfig>(() => ({
  isProcessing: itemProcessing.value,
  initialSearchQuery: searchQuery.value
}))

const categoryConfig = computed<CategoryConfig>(() => ({
  title: translateAdminView('categories.title'),
  addNewLabel: translateAdminView('categories.addNew'),
  placeholder: translateAdminView('categories.placeholder'),
  savingLabel: translateButtons('saving'),
  addLabel: translateButtons('add'),
  emptyMessage: translateAdminView('categories.empty')
}))

function updateSearchQuery(query: string) {
  searchQuery.value = query
}
</script>
