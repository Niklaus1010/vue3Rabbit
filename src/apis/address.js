import httpInstance from "@/utils/http"

// 接口文件：isDefault 0 是預設、1 不是
export const defaultFlag = 0
export const notDefaultFlag = 1

// 獲取收貨地址
export const getAddressListAPI = () => {
  return httpInstance({
    url: '/member/address'
  })
}

// 添加收貨地址
// data: { receiver, contact, provinceCode, cityCode, countyCode, address,
//         postalCode, addressTags, isDefault, fullLocation }
export const addAddressAPI = (data) => {
  return httpInstance({
    url: '/member/address',
    method: 'POST',
    data
  })
}

// 修改收貨地址
export const updateAddressAPI = (id, data) => {
  return httpInstance({
    url: `/member/address/${id}`,
    method: 'PUT',
    data
  })
}

// 刪除收貨地址
export const delAddressAPI = (id) => {
  return httpInstance({
    url: `/member/address/${id}`,
    method: 'DELETE'
  })
}