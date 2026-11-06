// 放在 src/utils/taiwanRegion.js
// 台灣縣市 / 行政區資料，以及「把地址代碼還原成文字」的工具
import { getData } from '@simoko/tw-zip'

// 後端的 provinceCode / cityCode / countyCode 原本是大陸行政區代碼，台灣沒有對應值，
// 這裡約定：省代碼固定、縣市代碼借用該縣市第一個行政區的郵遞區號、區代碼用該行政區的郵遞區號。
export const twProvinceCode = '710000'

// getData() 回傳 { 台北市: { 中正區: '100', ... }, ... }
// 轉成 el-cascader 要的格式：縣市 → 行政區
export const twRegionOptions = Object.entries(getData()).map(([city, districts]) => ({
  value: Object.values(districts)[0],
  label: city,
  children: Object.entries(districts).map(([name, zip]) => ({ value: zip, label: name }))
}))

// 代碼 → 名稱 的對照表
const cityNameByCode = {}
const districtNameByCode = {}
twRegionOptions.forEach((city) => {
  cityNameByCode[city.value] = city.label
  city.children.forEach((d) => {
    districtNameByCode[d.value] = d.label
  })
})

// 後端會用自己的（大陸）代碼表重新產生 fullLocation，台灣地址只會得到「台灣省」，
// 所以台灣地址改由前端用代碼還原成「縣市 行政區」；其他地址沿用後端的 fullLocation。
export const formatLocation = (item) => {
  if (item.provinceCode === twProvinceCode) {
    const city = cityNameByCode[item.cityCode]
    const district = districtNameByCode[item.countyCode]
    if (city && district) return `${city} ${district}`
  }
  return item.fullLocation ?? ''
}