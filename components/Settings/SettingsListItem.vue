<script lang="ts" setup>
import type { Setting } from '~/@types/settings';

defineProps<{
	item: Setting;
}>();

const emit = defineEmits<{
	(e: 'click'): void;
}>();
</script>

<template>
<li
	class="flex flex-row p-4 items-center justify-between cursor-pointer select-none bg-slate-800 hover:bg-slate-950"
	role="button"
	:aria-disabled="item.disabled"
	@click="!item.disabled && emit('click')"
>
	<div class="flex flex-row items-center">
		<div
			v-if="item.icon"
			class="flex aspect-square rounded-md p-1 mr-2"
			:class="`bg-${item.iconBackgroundColor}-500`"
		>
			<UIcon :name="item.icon" />
		</div>
		<b>{{ item.label }}</b>
	</div>

	<UToggle
		v-if="item.hasToggle"
		:disabled="item.disabled"
		:model-value="item.value as boolean"
		@click.prevent
	/>

	<div v-else-if="item.hasChevron">
		<UIcon name="i-heroicons-chevron-right" />
	</div>
</li>
</template>

<style scoped></style>
