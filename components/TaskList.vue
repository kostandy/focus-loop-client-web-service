<script lang="ts" setup>
import { TaskStatuses, type Task } from '@/stores/task.js';

import ConfirmSlideover from './ConfirmSlideover.vue';
import type TaskListItemSwipeable from './TaskListItemSwipeable.vue';

const props = defineProps<{
	items: Task[];
}>();
const emit = defineEmits<{
	(e: 'removeItem', payload: Task['id']): void;
	(e: 'updateItem', payload: Task): void;
}>();

const isNotStarted = ({ status }: Task) => status === TaskStatuses.notStarted;
const isInProgress = ({ status }: Task) => status === TaskStatuses.inProgress;
const isCompleted = ({ status }: Task) => status === TaskStatuses.completed;

const UProgressColor = computed(() => (item: Task) => {
	if (isCompleted(item)) return 'emerald';
	if (isInProgress(item)) return 'sky';
	return 'sky';
});

const toggleActionIcon = computed(() => (item: Task) => {
	const iconMap: Record<TaskStatuses, string> = {
		[TaskStatuses.notStarted]: 'play',
		[TaskStatuses.inProgress]: 'stop',
		[TaskStatuses.completed]: 'check-20-solid',
	};
	return `i-heroicons-${iconMap[item.status as TaskStatuses]}`;
});

const toggleActionIconColor = computed(() => (item: Task) => (isCompleted(item) ? 'emerald' : 'blue'));

const toggleStatus = (item: Task) => {
	const newStatus = isNotStarted(item) ? TaskStatuses.inProgress : TaskStatuses.completed;
	const newItem = { ...item, status: newStatus };
	emit('updateItem', newItem);
};

const remove = (id: Task['id']) => emit('removeItem', id);

const slideover = useSlideover();

const displayConfirmSlideover = (id: Task['id']) => {
	const title = props.items.find((item) => item.id === id)?.title || 'Unrecognized';
	slideover.open(ConfirmSlideover, {
		title,
		onSuccess() {
			slideover.close();
			remove(id);
		},
	});
};
</script>

<template>
<TaskListItemSwipeable
	v-for="item in items"
	:key="item.id"
	:task="item"
	class="mb-8 scale-95 transition-transform"
	:class="{
		'scale-100 shadow-xl z-50': isInProgress(item),
	}"
	@swiped="displayConfirmSlideover(item.id)"
	@remove="displayConfirmSlideover(item.id)"
>
	<UButton
		:icon="toggleActionIcon(item)"
		:color="toggleActionIconColor(item)"
		:disabled="isCompleted(item)"
		size="lg"
		class="mr-4 z-20"
		variant="outline"
		square
		@click="toggleStatus(item)"
	/>

	<div class="relative w-full overflow-hidden z-10">
		<p class="text-lg font-bold break-normal">
			{{ item.title }}
		</p>

		<UProgress
			class="my-1 pr-8"
			:value="100"
			:color="UProgressColor(item)"
			size="sm"
		/>

		<div class="flex items-center">
			<UIcon
				v-if="isInProgress(item)"
				name="i-heroicons-sparkles-20-solid"
				color="text-yellow"
				class="mr-1"
			/>

			<small>
				<template v-if="isNotStarted(item)">Ready to begin</template>
				<template v-else-if="isInProgress(item)">In progress...</template>
				<template v-else-if="isCompleted(item)">Completed</template>
				<template v-else>Something went wrong...</template>
			</small>
		</div>
	</div>
</TaskListItemSwipeable>
</template>

<style scoped></style>
