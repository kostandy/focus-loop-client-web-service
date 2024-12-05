<script setup lang="ts">
import { TaskStatuses, type Task } from '@/stores/task.js';
import ConfirmModal from './ConfirmModal.vue';

const props = defineProps<Task>();
const emit = defineEmits<{
	(e: 'changeStatus', status: TaskStatuses): void;
	(e: 'remove', id: Task['id']): void;
}>();

const isNotStarted = computed(() => props.status === TaskStatuses.notStarted);
const isInProgress = computed(() => props.status === TaskStatuses.inProgress);
const isCompleted = computed(() => props.status === TaskStatuses.completed);

const UProgressColor = computed(() => {
	if (isCompleted.value) return 'emerald';
	if (isInProgress.value) return 'sky';
	return 'sky';
});

const toggleActionIcon = computed(() => {
	const iconMap: Record<TaskStatuses, string> = {
		[TaskStatuses.notStarted]: 'play',
		[TaskStatuses.inProgress]: 'stop',
		[TaskStatuses.completed]: 'check-20-solid',
	};
	return `i-heroicons-${iconMap[props.status as TaskStatuses]}`;
});

const toggleActionIconColor = computed(() => (isCompleted.value ? 'emerald' : 'sky'));

const toggleStatus = () => {
	const newStatus = isNotStarted.value ? TaskStatuses.inProgress : TaskStatuses.completed;
	emit('changeStatus', newStatus);
};

const translateX = ref(100); // Default slideover position (fully hidden)
const startX = ref(0);
const opacity = ref(0);
const actionsHasShown = ref(false);
const moveSwipeTriggered = ref(false);

const startSwipe = (e: TouchEvent) => {
	startX.value = e.touches[0].clientX;
};

const calculateSwipeValues = (deltaX: number) => {
	const newTranslateX = Math.max(0, Math.min(100, 100 - Math.abs(deltaX)));
	actionsHasShown.value = newTranslateX === 0;
	opacity.value = actionsHasShown.value ? 1 : 0;
	return newTranslateX;
};

const moveSwipe = throttle(async (e: TouchEvent) => {
	moveSwipeTriggered.value = true;

	const deltaX = e.touches[0].clientX - startX.value;
	translateX.value = calculateSwipeValues(deltaX);

	await nextTick();
}, 100);

const endSwipe = (e: TouchEvent) => {
	if (startX.value && !moveSwipeTriggered.value) {
		const deltaX = e.changedTouches[0].clientX - startX.value;
		translateX.value = calculateSwipeValues(deltaX);
	}
	translateX.value = translateX.value <= 80 ? 0 : 100; // Fully reveal or hide actions based on swipe threshold
	moveSwipeTriggered.value = false; // Reset moveSwipeTriggered state
};

const remove = () => emit('remove', props.id);

const modal = useModal();

const displayConfirmationDialog = () => {
	modal.open(ConfirmModal, {
		title: props.title,
		onSuccess() {
			modal.close();

			translateX.value = 100; // Hide the actions menu

			remove();
		},
	});
};
</script>

<template>
<UCard
	class="relative overflow-hidden rounded-full pr-4"
	@touchstart.passive="startSwipe"
	@touchmove.passive="moveSwipe"
	@touchend.passive="endSwipe"
>
	<div class="relative flex items-center">
		<div
			class="absolute right-0 flex items-center justify-end h-full w-64 bg-gradient-to-l dark:from-slate-900 dark:from-15% transition z-30"
			:style="{ transform: `translateX(${translateX}px)`, opacity: opacity }"
		>
			<UButton
				icon="i-heroicons-trash"
				size="lg"
				class="rounded-full"
				variant="outline"
				color="rose"
				@touchstart.passive.stop
				@touchmove.passive.stop
				@touchend.passive.stop
				@click="displayConfirmationDialog"
			/>
		</div>

		<UButton
			:icon="toggleActionIcon"
			:color="toggleActionIconColor"
			:disabled="isCompleted"
			size="lg"
			class="mr-4 rounded-full"
			variant="outline"
			@click="toggleStatus"
		/>

		<div class="relative w-full overflow-hidden z-10">
			<p class="text-lg font-bold break-normal">
				{{ title }}
			</p>

			<UProgress
				class="my-1"
				:value="100"
				:color="UProgressColor"
				size="sm"
			/>

			<div class="flex items-center">
				<UIcon
					v-if="isInProgress"
					name="i-heroicons-sparkles-20-solid"
					color="text-yellow"
					class="mr-1"
				/>

				<small>
					<template v-if="isNotStarted"> Ready to begin </template>
					<template v-else-if="isInProgress"> In progress... </template>
					<template v-else-if="isCompleted"> Completed </template>
					<template v-else> Something went wrong... </template>
				</small>
			</div>
		</div>
	</div>
</UCard>
</template>
