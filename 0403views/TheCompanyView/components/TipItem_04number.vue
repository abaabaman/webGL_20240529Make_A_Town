<script setup lang="ts">
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'
import TipItem_04number_li from './TipItem_04number_li.vue';

const peoples = ref([
    { count: "1,031", job: 'A组进口平均转速', num: 16 },
    { count: "1,572", job: 'B组出口平均转速', num: 75 },
    { count: "731", job: 'B组出口平均转速', num: -135, isBad: true },
    // { count: "1,279", job: 'A组进口平均转速', num: 56 },
    // { count: 46.7, job: '安保B2队安保经理' },
    // { count: 75.3, job: '饲料选购专员经理' },
    // { count: 94.3, job: '当日值班人员组长' },
])
</script>
<template>
    <main>
        <TipItem_04number_li v-for="(item, i) in peoples" :count="item.count" :isBad="item.isBad" :job="item.job"
            :num="item.num" :key="i" :index="i" />
    </main>
</template>

<style scoped>
main {
    min-width: 260px;
}

/* .eCharts_03sevenDay {
    position: relative;
    margin-top: 40px;
    height: 240px;
    width: 340px;
    border: 2px solid #345bc5;
    border-top-width: 12px;
    border-right-color: #66edff6c;
    border-left-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: start;
    background-image: linear-gradient(0deg, #6cf3, rgba(120, 230, 120, 0.38));
    box-shadow: 0px 6px 12px -3px #b5ecfa;
} */
</style>