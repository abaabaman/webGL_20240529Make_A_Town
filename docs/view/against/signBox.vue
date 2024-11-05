<template>
  <el-dialog v-model="visible" width="500">
    <el-form :model="form" @submit.prevent>
      <el-form-item label="玩家名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-button type="primary" @click="onSubmit" native-type="submit">
        进入游戏
      </el-button>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";

const formLabelWidth = "140px";

const visible = defineModel();
const emit = defineEmits(["submit"]);

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const onSubmit = () => {
  console.log(form);
  visible.value = false;
  emit("submit", form.name);
};
</script>
<style scoped></style>
