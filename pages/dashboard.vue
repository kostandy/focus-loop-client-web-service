<script setup lang="ts">
const taskStore = useTaskStore()

// await callOnce(taskStore.fetch)

const dialog = useDialog()

const openDialog = () => dialog.value.isVisible = true
const closeDialog = () => {
    console.log('Closing event received');
    
    dialog.value.isVisible = false
}

const audio: Ref<HTMLAudioElement | null> = ref(null)

if (import.meta.client) {
    audio.value = new Audio('/sounds/task-creation-succesful.mp3');
}

const onFormSubmit = async (payload: Task) => {
    console.log('Form is submitting with the following payload:', payload)

    try {
        dialog.value.isLoading = true

        console.log('Adding a task to the store', payload);

        taskStore.add(payload)

        // Play a sound
        if (audio.value) {
            audio.value?.play();
        }
    } catch (error) {
        console.error(error)
    } finally {
        dialog.value.isLoading = false
        closeDialog()
    }
}
</script>

<template>
    <main>
        <h1>Focus Loop</h1>

        <h2>Tasks</h2>

        <div style="margin-bottom: 8px;">
            <button @click="taskStore.fetch">Load tasks</button>
            &nbsp;
            <button :disabled="taskStore.isLoading" @click="openDialog">Create a new one</button>
        </div>

        <NewTaskDialog :is-visible="dialog.isVisible" :is-loading="dialog.isLoading" @submit="onFormSubmit"
            @close="closeDialog" />

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
    </main>
</template>