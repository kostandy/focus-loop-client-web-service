<script setup lang="ts">
import type { Task } from '@/@types/tasks';

export interface Props {
	isVisible: Ref<boolean>;
	isLoading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: 'success', payload: Task): void;
	(e: 'close'): void;
}>();

const closeDialog = () => emit('close');
const submitForm = (payload: Task) => emit('success', payload);

defineShortcuts({
	escape: {
		usingInput: true,
		whenever: [props.isVisible],
		handler: closeDialog,
	},
});
</script>

<template>
<!-- TODO: Consider using duration 500 for people w/ ASD, and using default duration 300 for people w/ ADHD -->
<USlideover
	:model-value="isVisible.value"
	side="bottom"
	:ui="{ base: 'rounded-t-3xl duration-500 overflow-hidden', height: 'h-auto max-h-dvh' }"
>
	<UCard
		:ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
		class="px-2"
	>
		<template #header>
			<div class="flex items-center justify-between">
				<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
					New Task
				</h3>
			</div>
		</template>

		<div class="flex justify-center text-8xl mb-8">
			📝
		</div>

		<TaskForm @submit="submitForm" />
	</UCard>
</USlideover>
</template>

<style scoped></style>
