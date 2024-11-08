<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import userChoice from "./userChoice.vue";
import { ref, onBeforeMount, onUnmounted } from "vue";
const users = ["刘德华", "张学友", "黎明", "郭富城"];
defineProps(["userData", "memberData", "ready", "dealer", "msg"]);
</script>
<template>
  <h1>冠军之战</h1>
  <p>当前玩家：{{ users[userData.user] || "观众" }}</p>
  <span v-if="!ready">正在呼朋唤友...</span>
  <!-- <el-button :disabled="dealer" @click="dealer = true" v-if="ready"
    >成为首席发牌员</el-button
  > -->
  <p
    v-if="ready"
    class="count_down"
    v-for="(num, i) in [
      '四大天王已就位',
      '准备开战!',
      ...Array.from({ length: 3 }, (e, i) => i + 1).reverse(),
    ]"
    :style="{ animationDelay: i + 's' }"
  >
    {{ num }}
  </p>
  <p
    v-if="msg.length"
    class="count_down"
    v-for="(num, i) in msg"
    :style="{ animationDelay: i + 's' }"
  >
    {{ num }}
  </p>
</template>

<style scoped>
.count_down {
  position: fixed;
  top: 50%;
  width: 100%;
  margin: auto;
  font-size: 46px;
  font-weight: bold;
  text-align: center;
  color: red;
  animation: message 1.2s ease-in both;
}

@keyframes message {
  0% {
    opacity: 0;
    transform: scale(5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  65% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
