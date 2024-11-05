<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'

const option11 = {
    legend: {
        type: 'scroll',
        bottom: 10,
        data: (function () {
            var list = [];
            for (var i = 1; i <= 28; i++) {
                list.push(i + 2000 + '');
            }
            return list;
        })()
    },
    radar: {
        indicator: [
            { text: '', max: 700 },
            { text: '', max: 400 },
            { text: '', max: 400 },
            { text: '', max: 500 },
            { text: '', max: 600 }
        ]
    },
    series: (function () {
        var series = [];
        for (var i = 1; i <= 28; i++) {
            series.push({
                type: 'radar',
                symbol: 'none',
                lineStyle: {
                    width: 1
                },
                emphasis: {
                    areaStyle: {
                        color: 'rgba(0,250,0,0.3)'
                    }
                },
                data: [
                    {
                        value: [
                            (40 - i) * 10,
                            (38 - i) * 4 + 60,
                            i * 5 + 10,
                            i * 9,
                            (i * i) / 2
                        ],
                        name: i + ''
                    }
                ]
            });
        }
        return series;
    })()
};

onMounted(() => {
    var chartDom = document.getElementById('ECharts_01');
    var myChart = echarts.init(chartDom);
    option11 && myChart.setOption(option11);
})

</script>

<template>
    <div class="eCharts_01totle">
        <p class="title">第二季度预计产出</p>
        <div class="header">
            <div id="ECharts_01" style="width: 160px;height: 160px;"></div>
            <ul>
                <li>综合成熟率</li>
                <li>最小繁育时间</li>
                <li>均衡消耗比</li>
                <li>平均吸收转换</li>
                <li>综合成熟率</li>
                <li>平均吸收转换</li>
            </ul>
        </div>
        <div class="line"></div>
        <ul class="more">
            <li>
                <h3>本季产量</h3>
                <p>151,642,121千克</p>
            </li>
            <li>
                <h3>本季销量</h3>
                <p>271,642,117千克</p>
            </li>
            <li>
                <h3>季度目标</h3>
                <p>300,000,000千克</p>
            </li>
        </ul>
    </div>
</template>

<style scoped>
/* main {
    height: 100%;
    padding: 50px;
} */

.eCharts_01totle {
    border: 2px solid #345bc5;
    border-top-width: 12px;
    border-left-color: transparent;
    border-right-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: start;
    background-color: #000c;
    background-image: linear-gradient(0deg, #6cf3, rgba(120, 230, 203, 0.123));
    box-shadow: 0px 6px 12px -3px #b5ecfa;
}

.header {
    display: flex;
    align-items: center;
    padding-right: 36px;

    &>ul {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    &>ul li {
        color: #66edffcc;
        font-size: 12px;
    }

    &>ul li::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 4px;
        margin-right: 6px;
        transform: translateY(-4px);
        background-color: #57b3ff4f;
    }
}

.line {
    margin: 0 auto;
    width: calc(100% - 40px);
    border-top: 1px solid #66edff;
}

ul.more {
    padding: 20px 0;
    display: flex;
    justify-content: space-around;


    h3 {
        font-weight: bold;
        font-size: 14px;
        color: #6cfc;
    }

    p {
        color: #6cfc;
        font-size: 10px;
        word-spacing: 6px
    }
}

#container_01totle {
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
    top: -18px;
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