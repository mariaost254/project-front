<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">User Management</h1>
        <button
          @click="openAddUserModal"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-button flex items-center cursor-pointer whitespace-nowrap"
        >
          <i class="fas fa-plus mr-2"></i> Add User
        </button>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                #
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                First Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Last Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Password
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr
              v-for="(user, index) in displayedUsers"
              :key="user.id"
              class="hover:bg-gray-600 cursor-pointer"
            >
              <td class="px-6 py-4 whitespace-nowrap text-left">
                {{ startIndex + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left">
                {{ user.firstName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left">
                {{ user.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left">
                {{ maskPassword(user.password) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left">
                <button
                  @click="confirmDeleteUser(user)"
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-colors duration-200"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-gray-400">
                No users found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg"
      >
        <div class="flex items-center">
          <p class="text-sm text-gray-400">
            Showing <span class="font-medium">{{ startIndex + 1 }}</span> to
            <span class="font-medium">{{
              Math.min(endIndex, users.length)
            }}</span>
            of <span class="font-medium">{{ users.length }}</span> users
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 rounded-button cursor-pointer whitespace-nowrap',
              currentPage === 1
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white',
            ]"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <div
            v-for="page in displayedPages"
            :key="page"
            class="flex items-center"
          >
            <button
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-button cursor-pointer whitespace-nowrap',
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white',
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-1 rounded-button cursor-pointer whitespace-nowrap',
              currentPage === totalPages
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white',
            ]"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    <AddUserModal
      v-if="showAddUserModal"
      v-model:visible="showAddUserModal"
      @submit="handleAddUser"
    />
    <DeleteUserModal
      v-if="showDeleteModal"
      v-model:visible="showDeleteModal"
      :user="userToDelete"
      @confirm="deleteUser"
    />
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";

import AddUserModal from "../components/AddUserModal.vue";
import DeleteUserModal from "../components/DeleteUserModal.vue";
import ToastContainer from "../components/ToastContainer.vue";

const store = useStore();

const users = computed(() => store.state.users.users);
const displayedPages = computed(() => store.getters["users/displayedPages"]);
const currentPage = computed(() => store.state.users.currentPage);
const totalPages = computed(() => store.getters["users/totalPages"]);
const displayedUsers = computed(() => store.getters["users/displayedUsers"]);

const startIndex = computed(
  () => (currentPage.value - 1) * store.state.users.itemsPerPage
);
const endIndex = computed(
  () => startIndex.value + store.state.users.itemsPerPage
);

onMounted(() => {
  store.dispatch("users/fetchUsers");
});

const showAddUserModal = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

const openAddUserModal = () => {
  showAddUserModal.value = true;
};

const handleAddUser = (user) => {
  store.dispatch("users/createUser", user);
};

const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const deleteUser = () => {
  if (userToDelete.value) {
    store.dispatch("users/deleteUser", userToDelete.value);
    showDeleteModal.value = false;
  }
};

const prevPage = () => {
  if (currentPage.value > 1)
    store.commit("users/setCurrentPage", currentPage.value - 1);
};
const nextPage = () => {
  if (currentPage.value < totalPages.value)
    store.commit("users/setCurrentPage", currentPage.value + 1);
};
const goToPage = (page) => {
  store.commit("users/setCurrentPage", page);
};

const maskPassword = (password) => "•".repeat(Math.min(8, password.length));
</script>
<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input:focus,
button:focus {
  outline: none;
}
</style>
