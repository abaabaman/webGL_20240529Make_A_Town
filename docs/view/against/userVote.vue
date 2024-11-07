<script setup lang="ts">
import { ref, onMounted } from "vue";
const timer = 30;
const lastTime = ref(timer);
const btnStatus = ref<"load" | "ok" | "abandon" | "finsh">("load");
const warpStatus = ref<"come" | "out">("come");
const balckCard = ref("如果在课堂上_的话学校生活就结束了");
const cardList = ref([["吃华莱士"], ["暗杀刘波"], ["出卖斯大林"], ["城墙"]]);
const cardChoose = ref(-1);
onMounted(() => {
  setInterval(() => {
    if (btnStatus.value === "load" && lastTime.value < 1) {
      btnStatus.value = "abandon";
      return;
    }
    lastTime.value = lastTime.value - 1;
  }, 1000);
  setTimeout(() => {
    // TODO: 离场时间
    console.log("时间到");
    btnStatus.value = "finsh";
  }, (timer + 2) * 1000);
  setTimeout(() => {
    warpStatus.value = "out";
  }, (timer + 5) * 1000);
});
const chooseCard = (i) => {
  if (["ok", "finsh"].includes(btnStatus.value)) return;
  cardChoose.value = i;
};
const chooseConfirm = () => {
  if (cardChoose.value === -1) return;
  btnStatus.value = "ok";
  // TODO: 上传
};
</script>
<template>
  <div class="warp" :class="warpStatus">
    <div class="cardList">
      <div
        v-for="(card, i) in cardList"
        class="card"
        :class="cardChoose === i && btnStatus !== 'abandon' ? 'chose' : ''"
        @click="chooseCard(i)"
      >
        <div v-for="(sentence, i) in balckCard.split('_')">
          <span>{{ sentence }}</span>
          <span class="keyword" v-if="card[i]">{{ card[i] }}</span>
        </div>
        <div class="winner" v-if="cardChoose === i && btnStatus === 'finsh'">
          刘德华 +1
        </div>
      </div>
    </div>
    <div
      v-if="btnStatus === 'load'"
      class="button load"
      :class="cardChoose === -1 && 'notAllowed'"
      @click="chooseConfirm"
    >
      投票 ({{ lastTime }})
    </div>
    <div class="button" :class="btnStatus" v-else-if="btnStatus !== 'finsh'">
      {{ btnStatus === "abandon" ? "放弃投票!" : "" }}
      {{ btnStatus === "ok" ? "完成投票!" : "" }}
    </div>
  </div>
</template>

<style scoped>
.warp {
  position: relative;
  border: 5px solid #222;
  outline: 5px solid #ccc;
  border-top: none;
  width: 1600px;
  padding: 40px 0 130px;
  margin: auto;
  &.come {
    animation: come 1s;
  }
  &.out {
    animation: out 1s both;
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
    box-shadow: 0 0 12px 5px #f9e639;
    border: 4px solid #ffb253;
  }
  & .keyword {
    color: #fff;
    font-weight: bold;
    padding: 0 8px;
    border-bottom: 1px solid #fff;
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
