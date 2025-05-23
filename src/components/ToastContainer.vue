<template>
  <div class="fixed top-4 right-4 z-50">
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      @click="dismiss(index)"
      :class="[
        'mb-2 p-4 rounded-lg shadow-lg transform transition-all duration-300 max-w-md cursor-pointer hover:opacity-90',
        toast.type === 'success'
          ? 'bg-green-900 text-green-100'
          : 'bg-red-900 text-red-100',
      ]"
    >
      <div class="flex items-center">
        <i
          :class="[
            'mr-2',
            toast.type === 'success'
              ? 'fas fa-check-circle text-green-300'
              : 'fas fa-exclamation-circle text-red-300',
          ]"
        ></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const toasts = computed(() => store.state.users.toasts);
const dismiss = (index) => store.commit("users/dismissToast", index);
</script>
