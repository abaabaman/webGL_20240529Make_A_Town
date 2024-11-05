<script setup lang="ts">
import { ref, h, watch, onMounted, onBeforeUnmount } from "vue";
import ThreeView from "./ThreeView.vue";

import TipsGrounp from "./components/TipsGrounp.vue";

let bodyTextAnimation = ref(false);
// let aaa = ref(false);
const bodyText = ref<Record<"type" | "title" | "sub" | "content", any>>({
  type: "base",
  title: "",
  sub: "专注母猪产后护理80年",
  content:
    "拥有专业的技术拥有专业的技术拥有专业技术拥术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术",
});
// 右上角介绍框
const introduce = (
  type?: "base" | "lift" | "block" | "wind" | "light",
  options?: { name?: string; cn_name?: string }
) => {
  // 无传参：仅清空
  bodyText.value.type = type || "empty";

  // 有type
  if (type) {
    setTimeout(() => {
      bodyText.value.title = options?.cn_name || options?.name || "信息未获取";
    }, 0);
    bodyTextAnimation.value = true;
  }
};
</script>

<template>
  <main>
    <ThreeView :introduce="introduce" />
    <tips-grounp :bodyText="bodyText" :bodyTextAnimation="bodyTextAnimation" />
  </main>
</template>

<style scoped>
main {
  position: relative;
  height: 100%;
}

.left {
  position: absolute;
  top: 86px;
  left: 16px;
}

.right {
  position: absolute;
  top: 286px;
  right: 16px;
}

p.title {
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  top: -32px;
  left: 8px;
  text-shadow: 2px 2px 5px rgba(22, 223, 173, 0.859);

  &::before {
    display: block;
    position: absolute;
    top: 12px;
    left: -10px;
    content: "";
    width: 4px;
    background-color: #345bc5;
    height: 100%;
  }

  &::after {
    display: block;
    position: absolute;
    top: 12px;
    left: calc(100% + 8px);
    content: "";
    width: 100%;
    background-color: #fff;
    box-shadow: 3px 3px 6px #71c1d5db;
    height: 2px;
  }
}
</style>
