<script lang="ts" setup>
import type { Setting } from '~/@types/settings';

defineProps<{
	items: Setting[];
}>();

const emit = defineEmits<{
	(e: 'item-click', id: Setting['id']): void;
}>();

const handleItemClick = (id: Setting['id']) => {
	emit('item-click', id);
};
</script>

<template>
<ul class="flex flex-col list-none divide-y divide-slate-700 rounded-xl overflow-hidden">
	<SettingsListItem
		v-for="item in items"
		:key="item.id"
		:item="item"
		@click="handleItemClick(item.id as Setting['id'])"
	/>
</ul>
</template>

<style scoped></style>
