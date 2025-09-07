import { ref, onMounted, watch, nextTick } from 'vue'
import { Modal, initFlowbite, type ModalOptions } from 'flowbite'

export function useModal(
  modalId: string,
  options: ModalOptions = {
    placement: 'center',
    backdrop: 'static',
    closable: true
  }
) {
  const isVisible = ref(false)
  let modal: Modal | null = null

  onMounted(() => {
    initFlowbite()
    const $modalElement = document.getElementById(modalId)
    if ($modalElement) {
      modal = new Modal($modalElement, options)
    }
  })

  watch(isVisible, async newVal => {
    if (!modal) return

    if (newVal) {
      await nextTick()
      modal.show()
      nextTick(() => initFlowbite())
    } else {
      modal.hide()
    }
  })

  function show() {
    isVisible.value = true
  }

  function hide() {
    isVisible.value = false
  }

  return {
    isVisible,
    show,
    hide
  }
}
