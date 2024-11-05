<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'
import TipItem_01totle from './TipItem_01totle.vue';
import TipItem_02oneDay from './TipItem_02oneDay.vue'
import TipItem_04number from './TipItem_04number.vue';
import TipItem_05temperature from './TipItem_05temperature.vue';
import TipItem_06block from './TipItem_06block.vue';

defineProps(['bodyTextAnimation', 'bodyText'])

</script>

<template>
    <div class="edifice" :class="{ bodyTextAnimation }" v-if="bodyText.type === 'base'">
        <h2>{{ bodyText.title }}</h2>
        <h3>{{ bodyText.sub }}</h3>
        <p>{{ bodyText.content }}</p>
    </div>

    <div class="left" :class="{ bodyTextAnimation }" v-if="bodyText.type === 'base'">
        <!-- <TipItem_01totle g="14A" :num="6" key="1" /> -->
        <TipItem_02oneDay g="21C" :num="5" key="2" />
    </div>


    <div class="edifice" :class="{ bodyTextAnimation }" v-if="bodyText.type === 'lift'">
        <h2>{{ bodyText.title }}</h2>
        <h3>投喂监测人员组长</h3>
        <p class="meg">王明明(工号995271)</p>
        <p class="meg">王明明(工号935327)</p>
        <p class="meg">王明明(工号925127)</p>
        <p class="err">最后锁止时间_ 17:45</p>

    </div>

    <div class="edifice" :class="{ bodyTextAnimation }" v-if="bodyText.type === 'block'">
        <h2>{{ bodyText.title }}</h2>
        <h3>{{ bodyText.sub }}</h3>
        <p>7天饲料均耗时间(0.2T): 6.23h</p>
        <TipItem_06block :arr="[4, 2, 1, 4, 3]" />
        <p class="err">当前残余: 23.4kg</p>
        <p class="meg">上一次投喂时间_ 13:23</p>
        <p class="yel">下一次投喂时间_ 17:30</p>
    </div>

    <div class="edifice" :class="{ bodyTextAnimation }" v-if="bodyText.type === 'light'">
        <h2>{{ bodyText.title }}</h2>
        <h3>{{ bodyText.sub }}</h3>
        <TipItem_05temperature g="14A" :num="6" />
        <TipItem_05temperature g="16B" :num="3" />
        <TipItem_05temperature g="21C" :num="5" />
    </div>

    <div class="edifice" :class="{ bodyTextAnimation }" v-if="bodyText.type === 'wind'">
        <h2>{{ bodyText.title }}</h2>
        <h3>保障通风效率，减少致病菌繁衍速度</h3>
        <p class="about">A、B、C三组轮换风机，共计177可运行机体，进食期间三组同时运行，其余时间两组混转运行。</p>
        <TipItem_04number />
        <p>A组运行良好</p>
        <p class="err">B12检修中(故障时间_14:13)</p>
        <p class="meg">C07离线, C02离线</p>
    </div>
</template>

<style scoped>
.edifice {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 25vw;
    padding: 12px 28px;
    border: 1px solid transparent;
    border-left-color: #5ee;
    border-bottom-color: #3fe;
    background-color: #000c;
    opacity: 0;

    &.bodyTextAnimation {
        animation: inDom 1s ease both;
    }

    h2 {
        color: #3fe;
        font-weight: bold;
    }

    h3 {
        color: #3ee9;
        font-weight: bold;
    }

    p {
        /* margin-top: 16px; */
        color: #3ee9;

        &.yel {
            color: #bb9d71;
        }

        &.err {
            color: #bb7171;
        }

        &.meg,
        &.about {
            color: #88877d;
        }
    }
}

.left {
    position: absolute;
    top: 90px;
    left: 30px;
    opacity: 0;

    &.bodyTextAnimation {
        animation: inDom 1s ease both;
    }
}

@keyframes inDom {
    0% {
        transform: translateY(-30px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>