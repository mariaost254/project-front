<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="mb-4">
        <h2 class="text-xl font-semibold">Confirm Deletion</h2>
        <p class="text-gray-300 mt-2">
          Are you sure you want to delete the user
          <span class="font-semibold">{{ user?.email }}</span
          >?
        </p>
      </div>
      <div class="flex justify-end space-x-3">
        <button
          @click="emit('update:visible', false)"
          class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-button"
        >
          Cancel
        </button>
        <button
          @click="emit('confirm')"
          class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-button"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
defineProps({ user: Object, visible: Boolean });
const emit = defineEmits(["confirm", "update:visible"]);
</script>
