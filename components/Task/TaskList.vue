<script lang="ts" setup>
import confetti from 'canvas-confetti';
import ConfirmSlideover from '@/components/ConfirmSlideover.vue';
import { type Task, TaskStatuses } from '@/@types/tasks';
import { AUDIO_PATHS } from '@/constants/audioConstants';

const props = defineProps<{
	items: Task[];
}>();

const taskStore = useTaskStore();
const { audio: taskCompletitionSound } = useAudio(AUDIO_PATHS.TASK_COMPLETION_SUCCESS);

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

const isReduceMotionEnabled = useSettings('reduce_motion');
const isActionAnimated = computed(
	() => (item: Task) => (isNotStarted(item) || isInProgress(item)) && !isReduceMotionEnabled,
);

const toggleStatus = (task: Task, status?: TaskStatuses) => {
	const newStatus = status || (isNotStarted(task) ? TaskStatuses.inProgress : TaskStatuses.completed);
	const updatedTask = { ...task, status: newStatus };

	updateTask(updatedTask);
};

const slideover = useSlideover();

const displayConfirmSlideover = (id: Task['id']) => {
	const title = props.items.find((item) => item.id === id)?.title || 'Unrecognized';
	slideover.open(ConfirmSlideover, {
		title,
		onSuccess() {
			slideover.close();
			taskStore.remove(id);
		},
	});
};

// Celebration
const launchConfetti = () => {
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { x: 0.5, y: 0.5 },
	});
};

const updateTask = (newTask: Task) => {
	taskStore.updateStatusWithDates(newTask.id, newTask.status);

	if (newTask.status === TaskStatuses.completed) {
		taskCompletitionSound?.value?.play();
		launchConfetti();
	}
};
</script>

<template>
<TaskListItemSwipeable
	v-for="item in items"
	:key="item.id"
	:task="item"
	class="mb-6 sm:mb-8"
	:class="{
		'shadow-xl z-50': isInProgress(item),
	}"
	@swiped="displayConfirmSlideover(item.id)"
	@remove="displayConfirmSlideover(item.id)"
>
	<div
		class="flex flex-col items-center mr-4 sm:mr-6 z-20 cursor-pointer"
		:class="{ 'motion-safe:animate-pulse': isActionAnimated(item) }"
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
		<p class="text-lg normal-case font-bold break-normal">
			{{ item.title }}
		</p>

		<UProgress
			class="my-2"
			:value="100"
			:color="UProgressColor(item)"
			size="sm"
		/>

		<div class="flex flex-nowrap items-center justify-between">
			<div class="flex flex-initial flex-wrap items-start gap-y-2">
				<UBadge
					class="mr-2"
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

				<template v-if="isNotStarted(item) || isInProgress(item)">
					<UBadge
						v-if="item.isImportant"
						variant="soft"
						color="yellow"
						class="mr-2"
						label="Important"
					/>

					<UBadge
						v-if="item.isUrgent"
						variant="soft"
						color="red"
						class="mr-2"
						label="Urgent"
					/>
				</template>
			</div>

			<UButton
				v-if="isInProgress(item)"
				variant="ghost"
				color="blue"
				label="Cancel"
				class="opacity-70 hover:opacity-100 transition-opacity"
				:padded="false"
				@click="toggleStatus(item, TaskStatuses.notStarted)"
			/>
		</div>
	</div>
</TaskListItemSwipeable>
</template>

<style scoped></style>
