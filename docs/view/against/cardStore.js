import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useCardStore = defineStore("card", () => {
  // 是否已登录
  const isSignIn = ref(false);

  // 当前轮数
  const roundNum = ref(1);

  // 倒计时
  const timer = ref(30);

  // 当前玩家
  const player = reactive({
    name: "",
    score: 0,
  });

  // 玩家列表
  const playerList = ref([
    {
      id: 1,
      name: "张学友",
      score: 100,
      isReady: true,
    },
    {
      id: 2,
      name: "张q张q张",
      score: 0,
      isReady: true,
    },
    {
      id: 3,
      name: "三q三q三qq三q",
      score: 50,
      isReady: false,
    },
    {
      id: 4,
      name: "4qqwe三",
      score: 888,
      isReady: true,
    },
  ]);

  // 黑卡牌
  const blackCard = ref({
    id: 1,
    text: "国王要替一位公主征婚，你决定让 ____ ____。",
  });

  // 白卡牌
  const whiteCardList = ref([
    {
      id: 1,
      text: "钢铁侠",
    },
    {
      id: 2,
      text: "掏大粪",
    },
    {
      id: 3,
      text: "阿姆斯特朗回旋加速喷气式阿姆斯特朗炮",
    },
    {
      id: 4,
      text: "你是谁？",
    },
  ]);

  return {
    player,
    isSignIn,
    playerList,
    roundNum,
    timer,
    blackCard,
    whiteCardList,
  };
});
