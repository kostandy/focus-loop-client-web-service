<script lang="ts" setup>
import { TaskStatuses, type Task } from '@/stores/task.js';

import ConfirmSlideover from './ConfirmSlideover.vue';

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

const actionIcon = computed(() => (item: Task) => {
	const iconMap: Record<TaskStatuses, string | undefined> = {
		[TaskStatuses.notStarted]: 'play',
		[TaskStatuses.inProgress]: 'hand-thumb-up-20-solid',
		[TaskStatuses.completed]: 'check-20-solid',
	};
	return `i-heroicons-${iconMap[item.status as TaskStatuses]}`;
});

const actionColor = computed(() => (item: Task) => (isInProgress(item) ? 'sky' : 'emerald'));

const toggleStatus = (item: Task, status?: TaskStatuses) => {
	const newStatus = status || (isNotStarted(item) ? TaskStatuses.inProgress : TaskStatuses.completed);
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
	class="mb-8 scale-95 transition-transform duration-500"
	:class="{
		'scale-100 shadow-xl z-50': isInProgress(item),
	}"
	@swiped="displayConfirmSlideover(item.id)"
	@remove="displayConfirmSlideover(item.id)"
>
	<div
		class="flex flex-col items-center mr-6 z-20 cursor-pointer"
		:class="{ 'motion-safe:animate-pulse': isNotStarted(item) || isInProgress(item) }"
		@click="toggleStatus(item)"
	>
		<UButton
			:icon="actionIcon(item)"
			:color="actionColor(item)"
			:disabled="isCompleted(item)"
			class="rounded-lg"
			variant="link"
			size="xl"
			square
			@click.prevent
		/>
		<small :class="`text-${actionColor(item)}-500`">
			<template v-if="isNotStarted(item)"> Start </template>
			<template v-else-if="isInProgress(item)"> Finish </template>
		</small>
	</div>

	<div class="relative w-full overflow-hidden z-10">
		<p class="text-lg capitalize font-bold break-normal">
			{{ item.title }}
		</p>

		<UProgress
			class="my-2"
			:value="100"
			:color="UProgressColor(item)"
			size="sm"
		/>

		<div class="flex items-center justify-between">
			<UBadge
				variant="soft"
				:color="UProgressColor(item)"
			>
				<template v-if="isNotStarted(item)">
					Ready to begin
				</template>
				<template v-else-if="isInProgress(item)">
					<UIcon
						name="i-heroicons-sparkles-20-solid"
						color="text-yellow"
						class="mr-2"
					/>
					In progress...
				</template>
				<template v-else-if="isCompleted(item)">
					Completed
				</template>
				<template v-else>
					Something went wrong...
				</template>
			</UBadge>

			<UButton
				v-if="isInProgress(item)"
				variant="ghost"
				color="sky"
				label="Cancel"
				class="opacity-50 hover:opacity-100 transition-opacity"
				:padded="false"
				@click="toggleStatus(item, TaskStatuses.notStarted)"
			/>
		</div>
	</div>
</TaskListItemSwipeable>
</template>

<style scoped></style>
