<script setup lang="ts">
import NewTaskDialog from '~/components/NewTaskDialog.vue';

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

const audio: Ref<HTMLAudioElement | null> = ref(null)

if (import.meta.client) {
    audio.value = new Audio('/sounds/task-creation-succesful.mp3');
}

const tonviewerWalletLink = ref("https://tonviewer.com/focus-loop.ton")

const submitForm = async (newTask: Task) => {
    try {
        taskStore.isLoading = true

        taskStore.add(newTask);

        // Dophamine release ;)
        if (audio.value) {
            audio.value?.play();
        }
    } catch (error) {
        console.error(error)
    } finally {
        taskStore.isLoading = false
        closeNewTaskModal()
    }
}

const setTaskStatus = (id: Task['id'], status: TaskStatuses) => {
    console.log('setTaskStatus', id, status);
    const task = taskStore.getTaskById(id);
    if (task) {
        taskStore.update(id, { ...task, status });
    }
}
</script>

<template>
    <UContainer as="main">
        <small>dev-alpha</small>
        <h1 class="my-4 text-4xl font-bold text-center">Focus Loop</h1>

        <UAlert :actions="[{ label: 'Donate', to: tonviewerWalletLink, target: '_blank', icon: 'i-heroicons-heart', external: true, block: true }]"
            title="👋🏻 Hey, stranger! Such a fascinating Rabbit&nbsp;Hole, isn't? 💫"
            description="🎯 Achieve your goals with focus, fun, and lasting progress - no matter the challenges"
            class="tracking-wide text-center md:text-start mb-4" color="primary" variant="subtle" />

        <div class="my-6">
            <UButton label="Add a Task" class="md:w-auto font-bold rounded-full" size="xl" trailing-icon="i-heroicons-plus-solid" block :disabled="taskStore.isLoading" @click="openNewTaskModal" />
        </div>

        <b v-if="taskStore.isLoading">Loading your tasks...</b>

        <div v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError">
            <template v-if="!taskStore.tasks.length">No tasks are available</template>
            <template v-else>
                <TaskCard
                    v-for="task in taskStore.tasks"
                    v-bind="task"
                    class="mb-8"
                    @change-status="payload => setTaskStatus(task.id, payload)"
                />
            </template>
        </div>

        <div v-else-if="!taskStore.isLoading && taskStore.fetchError">
            {{ taskStore.fetchError }}
        </div>
    </UContainer>
</template>