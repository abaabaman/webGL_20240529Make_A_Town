<script setup lang="ts">
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'
import TipItem_04number_li from './TipItem_04number_li.vue';

defineProps(['num', 'g'])
// const num = ref(6)
</script>
<template>
    <main>
        <span class="title">{{ g }}室平均温度(20min):</span>
        <div style="display: flex;">
            <span class="num">{{ num + 20 }}°</span>
            <ul class="block">
                <li class="inner use" v-for="i in Array.from({ length: num }, (_, i) => i)" :key="'ok' + i"></li>
                <li class="inner unuse" v-for="i in Array.from({ length: 10 - num }, (_, i) => i)" :key="'no' + i"></li>
            </ul>
        </div>
    </main>
</template>

<style scoped>
main {
    /* min-width: 260px; */
    margin-top: 10px;
    margin-bottom: 10px;
    width: 200px;
}

ul.block {
    display: inline-block;
    overflow: hidden;
    margin-top: 10px;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    border: 1px solid #6cfc;
    outline: 1px solid rgb(179, 114, 240);
    background-image: linear-gradient(90deg, red, rgb(0, 153, 255));
    /* transform: scale(0.6); */
}

li.inner {
    display: inline-block;
    width: 10%;
    height: 20px;
    transform: rotateZ(70deg) translateY(-15px);


    &.use {
        border-bottom: 3px solid rgb(250, 208, 69);
        background-color: rgba(243, 134, 84, 0.438);
    }

    &.unuse {
        border-bottom: 3px solid #029772;
        background-color: rgba(172, 249, 255, 0.781);
    }
}

span.title {
    color: #6ead9ed0;
}

span.num {
    padding-right: 10px;
    font-size: 12px;
    line-height: 26px;
    font-weight: bold;
    color: rgba(217, 235, 61, 0.8);
}
</style>