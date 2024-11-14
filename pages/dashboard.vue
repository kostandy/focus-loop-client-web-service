<script setup lang="ts">
const taskStore = useTaskStore()

await callOnce(taskStore.fetch)
</script>

<template>
    <main>
        <h1>Focus Loop</h1>
    
        <h2>Tasks</h2>

        <p>
            <button @click="taskStore.fetch">Load tasks</button>
        </p>

        <b v-if="taskStore.isLoading">Loading your tasks...</b>
        <div v-else-if="!taskStore.isLoading && taskStore.tasks && !taskStore.fetchError">
            <template v-if="!taskStore.tasks.length">No tasks are available</template>
            <template v-else>
                <code>
                    {{taskStore.tasks}}
                </code>
            </template>
        </div>
        <div v-else-if="!taskStore.isLoading && taskStore.fetchError">
            {{ taskStore.fetchError }}
        </div>
    </main>
</template>