import pluginVue from "eslint-plugin-vue";

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["pages/**/*.vue", "layouts/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
]);
