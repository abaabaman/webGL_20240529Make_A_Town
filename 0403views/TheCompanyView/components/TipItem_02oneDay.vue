<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'



const option = {
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        // containLabel: true

    },
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: ['FX01', 'FY01', 'FY03', 'FYz1', 'FY6', 'FYc', 'FY0'],
        axisLine: {
            show: false
        }
    },
    series: [
        {
            // name: 'Direct',
            type: 'bar',
            stack: 'total',
            emphasis: {
                focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
        },
        {
            type: 'bar',
            stack: 'total',

            emphasis: {
                focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            type: 'bar',
            stack: 'total',

            emphasis: {
                focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            type: 'bar',
            stack: 'total',

            emphasis: {
                focus: 'series'
            },
            data: [150, 212, 201, 154, 190, 330, 410]
        },
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
        }
    ]
};

onMounted(() => {
    var chartDom = document.getElementById('ECharts_02oneDay');
    var myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
})

</script>

<template>
    <div class="eCharts_02oneDay">
        <p class="title">单日产出</p>
        <div id="ECharts_02oneDay" style="width: 160px;height: 260px;"></div>
        <div class="title">
            <p class="count">31,421 kg</p>
        </div>
    </div>
</template>

<style scoped>
.eCharts_02oneDay {
    position: relative;
    margin-top: 40px;
    width: 180px;
    height: 260px;
    border: 2px solid #345bc5;
    border-top-width: 12px;
    border-right-color: #66edff6c;
    border-left-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: start;
    background-color: #000c;
    background-image: linear-gradient(0deg, #6cf3, rgba(120, 230, 203, 0.123));
    box-shadow: 0px 6px 12px -3px #b5ecfa;
}

div.title {
    position: absolute;
    width: 80%;
    bottom: 10px;
    font-weight: bold;
    margin-left: 16px;
    color: rgb(184, 207, 251);
}

p.count {
    font-weight: lighter;
    color: rgba(255, 255, 95, 0.54);
    background-color: #cf31164d;
    margin-top: 6px;
    text-align: center;
    font-size: 12px;
}


#ECharts_02oneDay {
    position: absolute;
    transform: translateY(-60px);
    user-select: none;
    margin: 10px;
    width: 160px;
    height: 160px;
}

p.title {
    position: absolute;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    top: -32px;
    left: 8px;
    text-shadow: 4px 4px 5px rgba(7, 90, 69, 0.938);

    &::before {
        display: block;
        position: absolute;
        top: 12px;
        left: -10px;
        content: '';
        width: 4px;
        background-color: #345bc5;
        height: 100%;
    }

    &::after {
        display: block;
        position: absolute;
        top: 12px;
        left: calc(100% + 8px);
        content: '';
        width: 40%;
        background-color: #fff;
        box-shadow: 3px 3px 6px #71c1d5db;
        height: 2px;
    }
}
</style>