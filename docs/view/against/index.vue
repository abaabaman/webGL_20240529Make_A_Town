<script setup lang="ts">
import userVote from "./userVote.vue";
</script>
<template>
  <user-vote />
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
