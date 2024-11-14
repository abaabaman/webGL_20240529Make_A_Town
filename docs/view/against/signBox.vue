<template>
  <el-dialog
    v-model="store.isShowSign"
    width="500"
    :show-close="false"
    :close-on-click-modal="false"
    align-center
  >
    <el-form ref="ruleFormRef" :model="form" @submit.prevent class="sign-form">
      <span class="rule-tip">{{ store.isShowRule ? "爱称被占用" : "" }}</span>
      <el-form-item
        label="你的名称"
        required
        label-width="140px"
        prop="name"
        :rules="[
          { required: true, message: '请输入你的名称', trigger: 'blur' },
        ]"
      >
        <el-input v-model.trim="form.name" autocomplete="off" maxLength="16" />
      </el-form-item>
      <el-button
        class="sign-btn"
        type="primary"
        @click="onSubmit(ruleFormRef)"
        native-type="submit"
      >
        进入游戏
      </el-button>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { FormInstance } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useStorage } from "@vueuse/core";
import { useCardStore } from "./cardStore.ts";

// 卡牌全局数据
const store = useCardStore();

// const visible = ref(true);

// 曾用名
const lastPlayerName = useStorage("last-player-name", "");

const ruleFormRef = ref<FormInstance>();
const form = reactive({
  name: lastPlayerName,
});

// 表单提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      lastPlayerName.value = form.name;
      store.player.name = form.name;
      // visible.value = false;
      // store.player.id = Date.now(); // 时间戳id
      // store.isSignIn = true;
      store.send({
        action: "sign",
        name: form.name,
      });
    }
  });
};

// 如果有上次的玩家名，则自动进入游戏
onMounted(() => {
  if (lastPlayerName.value) {
    // visible.value = false;
    // store.player.name = form.name;
    // store.isSignIn = true;
  }
});
</script>
<style scoped>
.sign-form {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  .sign-btn {
    width: 120px;
    height: 40px;
  }
  .rule-tip {
    color: #934;
    position: absolute;
    top: 8px;
    left: 160px;
    font-size: 14px;
  }
}
</style>
