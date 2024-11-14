import { defineStore } from "pinia";
import { ref, reactive } from "vue";

const webSocket = new WebSocket(`ws://localhost:5555`);
const send = (data) => webSocket.send(JSON.stringify(data)); // 发送消息给服务器

const isShowSign = ref<boolean>(true); // 登录弹窗是否显示
const isShowRule = ref<boolean>(false); // 规则弹窗是否显示
const isShowVote = ref<boolean>(false); // 投票弹窗是否显示

// 黑卡牌
const blackCard = ref({
  id: -1,
  text: "",
  space: 1,
});
const whiteVoteMap = ref({}); // 白票
const whiteCardList = ref([]); // 白卡牌
const roundNum = ref(1);  // 当前轮数
const winnerList = ref<string[]>([]); // 当前回合获胜玩家列表
const playCards = ref([]);    // 当前回合出牌数组
const isDoneCard = ref(false); // 是否出完牌
const voteStatus = ref<'none' | "load" | "ok" | "abandon" | "finsh">("none"); // 投票状态

// 玩家列表
const playerList = ref([
  {
    name: "张学友",
    score: 100,
    isReady: true,
  },
  {
    name: "张q张q张",
    score: 0,
    isReady: true,
  },
  {
    name: "三q三q三qq三q",
    score: 50,
    isReady: false,
  },
  {
    name: "4qqwe三",
    score: 888,
    isReady: true,
  },
]);

export const useCardStore = defineStore("card", () => {

  // 倒计时
  const timer = ref(30);

  // 当前玩家
  const player = reactive({
    name: "",
    id: -1,
    score: 0,
  });

  return {
    send,
    player,
    playCards,
    // isSignIn,
    // signVisible,
    isDoneCard,
    isShowSign,
    isShowRule,
    isShowVote,
    playerList,
    roundNum,
    timer,
    blackCard,
    voteStatus,
    whiteVoteMap,
    whiteCardList,
    winnerList,
  };
});


// 收到服务器消息
webSocket.onmessage = function ({ data }) {
  console.log(JSON.parse(data));
  const { action, round, userList, isSign, isEnd, black, cards, leaveOne, winner } = JSON.parse(data);

  switch (action) {
    case 'sign': {  // 登录
      console.log('sign', userList);
      if (isSign) {
        isShowSign.value = false;
        isShowRule.value = false;
        return
      } else {
        isShowRule.value = true;
        console.log('not sign');
        // return signVisible.value = isSign
      };
      // console.log('sign', 'not sign');

      break;
    };
    case "leave": {
      // TODO: 处理掉线的玩家
      console.log(leaveOne);
      break;
    }
    case 'done': {  // 出完牌
      playerList.value = userList;
      break;
    }
    case 'vote': {  // 投票
      isShowVote.value = true;
      whiteVoteMap.value = black.white;
      voteStatus.value = "load";
      break;
    };
    case 'start': {  // 开始游戏
      playerList.value = userList;
      blackCard.value = black;
      whiteCardList.value = cards;
      break
    };
    case 'next': {  // 下一轮
      winnerList.value = winner;
      voteStatus.value = "finsh";
      if (isEnd) return;
      setTimeout(() => {
        // 切换到下一轮
        playerList.value = userList;
        blackCard.value = black;
        whiteCardList.value = cards;

        // 重置数据
        playCards.value = [];
        isDoneCard.value = false;
        voteStatus.value = "none";
        isShowVote.value = false;
        roundNum.value = round + 1;
      }, 3000);
      break
    }

  }

  // const res = Object.fromEntries(data.split("&").map((e) => e.split("=")));
  // console.log(res);
};