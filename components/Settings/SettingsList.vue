<script lang="ts" setup>
import type { Setting } from '~/@types/settings';

interface SettingsItem {
	key: Setting['key'];
	icon?: string;
	label: string;
	iconBackgroundColor?: string;
	value: boolean | string | number | undefined;
	hasToggle?: boolean;
	hasChevron?: boolean;
	disabled?: boolean;
}

defineProps<{
	items: Partial<SettingsItem>[];
}>();

const emit = defineEmits<{
	(e: 'item-click', key: Setting['key']): void;
}>();

const handleItemClick = (key: Setting['key']) => {
	emit('item-click', key);
};
</script>

<template>
<ul class="flex flex-col list-none divide-y divide-slate-700 rounded-xl overflow-hidden">
	<SettingsListItem
		v-for="item in items"
		:key="item.label"
		:icon="item.icon"
		:icon-background-color="item.iconBackgroundColor"
		:label="item.label"
		:has-toggle="item.hasToggle"
		:value="item.value"
		:has-chevron="item.hasChevron"
		:disabled="item.disabled"
		@click="handleItemClick(item.key as Setting['key'])"
	/>
</ul>
</template>

<style scoped></style>
