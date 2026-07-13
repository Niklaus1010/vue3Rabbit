import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginOxlint from 'eslint-plugin-oxlint';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // 前置
      // 1. 禁用格式化插件 prettier，format on save 關閉
      // 2. 安裝 EsLint 插件
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // 單引號
          semi: false, // 無分號
          printWidth: 80, // 每行寬度至多80字符
          trailingComma: 'none', // 不加對象|數組最後逗號
          endOfLine: 'auto' // 換行符號不限制（win mac 不一致）
        }
      ],
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // vue組件名稱多單詞組成（忽略index.vue）
        }
      ],
      'vue/no-setup-props-destructure': ['off'], // 關閉 props 解構的校驗
      // 💡 添加未定義變量錯誤提示，create-vue@3.6.3 關閉，這里加上是為了支持下一個章節演示。
      'no-undef': 'off'
    },
    globals: {
      ElMessage: 'readonly',
      ElMessageBox: 'readonly',
      ElLoading: 'readonly'
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // {
  //   rules: {
  //     'vue/multi-word-component-names': 'off',
  //   },
  // },
]);
