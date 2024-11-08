<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import userChoice from "./userChoice.vue";
import FightView from "./FightView.vue";
import { ref, onUnmounted } from "vue";
const user = ref(-1);
// const users = ["刘德华", "张学友", "黎明", "郭富城"];
const ready = ref(false);
const dealer = ref(true);
const present = ref([]);
const msg = ref([]);
const msgAdd = (e) => {
  msg.value.push(e);
  setTimeout(() => {
    msg.value.shift();
  }, 2000);
};
// '发牌'|'出题'|'答题'|'评分'
const turnAct = ref<{
  turn: number;
  state: "card" | "question" | "answer" | "appraise";
} | null>(null);
const turnNext = () => {
  if (!turnAct.value) {
    turnAct.value = { turn: 0, state: "card" };
    webSocket.send(`turn=${turnAct.value.turn}&state=${turnAct.value.state}`);
  }
};
const webSocket = new WebSocket(`ws://localhost:5555`);
webSocket.onmessage = function ({ data }) {
  const res = Object.fromEntries(data.split("&").map((e) => e.split("=")));
  console.log(res);
  if (res.users) {
    console.log(res.users);
    present.value = [...new Set(res.users.split(",").filter((e) => e))];
  }
  if (res.msg) {
    msgAdd(res.msg);
  }
  if (res.lifecycle) {
    setTimeout(() => {
      if (res.lifecycle === "ready") {
        msgAdd("四大天王到齐了");
        ready.value = true;
        dealer.value = false;
      }
      if (res.lifecycle === "resume") {
        msgAdd("对局人数大于2,继续战斗");
      }
      if (res.lifecycle === "voer") {
        ready.value = false;
        dealer.value = true;
        msgAdd(" 剩余人数少于2,流局");
      }
    }, 1200);
  }
};

// webSocket.readyState链接状态
const choiceUser = (i) => {
  user.value = i;
  webSocket.send("user=" + i);
  turnNext();
};
onUnmounted(() => webSocket.send("lifecycle=close"));
</script>
<template>
  <user-choice :choiceUser="choiceUser" :disableds="present" />
  <FightView
    :userData="{ user }"
    :memberData="{ present }"
    :ready="ready"
    :msg="msg"
  />
</template>

<style scoped></style>

<!-- 
# 准备
进入游戏
 - 选英雄、观战

准备开始
  - 所有人准备
  - 倒计时3秒
  - 争夺发牌员，无人争夺则随机

# 开始游戏
第零回合
  - 当局计分板清空
  - 告知发牌员

第一回合 a
  - 获取卡牌(10张单词, 5张提问)
  - 发牌员(12张单词，8张提问)
  - 发牌员，提问牌

第一回合 b
  - 玩家，单词牌

第一回合 c
  - 玩家打分
  - 记分牌加分

第三回合 d
  - 游戏结束,赢家是xxx
  - 大积分榜+1

# 结束游戏
 - 所有人准备
 - 倒计时3秒后开始
 -->
