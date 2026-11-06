<script setup>
// 取消訂單的對話框，訂單列表和訂單詳情共用
// 用法：<CancelOrderDialog v-model="show" :order-id="id" @canceled="重新載入" />
import { ref, computed, watch } from 'vue'
import { cancelOrderAPI } from '@/apis/order'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  orderId: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'canceled'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const reasonList = ['配送地址填錯了', '商品選錯了', '重複下單', '不想買了', '其他']
const reason = ref('')
const submitting = ref(false)

// 每次打開都重新選
watch(visible, (val) => {
  if (val) reason.value = ''
})

const submit = async () => {
  if (!reason.value) {
    ElMessage.warning('請選擇取消原因')
    return
  }
  submitting.value = true
  try {
    await cancelOrderAPI(props.orderId, reason.value)
    ElMessage.success('訂單已取消')
    visible.value = false
    emit('canceled')
  } catch {
    // 錯誤提示已由 axios 響應攔截器處理
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-dialog v-model="visible" title="取消訂單" width="420px" destroy-on-close>
    <p class="tip">取消後無法恢復，請選擇取消原因：</p>
    <el-radio-group v-model="reason" class="reasons">
      <el-radio v-for="item in reasonList" :key="item" :value="item">{{ item }}</el-radio>
    </el-radio-group>
    <template #footer>
      <el-button @click="visible = false">再想想</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">確認取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.tip {
  color: #999;
  margin-bottom: 16px;
}

.reasons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>