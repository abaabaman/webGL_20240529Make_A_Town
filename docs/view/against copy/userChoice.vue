<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { ref } from "vue";
const props = defineProps(["choiceUser", "disableds"]);

const dialogVisible = ref(true);
const users = ["刘德华", "张学友", "黎明", "郭富城"];
const colors = ["primary", "success", "warning", "danger"];
const choice = (i) => {
  dialogVisible.value = false;
  setTimeout(() => {
    props.choiceUser(i);
  }, 300);
};
</script>
<template>
  <el-dialog v-model="dialogVisible" title="选择你的英雄" class="choice_wrap">
    <template #footer>
      <el-button
        v-for="(name, i) in users"
        :disabled="disableds.map((e) => +e).includes(i)"
        :type="disableds.map((e) => +e).includes(i) ? '' : colors[i]"
        @click="choice(i)"
        class="button"
        >{{ name }}</el-button
      >
      <el-button @click="choice(-1)" class="button">观战</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss">
.choice_wrap {
  width: 422px;
}
@media (max-width: 800px) {
  .choice_wrap {
    width: 200px;
    .button {
      display: block;
      text-align: center;
      margin-left: 0;
      width: 100%;
      height: 36px;
      margin-bottom: 12px;
    }
  }
}
</style>
