<script setup lang="ts">
import NewTaskDialog from '~/components/NewTaskDialog.vue';
import { AUDIO_PATHS } from '~/constants/audioConstants';
import { DONATION_LINK } from '~/constants/linkConstants';
import confetti from 'canvas-confetti';

const taskStore = useTaskStore()

await callOnce(taskStore.fetch)

const newTaskModal = useModal()

const closeNewTaskModal = () => newTaskModal.close()
const openNewTaskModal = () => newTaskModal.open(NewTaskDialog, {
    isVisible: newTaskModal.isOpen,
    isLoading: taskStore.isLoading,
    onSuccess: submitForm,
    onClose: closeNewTaskModal,
})

const taskCreationSound: Ref<HTMLAudioElement | null> = ref(loadAudio(AUDIO_PATHS.TASK_CREATION_SUCCESS));
const taskCompletitionSound: Ref<HTMLAudioElement | null> = ref(loadAudio(AUDIO_PATHS.TASK_COMPLETION_SUCCESS));
const donationLink = ref(DONATION_LINK);

const submitForm = async (newTask: Task) => {
    try {
        taskStore.isLoading = true

        taskStore.add(newTask);

        // Dophamine release ;)
        taskCreationSound?.value?.play();
    } catch (error) {
        console.error(error)
    } finally {
        taskStore.isLoading = false
        closeNewTaskModal()
    }
}

const launchConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
    });
};

const setTaskStatus = (id: Task['id'], newStatus: TaskStatuses) => {
    const task = taskStore.getTaskById(id);
    if (task) {
        taskStore.update(id, { ...task, status: newStatus });

        if (newStatus === TaskStatuses.completed) {
            taskCompletitionSound?.value?.play();
            launchConfetti()
        }
    }
}
</script>

<template>
    <UContainer as="main">
        <div class="flex items-end justify-between my-4">
            <UButton :to="donationLink" label="Donate 1 TON" class="flex w-auto" target="_blank"
                leading-icon="i-heroicons-heart" size="md" variant="link" external block />

            <UButton icon="i-heroicons-cog-6-tooth" variant="ghost" disabled />
        </div>

        <div class="sticky top-4 my-6 mx-2 z-20">
            <UButton label="Add a Task" class="md:w-auto font-bold shadow-lg bg-slate-900 border rounded-full"
                trailing-icon="i-heroicons-plus-solid" variant="ghost" color="white" block :disabled="taskStore.isLoading"
                @click="openNewTaskModal" />
        </div>

        <b v-if="taskStore.isLoading">Loading your tasks...</b>

        <div v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError" class="relative mx-1 z-10">
            <template v-if="!taskStore.tasks.length">No tasks are available</template>
            <template v-else>
                <TaskCard v-for="task in taskStore.tasks" v-bind="task" class="mb-8"
                    @change-status="payload => setTaskStatus(task.id, payload)" @remove="taskStore.remove" />
                <div v-if="taskStore.tasks.length > 4"
                    class="fixed bottom-0 left-0 right-0 bg-gradient-to-t dark:from-slate-900 h-10"></div>
            </template>
        </div>

        <div v-else-if="!taskStore.isLoading && taskStore.fetchError">
            {{ taskStore.fetchError }}
        </div>
    </UContainer>
</template>