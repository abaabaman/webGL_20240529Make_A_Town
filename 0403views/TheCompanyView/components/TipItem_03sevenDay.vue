<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'



const option = {
    // title: {
    //     text: 'Stacked Area Chart'
    // },
    // tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //         type: 'cross',
    //         label: {
    //             backgroundColor: '#6a7985'
    //         }
    //     }
    // },
    legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    // toolbox: {
    //     feature: {
    //         saveAsImage: {}
    //     }
    // },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        // containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            type: 'line',
            stack: 'Total',
            label: {
                show: true,
                position: 'top'
            },
            areaStyle: {},
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};

onMounted(() => {
    var chartDom = document.getElementById('eCharts_03sevenDay');
    var myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
})

</script>

<template>
    <div class="eCharts_03sevenDay">
        <p class="title">七日饲料供给</p>
        <div id="eCharts_03sevenDay" style="width: 320px;height: 240px;"></div>
    </div>
</template>

<style scoped>
.eCharts_03sevenDay {
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
}

#eCharts_03sevenDay {
    position: absolute;
    transform: translateY(-40px);
    user-select: none;
    margin: 10px;
}

p.title {
    position: absolute;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    top: -32px;
    left: 8px;
    text-shadow: 2px 2px 5px rgba(22, 223, 173, 0.859);

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
        width: 100%;
        background-color: #fff;
        box-shadow: 3px 3px 6px #71c1d5db;
        height: 2px;
    }
}
</style>