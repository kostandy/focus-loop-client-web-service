<script setup lang="ts">
import confetti from 'canvas-confetti';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

import { AUDIO_PATHS } from '~/constants/audioConstants';
import { DONATION_LINK } from '~/constants/linkConstants';
import SettingsSlideover from '~/components/Settings/SettingsSlideover.vue';
import NewTaskSlideover from '~/components/NewTaskSlideover.vue';

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
const donationLink = ref(DONATION_LINK);

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

	if (newTask.status === TaskStatuses.inProgress) {
		scrollToID();
	} else if (newTask.status === TaskStatuses.completed) {
		taskCompletitionSound?.value?.play();
		launchConfetti();
	}
};
</script>

<template>
<UContainer
	as="main"
	class="select-none"
	:class="{ 'overflow-hidden': taskStore.hasActiveTask }"
>
	<div class="flex items-end justify-between my-4 px-3">
		<UButton
			:to="donationLink"
			label="Donate 1 TON"
			class="flex w-auto"
			target="_blank"
			leading-icon="i-heroicons-heart"
			size="md"
			variant="link"
			external
			block
		/>

		<UButton
			icon="i-heroicons-cog-6-tooth"
			variant="ghost"
			@click="openSettingsSlideover"
		/>
	</div>

	<div class="sticky top-4 my-12 mx-4 z-20">
		<UButton
			label="Add a Task"
			class="font-bold text-white shadow-lg rounded-full"
			trailing-icon="i-heroicons-plus-solid"
			color="primary"
			block
			:disabled="taskStore.isLoading"
			@click="openNewTaskSlideover"
		/>
	</div>

	<b v-if="taskStore.isLoading">Loading your tasks...</b>

	<div
		v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError"
		class="relative mx-1 z-10"
		:class="{ 'z-30': taskStore.hasActiveTask }"
	>
		<div
			v-if="!taskStore.tasks.length"
			class="flex justify-center py-4 mb-4"
		>
			<DotLottieVue
				style="height: 170px; width: 170px"
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

			<template v-if="!!taskStore.getActiveTask">
				<UDivider
					label="🟢 Focus Now"
					size="lg"
					class="my-6 px-4 scroll-mt-4"
				/>

				<TaskList
					:items="taskStore.getActiveTask ? [taskStore.getActiveTask] : []"
					@remove-item="taskStore.remove"
					@update-item="updateTask"
				/>
			</template>

			<template v-if="taskStore.getWaitingTasks.length">
				<UDivider
					:label="`⏳ Up Next (${taskStore.getWaitingTasks.length})`"
					size="lg"
					class="my-6 px-4"
				/>

				<TaskList
					:items="taskStore.getWaitingTasks"
					@remove-item="taskStore.remove"
					@update-item="updateTask"
				/>
			</template>

			<template v-if="taskStore.getCompletedTasks.length">
				<UDivider
					id="divider--completed"
					:label="`✅ Done & Dusted (${taskStore.getCompletedTasks.length})`"
					size="lg"
					class="sticky bottom-0 py-3 my-3 px-4 scroll-mt-24 opacity-75 hover:cursor-pointer hover:opacity-100 motion-safe:transition-opacity z-20"
					@click="scrollToID('divider--completed')"
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
