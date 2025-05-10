import { ref, onMounted, watch, nextTick, computed, type ComputedRef } from 'vue';
import { Modal, initFlowbite, type ModalOptions } from 'flowbite';

export const useModal = (
  modalId: string,
  options: ModalOptions = {
    placement: 'center',
    backdrop: 'static',
    closable: true,
  }
): {
  isVisible: ComputedRef<boolean>;
  handleShow: () => void;
  handleHide: () => void;
} => {
  const isVisible = ref(false);
  let modal: Modal | null = null;

  onMounted(() => {
    initFlowbite();
    const $modalElement = document.getElementById(modalId);
    if ($modalElement) {
      modal = new Modal($modalElement, options);
    }
  });

  watch(isVisible, async newVal => {
    if (!modal) return;

    if (newVal) {
      await nextTick();
      modal.show();
      nextTick(() => initFlowbite());
    } else {
      modal.hide();
    }
  });

  const handleShow = (): void => {
    isVisible.value = true;
  };

  const handleHide = (): void => {
    isVisible.value = false;
  };

  return {
    isVisible: computed(() => isVisible.value),
    handleShow,
    handleHide,
  };
};
