<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'


const props = defineProps({
    key: Number,
    count: String,
    job: String,
    num: Number,
    index: Number,
    isBad: Boolean
})

const number = ref(props.num || 0)
// let myChart1, myChart2

const option1 = {
    series: [
        {
            type: 'pie',
            label: {
                show: false
            },
            color: props.isBad ? 'yellow' : '#6cf',
            radius: ['75%', '80%'],
            // adjust the start and end angle
            startAngle: 60,
            endAngle: 120 + number.value / 3,
            data: [
                { value: 1048 }
            ]
        }
    ]
};

const option2 = {
    series: [
        {
            type: 'pie',
            label: {
                show: false
            },
            color: props.isBad ? 'red' : '#3ec',
            radius: ['65%', '80%'],
            startAngle: -10,
            endAngle: -150 - number.value / 2,
            data: [
                { value: 1048 }
            ]
        }
    ]
};

// const timer = setInterval(() => {
//     number.value += 6
//     // myChart1.setOption(option1);
//     // myChart2.setOption(option2);
// }, 100);

onBeforeUnmount(() => {
    // clearInterval(timer)
})

onMounted(() => {
    var chartDom1 = document.getElementById(`.box${props.index}1`);
    var chartDom2 = document.getElementById(`.box${props.index}2`);
    var myChart1 = echarts.init(chartDom1);
    var myChart2 = echarts.init(chartDom2);
    option1 && myChart1.setOption(option1);
    option2 && myChart2.setOption(option2);
})

</script>

<template>
    <div class="eCharts_04number_li">
        <!-- <p class="title">七日饲料供给</p> -->
        <p class="count">{{ count }}</p>
        <p class="text">{{ job }}</p>
        <div :id="`.box${props.index}1`" style="width: 120px;height: 120px;position: absolute"></div>
        <div :id="`.box${props.index}2`" style="width: 120px;height: 120px;position: absolute"></div>
        <ul>
            <!-- <li>{{ peoples }}</li> -->
        </ul>
    </div>
</template>

<style scoped>
.eCharts_04number_li {
    display: inline-block;
    position: relative;
    margin-right: 8px;
    /* margin-top: 40px; */
    height: 120px;
    width: 120px;
    background-color: #0003;
}

p.text,
p.count {
    position: absolute;
    margin: 0 auto;
    left: 0;
    right: 0;
    margin-top: 65px;
    text-align: center;
    font-size: 8px;
    width: 100px;
    color: #fff;
    font-weight: bold;
    text-shadow: 2px 2px 5px rgba(22, 223, 173, 0.859);

}

p.count {
    font-size: 26px;
    margin-top: 30px;
    /* margin-left: 14px; */
}
</style>