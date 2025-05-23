import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
const API_BASE = process.env.VUE_APP_API_BASE;
const SOCKET_ENDPOINT = process.env.VUE_APP_SOCKET_ENDPOINT;

let stompClient = null;
export default {
  namespaced: true,
  state: () => ({
    users: [],
    toasts: [],
    currentPage: 1,
    itemsPerPage: 10,
    isWebSocketConnected: false,
  }),

  getters: {
    totalPages(state) {
      return Math.ceil(state.users.length / state.itemsPerPage);
    },
    displayedUsers(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      return state.users.slice(start, start + state.itemsPerPage);
    },
    displayedPages(state, getters) {
      const pages = [];
      const maxVisiblePages = 5;
      const total = getters.totalPages;

      let startPage = Math.max(1, state.currentPage - 2);
      let endPage = Math.min(total, startPage + maxVisiblePages - 1);
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) pages.push(i);
      return pages;
    },
  },

  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    addUser(state, user) {
      state.users.push(user);
    },
    removeUser(state, id) {
      state.users = state.users.filter((u) => u.id !== id);
    },
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    pushToast(state, toast) {
      state.toasts.push(toast);
    },
    dismissToast(state, index) {
      state.toasts.splice(index, 1);
    },
    setWebSocketConnected(state, status) {
      state.isWebSocketConnected = status;
    },
  },

  actions: {
    async fetchUsers({ commit }) {
      const { data } = await axios.get(API_BASE);
      commit("setUsers", data);
    },

    async createUser({ commit, dispatch }, user) {
      try {
        const payload = { ...user, action: "ADD" };
        const res = await axios.post(API_BASE, payload);
        dispatch("fetchUsers");
        commit("pushToast", {
          message: `User created has been submitted (Request ID: ${res.data.requestId})`,
          type: "success",
        });
      } catch (e) {
        commit("pushToast", { message: "Error creating user", type: "error" });
      }
    },

    async deleteUser({ commit, dispatch }, user) {
      try {
        const payload = { ...user, action: "DELETE" };
        const res = await axios.post(API_BASE + "/delete", payload);
        commit("pushToast", {
          message: `User deletion has been submitted (Request ID: ${res.data.requestId})`,
          type: "success",
        });
        await dispatch("fetchUsers");
      } catch (e) {
        commit("pushToast", { message: "Error deleting user", type: "error" });
      }
    },

    connectWebSocket({ commit, dispatch }) {
      if (stompClient && stompClient.active) return;

      stompClient = new Client({
        webSocketFactory: () => new SockJS(SOCKET_ENDPOINT),
        reconnectDelay: 5000,

        onConnect: () => {
          commit("setWebSocketConnected", true);
          console.log("Connected to WebSocket");

          stompClient.subscribe("/topic/user-status", async (message) => {
            const data = JSON.parse(message.body);

            await dispatch("fetchUsers");

            commit("pushToast", {
              message: `${data.action} confirmed for ${data.email} (ID: ${data.requestId})`,
              type: "success",
            });
          });
        },

        onStompError: (frame) => {
          console.error("STOMP error", frame.headers.message);
          commit("pushToast", {
            message: "WebSocket error occurred",
            type: "error",
          });
        },

        onWebSocketClose: () => {
          commit("setWebSocketConnected", false);
          console.warn("🔌 WebSocket connection closed");
        },
      });

      stompClient.activate();
    },
  },
};
