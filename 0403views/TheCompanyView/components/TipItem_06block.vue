<script setup lang="ts">
defineProps(["arr"]);
// const num = ref(6)
</script>
<template>
  <main>
    <!-- <span class="title">{{ g }}室平均温度(20min):</span> -->
    <!-- <div style="display: flex;">
            <span class="num">{{ num + 20 }}°</span>
            <ul class="block">
                <li class="inner use" v-for="i in Array.from({ length: num }, (_, i) => i)" :key="'ok' + i"></li>
                <li class="inner unuse" v-for="i in Array.from({ length: 10 - num }, (_, i) => i)" :key="'no' + i"></li>
            </ul>
        </div> -->
    <ul class="block" v-for="(num, index) in arr">
      <p class="err">{{ index + 1 }} 组</p>
      <li
        class="inner use"
        v-for="i in Array.from({ length: 10 - num }, (_, i) => i)"
        :key="'no' + i"
      ></li>
      <li
        class="inner unuse"
        v-for="i in Array.from({ length: num }, (_, i) => i)"
        :key="'ok' + i"
      ></li>
    </ul>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  /* min-width: 260px; */
  /* margin-top: 30px;
    margin-bottom: 10px; */
  min-width: 200px;
}

ul.block {
  position: relative;
  margin: 5px;
  margin-top: 15px;
  width: 60px;
  height: 40px;
  border: 1px solid #93fffa;
  border-top: transparent;
  background-image: linear-gradient(
    0,
    rgb(201, 162, 105),
    rgba(0, 153, 255, 0.103)
  );
  /* background-color: red; */
}

p.err {
  position: absolute;
  /* width: 100%; */
  /* text-align: center; */
  font-size: 8px;
  /* left: -6px; */
  top: -10px;
  color: #b3e0fd;
  /* background-color: #000; */
}

li.inner {
  width: 100%;
  height: 10%;

  &.use {
    border: 1px solid #00000062;
    background-color: rgba(18, 95, 126, 0.219);
  }

  &.unuse {
    border: 1px solid #000000a4;
    /* background-color: rgba(255, 222, 34, 0.795); */
    background-image: linear-gradient(
      90deg,
      rgb(221, 211, 69),
      rgba(206, 228, 107, 0.815),
      rgb(201, 162, 105)
    );
  }
}
</style>