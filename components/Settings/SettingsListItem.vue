<script lang="ts" setup>
import type { Setting } from '~/@types/settings';

const { value = false } = defineProps<{
	icon?: string;
	iconBackgroundColor?: string;
	label?: string;
	hasToggle?: boolean;
	value?: Setting['value'];
	hasChevron?: boolean;
	disabled?: boolean;
}>();

const emit = defineEmits<{
	(e: 'click'): void;
}>();
</script>

<template>
<li
	class="flex flex-row p-4 items-center justify-between cursor-pointer select-none bg-slate-800 hover:bg-slate-950"
	role="button"
	:aria-disabled="disabled"
	@click="!disabled && emit('click')"
>
	<div class="flex flex-row items-center">
		<div
			v-if="icon"
			class="flex aspect-square rounded-md p-1 mr-2"
			:class="`bg-${iconBackgroundColor}-500`"
		>
			<UIcon :name="icon" />
		</div>
		<b>{{ label }}</b>
	</div>

	<UToggle
		v-if="hasToggle"
		:model-value="value as boolean"
		@click.prevent
	/>

	<div v-else-if="hasChevron">
		<UIcon name="i-heroicons-chevron-right" />
	</div>
</li>
</template>

<style scoped></style>
