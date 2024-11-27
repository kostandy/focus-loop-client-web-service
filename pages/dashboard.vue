<script setup lang="ts">
import NewTaskDialog from '~/components/NewTaskDialog.vue';
import { AUDIO_PATHS } from '~/constants/audioConstants';
import { TONVIEWER_WALLET_LINK } from '~/constants/linkConstants';

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
const tonviewerWalletLink = ref(TONVIEWER_WALLET_LINK);

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

const setTaskStatus = (id: Task['id'], newStatus: TaskStatuses) => {
    const task = taskStore.getTaskById(id);
    if (task) {
        taskStore.update(id, { ...task, status: newStatus });
        
        if (newStatus === TaskStatuses.completed) {
            taskCompletitionSound?.value?.play();
        }
    }
}
</script>

<template>
    <UContainer as="main">
        <small>dev-alpha</small>
        <h1 class="my-4 text-2xl font-bold text-center">Focus Loop</h1>

        <UButton label="Donate 1 TON" :to="tonviewerWalletLink" target="_blank" leading-icon="i-heroicons-heart" variant="outline" external block />

        <div class="sticky top-4 my-6 z-10">
            <UButton label="Add a Task" class="md:w-auto font-bold shadow-lg rounded-full" trailing-icon="i-heroicons-plus-solid" block :disabled="taskStore.isLoading" @click="openNewTaskModal" />
        </div>

        <b v-if="taskStore.isLoading">Loading your tasks...</b>

        <div v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError" class="relative">
            <template v-if="!taskStore.tasks.length">No tasks are available</template>
            <template v-else>
                <div class="overflow-hidden">
                    <div class="relative">
                        <TaskCard
                            v-for="task in taskStore.tasks"
                            v-bind="task"
                            class="mb-8"
                            @change-status="payload => setTaskStatus(task.id, payload)"
                        />
                        <div v-if="taskStore.tasks.length > 4" class="fixed bottom-0 left-0 right-0 bg-gradient-to-t dark:from-slate-900 h-10"></div>
                    </div>
                </div>
            </template>
        </div>

        <div v-else-if="!taskStore.isLoading && taskStore.fetchError">
            {{ taskStore.fetchError }}
        </div>
    </UContainer>
</template>