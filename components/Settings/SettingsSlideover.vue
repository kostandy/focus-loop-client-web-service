<script lang="ts" setup>
import { useSettingsUI } from '~/composables/useSettings';

defineProps<{
	isVisible: Ref<boolean>;
}>();

const emit = defineEmits<{
	(e: 'close'): void;
}>();

const { settings, handleItemClick } = useSettingsUI();

const close = () => emit('close');
</script>

<template>
<USlideover
	key="settings"
	:model-value="isVisible.value"
	:ui="{
		width: 'max-w-full',
		height: 'h-screen max-h-full',
	}"
>
	<UCard
		:ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
		class="px-2"
	>
		<template #header>
			<div class="flex items-center justify-between">
				<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
					Settings
				</h3>

				<UButton
					color="gray"
					variant="link"
					size="md"
					icon="i-heroicons-x-mark-20-solid"
					@click="close"
				/>
			</div>
		</template>

		<div class="flex flex-col">
			<SettingsList
				:items="settings"
				@item-click="handleItemClick"
			/>
		</div>
	</UCard>
</USlideover>
</template>

<style scoped></style>
