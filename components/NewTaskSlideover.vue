<script setup lang="ts">
// TODO: Replace Dialog component to the Slideover component
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

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

const clicks = ref(0);
const isDebugSectionVisible = ref(false);
const simpleInputValue = ref('');
const displayDebugSection = () => {
	clicks.value++;

	if (clicks.value === 5) {
		isDebugSectionVisible.value = true;
	}
};
</script>

<template>
<!-- TODO: Consider using duration 500 for people w/ ASD, and using default duration 300 for people w/ ADHD -->
<USlideover
	:model-value="isVisible.value"
	side="bottom"
	:ui="{ base: 'rounded-t-3xl duration-500 overflow-hidden', height: '' }"
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

		<div
			class="flex justify-center py-4 mb-4"
			@click="displayDebugSection"
		>
			<DotLottieVue
				style="height: 170px; width: 170px"
				autoplay
				loop
				src="/animations/drawing-duck.json"
			/>
		</div>

		<div
			v-if="isDebugSectionVisible"
			class="flex flex-col mb-4 w-full"
		>
			<small class="mb-2">value: {{ simpleInputValue }}</small>
			<UInput v-model="simpleInputValue" />
		</div>
		<TaskForm @submit="submitForm" />
	</UCard>
</USlideover>
</template>

<style scoped></style>
