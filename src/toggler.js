import { ref, watch } from "vue";

export const toggler = (isVisible = ref(false)) => {
  const visible = ref(false);

  const show = () => {
    visible.value = true;
  };

  const hide = () => {
    visible.value = false;
  };

  watch(
    isVisible,
    (isEdit) => {
      if (isEdit) {
        show();
      } else {
        hide();
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  return {
    hide,
    show,
    visible,
  };
};
