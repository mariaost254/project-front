<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Add New User</h2>
        <button
          @click="close"
          class="text-gray-400 hover:text-white cursor-pointer"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="space-y-4">
        <div
          v-for="field in ['email', 'firstName', 'lastName', 'password']"
          :key="field"
        >
          <label
            :for="field"
            class="block text-sm font-medium text-gray-300 mb-1"
            >{{ field.charAt(0).toUpperCase() + field.slice(1) }}</label
          >
          <input
            :id="field"
            v-model="user[field]"
            :type="field === 'password' ? 'password' : 'text'"
            class="w-full bg-gray-700 border-none rounded p-2 text-white focus:ring-2 focus:ring-indigo-500"
            :placeholder="
              field === 'email'
                ? 'user@example.com'
                : field === 'password'
                ? '••••••••'
                : field.charAt(0).toUpperCase() + field.slice(1)
            "
          />
        </div>
      </div>
      <div class="mt-6">
        <button
          @click="submitUser"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-button cursor-pointer whitespace-nowrap"
        >
          Add User
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { useStore } from "vuex";

const emit = defineEmits(["submit"]);
defineProps({ visible: Boolean });
const store = useStore();

const user = ref({
  email: "",
  firstName: "",
  lastName: "",
  password: "",
});

const close = () => emit("update:visible", false);

const submitUser = () => {
  const { email, firstName, lastName, password } = user.value;
  if (!email || !firstName || !lastName || !password) {
    store.commit("users/pushToast", {
      message: "Please fill all fields",
      type: "error",
    });
    return;
  }
  emit("submit", user.value);
  close();
};
</script>
