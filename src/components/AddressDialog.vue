<script setup>
// 新增 / 編輯地址的對話框，會員中心和結帳頁共用
// 用法：<AddressDialog v-model="show" :address="item" @saved="onSaved" />
// address 有傳就是編輯，沒傳（null）就是新增；儲存成功後會 emit('saved', 地址 id)
import { ref, reactive, computed, watch } from 'vue'
import { addAddressAPI, updateAddressAPI, defaultFlag, notDefaultFlag } from '@/apis/address'
import { twProvinceCode, twRegionOptions } from '@/utils/taiwanRegion'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  address: { type: Object, default: null },
  // 編輯時預先打開「預設地址」開關
  makeDefault: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const regionOptions = twRegionOptions
const tagOptions = ['家裡', '公司', '學校']

// 接口的 addressTags 是以英文逗號分隔的字串
const splitTags = (str) => (str ? str.split(',').filter(Boolean) : [])

const formRef = ref()
const cascaderRef = ref()
const submitting = ref(false)

const createForm = () => ({
  receiver: '',
  contact: '',
  region: [], // [縣市代碼, 區代碼]
  address: '',
  postalCode: '',
  addressTags: [],
  isDefault: false
})
const form = reactive(createForm())

const rules = {
  receiver: [{ required: true, message: '請輸入收貨人姓名', trigger: 'blur' }],
  contact: [
    { required: true, message: '請輸入聯絡電話', trigger: 'blur' },
    // 台灣手機（09 開頭共 10 碼）。要編輯課程的大陸舊資料，可改成 /^(09\d{8}|1[3-9]\d{9})$/
    { pattern: /^09\d{8}$/, message: '請輸入正確的手機號碼', trigger: 'blur' }
  ],
  region: [
    { type: 'array', required: true, min: 2, message: '請選擇縣市與行政區', trigger: 'change' }
  ],
  address: [{ required: true, message: '請輸入詳細地址', trigger: 'blur' }],
  addressTags: [
    { type: 'array', required: true, min: 1, message: '請至少選擇一個地址標籤', trigger: 'change' }
  ],
  postalCode: [
    { required: true, message: '請輸入郵遞區號', trigger: 'blur' },
    { pattern: /^\d{3,6}$/, message: '郵遞區號為 3～6 位數字', trigger: 'blur' }
  ]
}

// 每次打開對話框，依有沒有傳地址決定是新增還是編輯
watch(visible, (val) => {
  if (!val) return
  const item = props.address
  if (!item) {
    Object.assign(form, createForm())
    return
  }
  Object.assign(form, {
    receiver: item.receiver,
    contact: item.contact,
    // 舊資料若不是台灣地區（代碼對不上選單），清空讓使用者重新選擇
    region: item.provinceCode === twProvinceCode ? [item.cityCode, item.countyCode] : [],
    address: item.address,
    postalCode: item.postalCode ?? '',
    addressTags: splitTags(item.addressTags),
    isDefault: props.makeDefault || item.isDefault === defaultFlag
  })
})

// 選好行政區後，自動帶入郵遞區號（3 碼）
const onRegionChange = (val) => {
  if (val?.length === 2) form.postalCode = val[1]
}

// 把表單轉成接口要的格式
const buildBody = () => {
  const [cityCode, countyCode = ''] = form.region
  // 用級聯選擇器取得選中的文字，組成 fullLocation
  const nodes = cascaderRef.value?.getCheckedNodes(true) ?? []
  return {
    receiver: form.receiver.trim(),
    contact: form.contact.trim(),
    provinceCode: twProvinceCode,
    cityCode,
    countyCode,
    address: form.address.trim(),
    postalCode: form.postalCode.trim(),
    addressTags: form.addressTags.join(','),
    isDefault: form.isDefault ? defaultFlag : notDefaultFlag,
    fullLocation: nodes[0]?.pathLabels.join(' ') ?? ''
  }
}

const submit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const body = buildBody()
    if (!body.fullLocation) {
      ElMessage.warning('找不到對應的地區，請重新選擇所在地區')
      return
    }
    let id
    if (props.address) {
      id = props.address.id
      await updateAddressAPI(id, { ...body, id })
      ElMessage.success('地址已更新')
    } else {
      const res = await addAddressAPI(body)
      id = res.result.id
      ElMessage.success('地址已新增')
    }
    visible.value = false
    emit('saved', id)
  } catch {
    // 錯誤提示已由 axios 響應攔截器處理
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="address ? '編輯地址' : '新增地址'"
    width="560px"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="收貨人" prop="receiver">
        <el-input v-model="form.receiver" maxlength="20" placeholder="請輸入姓名" />
      </el-form-item>
      <el-form-item label="聯絡電話" prop="contact">
        <el-input v-model="form.contact" maxlength="11" placeholder="請輸入手機號碼" />
      </el-form-item>
      <el-form-item label="所在地區" prop="region">
        <el-cascader
          ref="cascaderRef"
          v-model="form.region"
          :options="regionOptions"
          filterable
          placeholder="縣市 / 行政區"
          style="width: 100%"
          @change="onRegionChange"
        />
      </el-form-item>
      <el-form-item label="詳細地址" prop="address">
        <el-input v-model="form.address" maxlength="100" placeholder="街道、門牌、樓層等" />
      </el-form-item>
      <el-form-item label="郵遞區號" prop="postalCode">
        <el-input v-model="form.postalCode" maxlength="6" placeholder="請輸入郵遞區號" />
      </el-form-item>
      <el-form-item label="地址標籤" prop="addressTags">
        <el-select v-model="form.addressTags" multiple placeholder="請選擇（可多選）" style="width: 100%">
          <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>
      <el-form-item label="預設地址">
        <el-switch v-model="form.isDefault" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">儲存</el-button>
    </template>
  </el-dialog>
</template>