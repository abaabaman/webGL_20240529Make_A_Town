<template>
  <div class="game-wrap">
    <div class="game-top">
      <!-- 玩家列表 -->
      <div class="player-list-wrap">
        <div class="player-list">
          <div
            v-for="player in playerList"
            :key="player.id"
            class="player-item"
          >
            <div
              :class="player.isReady ? 'player-ready' : 'player-noready'"
            ></div>
            <div class="player-name">{{ player.name }}</div>
            <div class="player-score">{{ player.score }}</div>
          </div>
        </div>
      </div>
      <!-- 黑卡牌 -->
      <div class="black-card-wrap">
        <div class="black-card">
          {{ store.blackCard.text }}
          <Icons icon="black" />
        </div>
      </div>
      <!-- 回合数 -->
      <div class="round-wrap">
        <div class="round-num">
          <div>回合&emsp;{{ store.roundNum }}</div>
        </div>
        <div class="timer">倒计时&emsp;{{ store.timer }}</div>
      </div>
    </div>
    <div class="game-bottom">
      <div class="white-card-wrap">
        <div
          v-for="whiteCard in whiteCardList"
          key="card.id"
          :class="[
            'white-card',
            {
              'white-card-sel': playCards.find(
                (card) => card.id === whiteCard.id
              ),
              'white-card-nohover': isFull,
            },
          ]"
          @click="clickCard(whiteCard)"
        >
          {{ whiteCard.text }}
          <Icons icon="white" />
        </div>
      </div>
      <div class="ready-btn-wrap">
        <div class="ready-btn" @click="play">出牌</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted, onMounted, computed } from "vue";
import { useCardStore } from "./cardStore";
import { storeToRefs } from "pinia";
import Icons from "./icons.vue";
const { showVote } = defineProps(["showVote"]);

// 卡牌全局数据
const store = useCardStore();
const { playerList, blackCard, whiteCardList } = storeToRefs(store);

// 出牌数组
const playCards = ref([]);
// 是否选了足够的牌
const isFull = computed(() => playCards.value.length >= blackCard.value.space);

// 选牌
const clickCard = (card) => {
  const index = playCards.value.findIndex((el) => el.id === card.id);
  if (index === -1) {
    // 当前卡牌未选中
    !isFull.value && playCards.value.push(card);
  } else {
    playCards.value[index] = undefined;
    playCards.value = playCards.value.filter((el) => el !== undefined);
  }
};

// 出牌
const play = () => {
  // alert("出牌：" + playCards.value.map((card) => card.text).join(" - "));
  showVote();
};
</script>

<style scoped>
.game-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .game-top {
    width: 100%;
    min-height: 300px;
    max-height: 45%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex: 1;
    padding-bottom: 16px;
  }
  .game-bottom {
    width: 100%;
    min-height: 360px;
    max-height: 55%;
    /* background-color: aqua; */
    flex: 1;
    display: flex;
  }
}
/* 玩家列表 */
.player-list-wrap {
  width: 240px;
  max-height: 100%;
  .player-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .player-item {
    width: 100%;
    padding: 8px 0;
    /* margin-bottom: 10px; */
    background-color: black;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: white;
    text-align: left;
  }
  .player-ready {
    width: 10px;
    height: 10px;
    border-radius: 50%;
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
  .player-name {
    width: 7.1em;
  }
  .player-score {
    margin-left: 8px;
  }
}
/* 黑卡牌 */
.black-card-wrap {
  min-width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .black-card {
    width: 350px;
    height: 250px;
    padding: 20px 25px;
    border: 2px solid white;
    background-color: black;
    position: relative;
    border-radius: 13px;
    color: white;
    text-align: left;
    font-size: 20px;
    line-height: 1.5;
  }
}
/* 回合数 */
.round-wrap {
  width: 240px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
  .round-num {
    font-size: 24px;
    margin-bottom: 24px;
  }
  .timer {
    font-size: 30px;
  }
}
/* 白卡区域 */
.white-card-wrap {
  flex: 1;
  display: flex;
  justify-content: space-evenly;
}
/* 白卡牌 */
.white-card {
  position: relative;
  width: 250px;
  height: 350px;
  padding: 60px 25px;
  font-size: 18px;
  line-height: 1.5;
  text-align: center;
  font-weight: bold;
  border: 2px solid black;
  background-color: white;
  border-radius: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(0);
  &:hover {
    transform: translateY(-24px);
  }
  &.white-card-nohover {
    cursor: default;
    &:hover {
      transform: translateY(0);
    }
  }
  &.white-card-sel {
    cursor: pointer !important;
    transform: translateY(-24px) !important;
  }
}
/* 准备按钮 */
.ready-btn-wrap {
  width: 240px;
  height: 100%;
  display: flex;
  justify-content: center;
  .ready-btn {
    margin-top: 110px;
    width: 200px;
    height: 120px;
    border-radius: 13px;
    font-size: 32px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    border: 8px solid white;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      border: 8px solid black;
      background-color: white;
      color: black;
    }
  }
}
</style>
