<template>
  <SignBox />
  <div class="table-wrap" v-if="store.isSignIn">
    <div class="table">
      <GameView :showVote="() => (isShowVote = true)" />
      <user-vote v-if="isShowVote" />
    </div>
  </div>
</template>
<script setup lang="ts">
import userVote from "./userVote.vue";
import SignBox from "./signBox.vue";
import GameView from "./gameView.vue";
import { ref, onUnmounted, onMounted } from "vue";
// import { useDark, useToggle } from "@vueuse/core";
import { useCardStore } from "./cardStore";

const isShowVote = ref<boolean>(false);

// // 进入黑暗模式
// const isDark = useDark();
// const toggleDark = useToggle(isDark);
// onMounted(isDark.value ? () => {} : toggleDark);
// onUnmounted(isDark.value ? toggleDark : () => {});

// 卡牌全局数据
const store = useCardStore();

// 禁用右键菜单和拖拽选中文字
const menuFn = (e) => {
  e.preventDefault();
};
// document.addEventListener("contextmenu", menuFn);
document.addEventListener("selectstart", menuFn);
onUnmounted(() => {
  document.removeEventListener("contextmenu", menuFn);
  document.removeEventListener("selectstart", menuFn);
});
</script>

<style scoped>
.table-wrap {
  width: 100%;
  height: 100vh;
  padding: 18px 20px;
  text-align: center;
  overflow: hidden;
  background-color: black;
  .table {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
