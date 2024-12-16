<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

import { AUDIO_PATHS } from '~/constants/audioConstants';
import SettingsSlideover from '~/components/Settings/SettingsSlideover.vue';
import NewTaskSlideover from '~/components/NewTaskSlideover.vue';

import type { Task } from '../@types/tasks';

// Store initialization
const settingsStore = useSettingsStore();
const taskStore = useTaskStore();

await callOnce(settingsStore.fetch);
await callOnce(taskStore.fetch);

// Audio setup
const { audio: taskCreationSound } = useAudio(AUDIO_PATHS.TASK_CREATION_SUCCESS);

// Time handling
const time = ref(Date.now());
setInterval(() => (time.value = Date.now()), 1000);

const formattedTime = computed(() => {
	const date = new Date(time.value);
	return date.toLocaleTimeString();
});

// Slideovers handling
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

// Task management functions
const submitForm = async (newTask: Task) => {
	try {
		taskStore.isLoading = true;
		taskStore.add(newTask);
		taskCreationSound?.value?.play();
	} catch (error) {
		console.error(error);
	} finally {
		taskStore.isLoading = false;
		closeNewTaskSlideover();
	}
};
const isEisenhowerMatrixEnabled = useSettings('eisenhower_matrix');
const links = reactive([
	{ label: 'Do now', to: '#important-urgent-tasks', exact: true, badge: taskStore.getImportantAndUrgentTasks.length },
	{ label: 'Schedule', to: '#important-not-urgent-tasks', badge: taskStore.getImportantAndNotUrgentTasks.length },
	{ label: 'Delegate', to: '#urgent-not-important-tasks', badge: taskStore.getUrgentAndNotImportantTasks.length },
	{
		label: 'Eliminate',
		to: '#not-important-not-urgent-tasks',
		badge: taskStore.getNotImportantAndNotUrgentTasks.length,
	},
]);
</script>

<template>
<UContainer
	as="main"
	class="select-none pb-12"
	:class="{ 'overflow-hidden': taskStore.hasActiveTask }"
>
	<header class="relative mt-4 mb-8 sm:my-6 px-4">
		<div class="flex items-center justify-between mb-8">
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

		<UButton
			label="Add a Task"
			class="font-bold shadow-lg rounded-xl mb-4"
			icon="i-heroicons-plus-solid"
			color="primary"
			variant="solid"
			block
			:disabled="taskStore.isLoading"
			@click="openNewTaskSlideover"
		/>

		<UHorizontalNavigation
			v-if="isEisenhowerMatrixEnabled"
			:links="links"
			:ui="{
				label: '',
			}"
			class="sticky top-16 border-b border-gray-800 bg-gray-900 overflow-x-auto touch-pan-y snap-mandatory whitespace-nowrap no-scrollbar"
		/>
	</header>

	<Transition>
		<div
			v-show="taskStore.hasActiveTask"
			class="fixed top-0 left-0 h-full w-full backdrop-blur-sm bg-transparent/30 z-30"
		/>
	</Transition>

	<b v-if="taskStore.isLoading">Loading your tasks...</b>

	<div
		v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError"
		class="mx-4"
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

		<template v-else-if="isEisenhowerMatrixEnabled">
			<section
				id="important-urgent-tasks"
				class="mb-8"
			>
				<h3 class="text-lg font-medium mb-4">
					<b>Do now</b> — Important & Urgent
				</h3>
				<TaskList :items="taskStore.getImportantAndUrgentTasks" />
				<p
					v-if="!taskStore.getImportantAndUrgentTasks.length"
					class="text-gray-500 text-sm italic text-center"
				>
					No urgent and important tasks - you're on top of your priorities!
				</p>
			</section>

			<section
				id="important-not-urgent-tasks"
				class="mb-8"
			>
				<h3 class="text-lg font-medium mb-4">
					<b>Schedule</b> — Important, not Urgent
				</h3>
				<TaskList :items="taskStore.getImportantAndNotUrgentTasks" />
				<p
					v-if="!taskStore.getImportantAndNotUrgentTasks.length"
					class="text-gray-500 text-sm italic text-center"
				>
					No tasks to schedule - take time to plan what's important but not time-sensitive!
				</p>
			</section>

			<section
				id="urgent-not-important-tasks"
				class="mb-8"
			>
				<h3 class="text-lg font-medium mb-4">
					<b>Delegate</b> — Urgent, not Important
				</h3>
				<TaskList :items="taskStore.getUrgentAndNotImportantTasks" />
				<p
					v-if="!taskStore.getUrgentAndNotImportantTasks.length"
					class="text-gray-500 text-sm italic text-center"
				>
					No tasks to delegate - you're focusing on what's truly important!
				</p>
			</section>

			<section
				id="not-important-not-urgent-tasks"
				class="mb-8"
			>
				<h3 class="text-lg font-medium mb-4">
					<b>Eliminate</b> — neither Important nor Urgent
				</h3>

				<TaskList :items="taskStore.getNotImportantAndNotUrgentTasks" />

				<p
					v-if="!taskStore.getNotImportantAndNotUrgentTasks.length"
					class="text-gray-500 text-sm italic text-center"
				>
					No tasks here - great job prioritizing what matters!
				</p>
			</section>
		</template>

		<template v-else>
			<template v-if="taskStore.getActiveAndWaitingTasks.length">
				<UDivider
					:label="`⏳ Up Next (${taskStore.getActiveAndWaitingTasks.length})`"
					class="mb-6"
				/>

				<TaskList :items="taskStore.getActiveAndWaitingTasks" />
			</template>

			<template v-if="taskStore.getCompletedTasks.length">
				<UDivider
					:label="`✅ Done & Dusted (${taskStore.getCompletedTasks.length})`"
					class="mb-6"
				/>

				<TaskList :items="taskStore.getCompletedTasks" />
			</template>
		</template>
	</div>

	<div v-else-if="!taskStore.isLoading && taskStore.fetchError">
		{{ taskStore.fetchError }}
	</div>
</UContainer>
</template>
