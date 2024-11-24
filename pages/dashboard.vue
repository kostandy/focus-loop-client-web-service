<script setup lang="ts">
import NewTaskDialog from '~/components/NewTaskDialog.vue';

const taskStore = useTaskStore()

// TODO: Uncomment when API is ready
// await callOnce(taskStore.fetch)

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

const submitForm = async (newTask: Task) => {
    console.log('Form is submitting with the following payload:', newTask)

    try {
        taskStore.isLoading = true

        console.log('Adding a task to the store', newTask);

        taskStore.add(newTask)

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
</script>

<template>
    <UContainer as="main">
        <h1>Focus Loop</h1>

        <h2>Tasks</h2>

        <div style="margin-bottom: 8px;">
            <UButton label="Load tasks" @click="taskStore.fetch" />
            &nbsp;
            <UButton label="Create a new task" :disabled="taskStore.isLoading" @click="openNewTaskModal" />
        </div>

        <b v-if="taskStore.isLoading">Loading your tasks...</b>

        <div v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError">
            <template v-if="!taskStore.tasks.length">No tasks are available</template>
            <template v-else>
                <div v-for="task in taskStore.tasks" :id="task.id">
                    <b>{{ task.title }}</b>
                </div>
            </template>
        </div>

        <div v-else-if="!taskStore.isLoading && taskStore.fetchError">
            {{ taskStore.fetchError }}
        </div>
    </UContainer>
</template>