<script setup lang="ts">
import confetti from 'canvas-confetti';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

import { AUDIO_PATHS } from '~/constants/audioConstants';
import SettingsSlideover from '~/components/Settings/SettingsSlideover.vue';
import NewTaskSlideover from '~/components/NewTaskSlideover.vue';

import { type Task, TaskStatuses } from '../@types/tasks';

const settingsStore = useSettingsStore();
const taskStore = useTaskStore();

await callOnce(settingsStore.fetch);
await callOnce(taskStore.fetch);

const settingsSlideover = useSlideover();
const closeSettingsSlideover = () => settingsSlideover.close();
const openSettingsSlideover = () =>
	newTaskSlideover.open(SettingsSlideover, {
		isVisible: newTaskSlideover.isOpen,
		onClose: closeSettingsSlideover,
	});

const newTaskSlideover = useSlideover();
const closeNewTaskSlideover = () => newTaskSlideover.close();
const openNewTaskSlideover = () =>
	newTaskSlideover.open(NewTaskSlideover, {
		isVisible: newTaskSlideover.isOpen,
		isLoading: taskStore.isLoading,
		onSuccess: submitForm,
		onClose: closeNewTaskSlideover,
	});

const { audio: taskCreationSound } = useAudio(AUDIO_PATHS.TASK_CREATION_SUCCESS);
const { audio: taskCompletitionSound } = useAudio(AUDIO_PATHS.TASK_COMPLETION_SUCCESS);

const submitForm = async (newTask: Task) => {
	try {
		taskStore.isLoading = true;

		taskStore.add(newTask);

		// Dophamine release ;)
		taskCreationSound?.value?.play();
	} catch (error) {
		console.error(error);
	} finally {
		taskStore.isLoading = false;
		closeNewTaskSlideover();
	}
};

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

const time = ref(Date.now());
setInterval(() => (time.value = Date.now()), 1000);

const formattedTime = computed(() => {
	const date = new Date(time.value);
	return date.toLocaleTimeString();
});
</script>

<template>
<UContainer
	as="main"
	class="select-none"
	:class="{ 'overflow-hidden': taskStore.hasActiveTask }"
>
	<div class="flex items-center justify-between my-6 px-4">
		<time
			class="flex text-xl z-40"
			:datetime="formattedTime"
		>{{ formattedTime }}</time>

		<UButton
			icon="i-heroicons-cog-6-tooth"
			variant="ghost"
			@click="openSettingsSlideover"
		/>
	</div>

	<div class="sticky top-4 mb-8 mx-4 z-20">
		<UButton
			label="Add a Task"
			class="font-bold shadow-lg rounded-xl"
			icon="i-heroicons-plus-solid"
			color="primary"
			variant="solid"
			block
			:disabled="taskStore.isLoading"
			@click="openNewTaskSlideover"
		/>
	</div>

	<b v-if="taskStore.isLoading">Loading your tasks...</b>

	<div
		v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError"
		class="relative mx-4 z-10"
		:class="{ 'z-30': taskStore.hasActiveTask }"
	>
		<div
			v-if="!taskStore.tasks.length"
			class="flex justify-center py-4 mb-4"
		>
			<DotLottieVue
				style="height: 170px; width: 170px"
				:speed="0.5"
				autoplay
				loop
				src="/animations/curious-duck.json"
			/>
		</div>

		<template v-else>
			<Transition>
				<div
					v-show="taskStore.hasActiveTask"
					class="fixed top-0 left-0 h-full w-full backdrop-blur-sm bg-transparent/30 z-30"
				/>
			</Transition>

			<template v-if="taskStore.getActiveAndWaitingTasks.length">
				<UDivider
					:label="`⏳ Up Next (${taskStore.getActiveAndWaitingTasks.length})`"
					class="mb-6"
				/>

				<TaskList
					:items="taskStore.getActiveAndWaitingTasks"
					@remove-item="taskStore.remove"
					@update-item="updateTask"
				/>
			</template>

			<template v-if="taskStore.getCompletedTasks.length">
				<UDivider
					:label="`✅ Done & Dusted (${taskStore.getCompletedTasks.length})`"
					class="mb-6"
				/>

				<TaskList
					:items="taskStore.getCompletedTasks"
					@remove-item="taskStore.remove"
					@update-item="updateTask"
				/>
			</template>
		</template>
	</div>

	<div v-else-if="!taskStore.isLoading && taskStore.fetchError">
		{{ taskStore.fetchError }}
	</div>
</UContainer>
</template>
