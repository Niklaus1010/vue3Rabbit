<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderAPI } from '@/apis/pay'
import { useCountDown } from '@/composables/useCountDown'
import { twProvinceCode, formatLocation } from '@/utils/taiwanRegion'
import CancelOrderDialog from '@/components/CancelOrderDialog.vue'

const route = useRoute()
const router = useRouter()
const { formatTime, start } = useCountDown()

const order = ref({})
const loading = ref(true)
const showCancel = ref(false)

const getOrder = async () => {
  loading.value = true
  try {
    const res = await getOrderAPI(route.params.id)
    order.value = res.result
    // 待付款才需要倒數
    if (order.value.orderState === 1 && order.value.countdown > 0) {
      start(order.value.countdown)
    }
  } finally {
    loading.value = false
  }
}

onMounted(getOrder)

// 訂單狀態
const stateMap = {
  1: '待付款',
  2: '待發貨',
  3: '待收貨',
  4: '待評價',
  5: '已完成',
  6: '已取消'
}
const stateText = computed(() => stateMap[order.value.orderState] ?? '')

// 進度條：提交訂單 → 完成付款 → 商品發貨 → 確認收貨
const stepList = ['提交訂單', '完成付款', '商品發貨', '確認收貨']
const activeStep = computed(() => {
  const stepMap = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 4 }
  return stepMap[order.value.orderState] ?? 0
})

// 金額欄位的標題：已取消的訂單沒有付過款，不能寫「實付款」
const amountLabel = computed(() => {
  if (order.value.orderState === 1) return '應付總額：'
  if (order.value.orderState === 6) return '訂單金額：'
  return '實付款：'
})

const payTypeMap = { 1: '線上付款', 2: '貨到付款' }
const deliveryMap = {
  1: '不限送貨時間：週一至週日',
  2: '工作日送貨：週一至週五',
  3: '雙休日、假日送貨：週六至週日'
}

// 收貨地址：後端只存「台灣省 + 街道」，縣市與行政區用代碼還原
const addressText = computed(() => {
  const item = order.value
  if (!item.receiverAddress) return ''
  if (item.provinceCode === twProvinceCode) {
    const location = formatLocation(item)
    if (location) {
      const street = item.receiverAddress.replace(/^[台臺][灣湾]省\s*/, '')
      return `${location} ${street}`
    }
  }
  return item.receiverAddress
})
</script>

<template>
  <div class="order-detail">
    <div class="top">
      <el-button link @click="router.push('/member/order')">← 返回訂單列表</el-button>
    </div>

    <el-skeleton :loading="loading || !order.id" animated :rows="10">
      <template #default>
        <!-- 訂單狀態 -->
        <div class="status">
          <h3>{{ stateText }}</h3>
          <template v-if="order.orderState === 1">
            <p v-if="order.countdown > 0">
              請在 <b>{{ formatTime }}</b> 內完成付款，逾時訂單將自動取消
            </p>
            <p v-else>付款時間已截止</p>
            <div class="ops">
              <el-button
                v-if="order.orderState === 1 && order.countdown > 0"
                type="primary"
                @click="router.push({ path: '/pay', query: { id: order.id } })"
              >立即付款</el-button>
              <el-button @click="showCancel = true">取消訂單</el-button>
            </div>
          </template>
          <el-steps
            v-if="order.orderState !== 6"
            class="steps"
            :active="activeStep"
            align-center
            finish-status="success"
          >
            <el-step v-for="step in stepList" :key="step" :title="step" />
          </el-steps>
        </div>

        <!-- 訂單資訊 -->
        <h4 class="title">訂單資訊</h4>
        <ul class="info">
          <li><span>訂單編號：</span>{{ order.id }}</li>
          <li><span>下單時間：</span>{{ order.createTime }}</li>
          <li v-if="order.payTime"><span>付款時間：</span>{{ order.payTime }}</li>
          <li v-if="order.consignTime"><span>發貨時間：</span>{{ order.consignTime }}</li>
          <li v-if="order.endTime"><span>完成時間：</span>{{ order.endTime }}</li>
          <li v-if="order.closeTime"><span>關閉時間：</span>{{ order.closeTime }}</li>
          <li><span>付款方式：</span>{{ payTypeMap[order.payType] }}</li>
          <li><span>配送時間：</span>{{ deliveryMap[order.deliveryTimeType] }}</li>
        </ul>

        <!-- 收貨資訊 -->
        <h4 class="title">收貨資訊</h4>
        <ul class="info">
          <li><span>收貨人：</span>{{ order.receiverContact }}</li>
          <li><span>聯絡電話：</span>{{ order.receiverMobile }}</li>
          <li><span>收貨地址：</span>{{ addressText }}</li>
        </ul>

        <!-- 商品清單 -->
        <h4 class="title">商品資訊</h4>
        <table class="goods">
          <thead>
            <tr>
              <th>商品</th>
              <th width="140">單價</th>
              <th width="100">數量</th>
              <th width="140">小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.skus" :key="item.id">
              <td>
                <div class="goods-info">
                  <img :src="item.image" alt="" />
                  <div>
                    <p>{{ item.name }}</p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td>NT${{ item.curPrice?.toFixed(2) }}</td>
              <td>{{ item.quantity }}</td>
              <td>NT${{ (item.curPrice * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 金額 -->
        <div class="amount">
          <p><span>商品總額：</span>NT${{ order.totalMoney?.toFixed(2) }}</p>
          <p><span>運費：</span>NT${{ order.postFee?.toFixed(2) }}</p>
          <p class="pay">
            <span>{{ amountLabel }}</span>
            NT${{ order.payMoney?.toFixed(2) }}
          </p>
        </div>
      </template>
    </el-skeleton>

    <CancelOrderDialog v-model="showCancel" :order-id="order.id" @canceled="getOrder" />
  </div>
</template>

<style scoped lang="scss">
.order-detail {
  background: #fff;
  min-height: 600px;
  padding: 0 40px 40px;

  .top {
    height: 60px;
    display: flex;
    align-items: center;
  }

  .status {
    text-align: center;
    padding: 30px 0 20px;
    border-bottom: 1px solid #f5f5f5;

    h3 {
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 12px;
    }

    p {
      color: #999;
      margin-bottom: 16px;

      b {
        color: $priceColor;
        font-weight: 400;
      }
    }

    .ops {
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    .steps {
      margin: 30px auto 10px;
      max-width: 700px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 400;
    line-height: 60px;
    border-bottom: 1px solid #f5f5f5;
  }

  .info {
    padding: 15px 0;

    li {
      line-height: 34px;
      color: #666;

      span {
        color: #999;
      }
    }
  }

  .goods {
    width: 100%;
    border-collapse: collapse;

    th {
      background: #f5f5f5;
      font-weight: 400;
      padding: 12px;
    }

    td {
      padding: 16px 12px;
      text-align: center;
      border-bottom: 1px solid #f5f5f5;
    }

    td:first-child {
      text-align: left;
    }

    .goods-info {
      display: flex;
      align-items: center;
      gap: 16px;

      img {
        width: 70px;
        height: 70px;
      }

      .attr {
        color: #999;
        margin-top: 4px;
      }
    }
  }

  .amount {
    text-align: right;
    padding-top: 20px;

    p {
      line-height: 34px;

      span {
        color: #999;
      }
    }

    .pay {
      font-size: 20px;
      color: $priceColor;
    }
  }
}
</style>