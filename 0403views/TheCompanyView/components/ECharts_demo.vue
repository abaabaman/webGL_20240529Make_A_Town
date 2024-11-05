<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, h, watch, onMounted, onBeforeUnmount } from 'vue'


var option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }
    ]
};

onMounted(() => {
    var chartDom = document.getElementById('container');
    var myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
})

</script>

<template>
    <main>
        <div id="container"></div>
    </main>
</template>

<style scoped>
#container {
    width: 300px;
    height: 300px;
}
</style>