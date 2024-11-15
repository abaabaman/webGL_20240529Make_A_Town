<template>
  <SignBox />
  <div class="table-wrap" v-if="!store.isShowSign">
    <div class="table">
      <GameView />
      <user-vote v-if="store.isShowVote" />
      <ReadyBox v-if="store.isShowReady" />
    </div>
  </div>
</template>
<script setup lang="ts">
import userVote from "./userVote.vue";
import SignBox from "./signBox.vue";
import ReadyBox from "./readyBox.vue";
import GameView from "./gameView.vue";
import { ref, onUnmounted, onMounted } from "vue";
// import { useDark, useToggle } from "@vueuse/core";
import { useCardStore } from "./cardStore.ts";

// const isShowVote = ref<boolean>(false);

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

const 后台内容 = {
  玩家信息: {
    刘德华: {
      总得分: 2,
      总冠军次: 3,
      白卡: ["xxx", "xxx", "xxx"],
    },
    张学友: {
      总得分: 2,
      总冠军次: 3,
      白卡: ["xxx", "xxx", "xxx"],
    },
  },
  黑卡: [
    // 每回合一个对象
    {
      id: "id",
      text: "text", // 文字
      space: 1, // 卡次数量
      white: { 刘德华: ["xxx"], 张学友: ["xxx"] }, // 这回合每个人出的牌
      得票数: { 刘德华: 1, 张学友: 3, 黎明: 3 },
      赢家: ["刘德华", "张学友"],
    },
  ],
};
</script>

<style scoped>
.table-wrap {
  width: 100%;
  height: 100vh;
  padding: 18px 20px;
  text-align: center;
  overflow: hidden;
  background-color: #999;
  .table {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
