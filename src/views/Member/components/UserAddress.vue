<script setup>
// 放在 src/views/Member/components/UserAddress.vue
import { ref, onMounted } from 'vue'
import { getAddressListAPI, updateAddressAPI, delAddressAPI, defaultFlag } from '@/apis/address'
import { formatLocation } from '@/utils/taiwanRegion'
import AddressDialog from '@/components/AddressDialog.vue'

// 地址列表
const addressList = ref([])
const loading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const res = await getAddressListAPI()
    addressList.value = res.result
  } finally {
    loading.value = false
  }
}

onMounted(getList)

// 新增 / 編輯（共用 AddressDialog）
const showForm = ref(false)
const editingAddress = ref(null) // null 代表新增
const makeDefault = ref(false)

const openAdd = () => {
  editingAddress.value = null
  makeDefault.value = false
  showForm.value = true
}

const openEdit = (item, toDefault = false) => {
  editingAddress.value = item
  makeDefault.value = toDefault
  showForm.value = true
}

const splitTags = (str) => (str ? str.split(',').filter(Boolean) : [])

// 設為預設
const setDefault = async (item) => {
  // 舊資料的郵遞區號、地址標籤可能是 null，但修改接口要求必填，
  // 缺的話改開編輯對話框讓使用者補齊（並預先打開「預設地址」開關）
  if (!item.postalCode || !item.addressTags) {
    openEdit(item, true)
    ElMessage.info('請先補齊郵遞區號與地址標籤')
    return
  }
  try {
    await updateAddressAPI(item.id, {
      receiver: item.receiver,
      contact: item.contact,
      provinceCode: item.provinceCode,
      cityCode: item.cityCode,
      countyCode: item.countyCode,
      address: item.address,
      postalCode: item.postalCode,
      addressTags: item.addressTags,
      fullLocation: item.fullLocation,
      isDefault: defaultFlag,
      id: item.id
    })
    ElMessage.success('已設為預設地址')
    await getList()
  } catch {
    // 錯誤提示已由 axios 響應攔截器處理
  }
}

// 刪除
const removeAddress = async (item) => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除「${item.receiver}」的這筆地址嗎？`,
      '刪除地址',
      { type: 'warning', confirmButtonText: '刪除', cancelButtonText: '取消' }
    )
    await delAddressAPI(item.id)
    ElMessage.success('地址已刪除')
    await getList()
  } catch {
    // 使用者取消，或請求失敗（失敗提示已由攔截器處理）
  }
}
</script>

<template>
  <div class="address-page">
    <div class="head">
      <h3>收貨地址</h3>
      <el-button type="primary" @click="openAdd">新增地址</el-button>
    </div>

    <div class="list" v-loading="loading">
      <el-empty
        v-if="!loading && addressList.length === 0"
        description="還沒有收貨地址"
      />

      <div class="item" v-for="item in addressList" :key="item.id">
        <div class="info">
          <p class="who">
            <span class="name">{{ item.receiver }}</span>
            <span class="contact">{{ item.contact }}</span>
            <el-tag v-if="item.isDefault === defaultFlag" type="success" size="small">預設</el-tag>
            <el-tag v-for="tag in splitTags(item.addressTags)" :key="tag" type="info" size="small">{{ tag }}</el-tag>
          </p>
          <p class="addr">{{ formatLocation(item) }} {{ item.address }}</p>
        </div>
        <div class="ops">
          <el-button
            v-if="item.isDefault !== defaultFlag"
            link
            type="primary"
            @click="setDefault(item)"
          >設為預設</el-button>
          <el-button link type="primary" @click="openEdit(item)">編輯</el-button>
          <el-button link type="danger" @click="removeAddress(item)">刪除</el-button>
        </div>
      </div>
    </div>

    <AddressDialog
      v-model="showForm"
      :address="editingAddress"
      :make-default="makeDefault"
      @saved="getList"
    />
  </div>
</template>

<style scoped lang="scss">
.address-page {
  background: #fff;
  min-height: 500px;
  padding: 0 40px 40px;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    border-bottom: 1px solid #f5f5f5;

    h3 {
      font-size: 18px;
      font-weight: 400;
    }
  }

  .list {
    min-height: 200px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    border-bottom: 1px solid #f5f5f5;

    .who {
      display: flex;
      align-items: center;
      gap: 12px;
      line-height: 1;
      margin-bottom: 12px;

      .name {
        font-size: 16px;
        color: #333;
      }

      .contact {
        color: #666;
      }
    }

    .addr {
      color: #999;
      line-height: 1.5;
    }
  }
}
</style>