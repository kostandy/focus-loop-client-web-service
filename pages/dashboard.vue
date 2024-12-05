<script setup lang="ts">
import confetti from 'canvas-confetti';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

import NewTaskSlideover from '~/components/NewTaskSlideover.vue';
import { AUDIO_PATHS } from '~/constants/audioConstants';
import { DONATION_LINK } from '~/constants/linkConstants';

const taskStore = useTaskStore();

await callOnce(taskStore.fetch);

const newTaskSlideover = useSlideover();

const closeNewTaskSlideover = () => newTaskSlideover.close();
const openNewTaskSlideover = () =>
	newTaskSlideover.open(NewTaskSlideover, {
		isVisible: newTaskSlideover.isOpen,
		isLoading: taskStore.isLoading,
		onSuccess: submitForm,
		onClose: closeNewTaskSlideover,
	});

const taskCreationSound: Ref<HTMLAudioElement | null> = ref(loadAudio(AUDIO_PATHS.TASK_CREATION_SUCCESS));
const taskCompletitionSound: Ref<HTMLAudioElement | null> = ref(loadAudio(AUDIO_PATHS.TASK_COMPLETION_SUCCESS));
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

const handleTaskStatusChange = (id: Task['id'], newStatus: TaskStatuses) => {
	taskStore.updateStatusWithDates(id, newStatus);

	if (newStatus === TaskStatuses.completed) {
		taskCompletitionSound?.value?.play();
		launchConfetti();
	}
};
</script>

<template>
<UContainer
	as="main"
	:class="{ 'overflow-hidden': taskStore.hasActiveTask }"
>
	<div class="flex items-end justify-between my-4">
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
			disabled
		/>
	</div>

	<div class="sticky top-4 my-12 mx-4 z-20">
		<UButton
			label="Add a Task"
			class="md:w-auto font-bold text-white shadow-lg rounded-full"
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
					v-if="taskStore.hasActiveTask"
					class="fixed top-0 left-0 h-full w-full backdrop-blur-sm bg-transparent/30 z-30"
				/>
			</Transition>

			<TaskCard
				v-for="task in taskStore.getSortedTasks"
				v-bind="task"
				:key="task.id"
				class="mb-8 scale-95 transition"
				:class="{
					'scale-100 shadow-xl z-50': task.status === TaskStatuses.inProgress,
				}"
				@change-status="(payload: TaskStatuses) => handleTaskStatusChange(task.id, payload)"
				@remove="taskStore.remove"
			/>
			<div
				v-if="taskStore.tasks.length > 4"
				class="fixed bottom-0 left-0 right-0 bg-gradient-to-t dark:from-slate-900 h-10"
			/>
		</template>
	</div>

	<div v-else-if="!taskStore.isLoading && taskStore.fetchError">
		{{ taskStore.fetchError }}
	</div>
</UContainer>
</template>
