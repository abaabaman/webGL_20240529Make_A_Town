<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import SignBox from "./signBox.vue";
import { useDark, useToggle } from "@vueuse/core";

// 进入黑暗模式
const isDark = useDark();
const toggleDark = useToggle(isDark);
onMounted(isDark.value ? () => {} : toggleDark);
onUnmounted(isDark.value ? toggleDark : () => {});

// 当前玩家
const player = ref({
  name: "",
  score: 0,
});

// 是否未登录
const noSignIn = ref(true);

const handleSignIn = (name) => {
  console.log("name", name);
  noSignIn.value = false;
};
</script>
<template>
  <SignBox v-model="noSignIn" @submit="handleSignIn" />
</template>

<style scoped></style>
