<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCardStore } from "./cardStore.ts";
const store = useCardStore();
const { player, playerList, blackCard, whiteVoteMap, winnerList, voteStatus } =
  storeToRefs(store);
const timer = 50; // 倒计时
const lastTime = ref(timer);
// const btnStatus = ref<"load" | "ok" | "abandon" | "finsh">("load"); // 投票状态
// const warpStatus = ref<"come" | "out">("come"); // 展示投票窗口
// const blackCard = ref("如果在课堂上_的话学校生活就结束了"); // 黑卡

const cardStatus = () => {
  // winnerList
};

const cardChoose = ref(""); // 投票给谁
onMounted(() => {
  // 弃权
  setInterval(() => {
    if (voteStatus.value === "load" && lastTime.value < 1) {
      voteStatus.value = "abandon";
      const data = {
        action: "vote",
        name: player.value.name,
      };
      store.send(data);
      return;
    }
    lastTime.value = lastTime.value - 1;
  }, 1000);
});
const chooseCard = (user) => {
  if (["ok", "finsh"].includes(voteStatus.value)) return;
  cardChoose.value = user;
};
const chooseConfirm = () => {
  if (cardChoose.value === "") return;
  voteStatus.value = "ok";
  console.log(whiteVoteMap.value);

  const data = {
    action: "vote",
    name: player.value.name,
    choose: cardChoose.value,
  };
  store.send(data);
  // TODO: 上传
};
</script>
<template>
  <div class="warp" :class="voteStatus">
    <div class="cardList">
      <div
        v-for="(user, i) in Object.keys(whiteVoteMap)"
        class="card"
        :class="[
          cardChoose === user && voteStatus !== 'abandon' ? 'chose' : '',
          winnerList.includes(user) && voteStatus === 'finsh' ? 'winner' : '',
        ]"
        @click="chooseCard(user)"
      >
        <!-- {{ whiteVoteMap[user] }} -->
        <span v-for="(sentence, i) in blackCard.text.split('_')">
          <span>{{ sentence }}</span>
          <span class="keyword" v-if="whiteVoteMap[user][i]">{{
            whiteVoteMap[user][i].text
          }}</span>
        </span>
        <div
          class="winner"
          v-if="winnerList.includes(user) && voteStatus === 'finsh'"
        >
          {{ user }} +1
        </div>
      </div>
    </div>
    <div
      v-if="voteStatus === 'load'"
      class="button load"
      :class="cardChoose === '' && 'notAllowed'"
      @click="chooseConfirm"
    >
      投票 ({{ lastTime }})
    </div>
    <div class="button" :class="voteStatus" v-else-if="voteStatus !== 'finsh'">
      {{ voteStatus === "abandon" ? "放弃投票!" : "" }}
      {{ voteStatus === "ok" ? "完成投票!" : "" }}
    </div>
  </div>
</template>

<style scoped>
.warp {
  position: absolute;
  background-color: #fff;
  border: 5px solid #222;
  outline: 5px solid #ccc;
  border-top: none;
  width: 1600px;
  padding: 40px 0 130px;
  top: 0;
  left: calc(50% - 800px);
  &.load {
    animation: come 1s;
  }
  &.finsh {
    animation: out 1s 2.5s both;
  }
}

.cardList {
  margin: 0px 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  position: relative;
  width: 600px;
  height: 160px;
  background-color: #222;
  border: 4px solid #444;
  color: #ccc;
  margin: 20px 40px 30px;
  padding: 24px;
  border-radius: 4px;
  font-size: 22px;
  cursor: pointer;
  &.chose {
    border: 4px solid #ffb253;
  }
  & .keyword {
    color: #fff;
    font-weight: bold;
    padding: 0 8px;
    border-bottom: 1px solid #fff;
  }
  &.winner {
    background-color: #fff;
    color: #222;
  }
  &.winner .keyword {
    color: #222;
    font-weight: bold;
    padding: 0 8px;
    border-bottom: 1px solid #222;
  }
  .winner {
    position: absolute;
    text-align: center;
    color: #9e2e2e;
    font-size: 16px;
    width: 100%;
    left: 0;
    bottom: -36px;
    animation: winnerGet 3s both;
  }
}
.button {
  position: absolute;
  background-color: #ffffff;
  left: calc(50% - 90px);
  bottom: 50px;
  width: 180px;
  height: 42px;
  line-height: 40px;
  color: #333;
  text-align: center;
  border: 2px solid #333;
  border-radius: 4px;

  &:hover {
    background-color: #3cc58e;
  }
  &.load {
    cursor: pointer;
    &.notAllowed {
      background-color: #fff;
      cursor: not-allowed;
    }
  }

  &.abandon {
    user-select: none;
    background-color: #ccc;
    border-color: #666;
  }

  &.ok {
    user-select: none;
    background-color: #6aedb9;
    border-color: #265334;
  }
}
@keyframes winnerGet {
  0% {
    transform: translateY(5px);
    opacity: 0;
  }
  20% {
    transform: translateY(0);
    opacity: 1;
  }
  80% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-5px);
    opacity: 0;
  }
}
@keyframes come {
  0% {
    display: none;
  }
  1% {
    transform: translateY(-20px);
    opacity: 0;
    display: block;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes out {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  99% {
    transform: translateY(-20px);
    opacity: 0;
    display: block;
  }
  100% {
    display: none;
  }
}
</style>
