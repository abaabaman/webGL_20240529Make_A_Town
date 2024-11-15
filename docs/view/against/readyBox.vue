<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCardStore } from "./cardStore.ts";
const store = useCardStore();
const { player, playerList, blackCard, whiteVoteMap, winnerList, voteStatus } =
  storeToRefs(store);

const isReady = ref(false);
</script>
<template>
  <div class="warp">
    <!-- 玩家列表 -->
    <div class="player-list-wrap">
      <ul class="player-list">
        <li v-for="(player, i) in playerList" :key="i" class="player-item">
          <div
            :class="player.isReady ? 'player-ready' : 'player-noready'"
          ></div>
          <div class="player-name">{{ player.name }}</div>
          <div class="player-score">{{ player.score }}</div>
        </li>
      </ul>
    </div>
    <div
      v-if="voteStatus === 'load'"
      class="button load"
      :class="isReady && 'notAllowed'"
    >
      准备
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
.player-list {
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  width: 160px;
  background-color: #ccc;
}
.player-item {
  display: flex;
  width: 160px;
  div {
    margin-left: 15px;
  }
  .player-name {
    text-align: center;
    width: 60px;
  }
  .player-ready {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 7px;
    margin-right: 8px;
    background-color: rgb(83, 223, 83);
  }
  .player-noready {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
    border: 2px solid rgb(218, 189, 135);
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
