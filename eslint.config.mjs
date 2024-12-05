import pluginVue from 'eslint-plugin-vue';

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
	...pluginVue.configs['flat/recommended'],
	{
		files: ['pages/**/*.vue', 'layouts/**/*.vue'],
		rules: {
			'vue/multi-word-component-names': 'off',
		},
	},
	{
		rules: {
			'vue/html-indent': [
				'error',
				'tab',
				{
					attribute: 1,
					baseIndent: 0,
					alignAttributesVertically: true,
					ignores: [],
				},
			],
			'vue/block-lang': [
				'error',
				{
					script: {
						lang: 'ts',
					},
				},
			],
			'vue/component-api-style': ['error', ['script-setup', 'composition']],
			'vue/define-emits-declaration': ['error', 'type-based'],
		},
	},
]);
