<script setup lang="ts">
    interface Task {
        title: string
    }

    interface Response {
        tasks?: Array<Task>,
        nextCursor?: string | null,
        error?: string
    }

    const isLoading = ref(false)
    const tasks = ref([] as Array<Task>)
    const error = ref('')

    const loadTasks = async () => {
        try {
            isLoading.value = true
            const { data } = await useFetch<Response>('/api/tasks')
            tasks.value = data.value?.tasks || []

            if (data.value?.error) {
                error.value = data.value?.error
            }
        } catch (err) {
            error.value = err as string
        } finally {
            isLoading.value = false   
        }
    }
</script>

<template>
    <main>
        <h1>Focus Loop</h1>
    
        <h2>Tasks</h2>

        <p>
            <button @click="loadTasks">Load tasks</button>
        </p>

        <b v-if="isLoading">Loading your tasks...</b>
        <div v-else-if="!isLoading && tasks && !error">
            <template v-if="!tasks.length">No tasks are available</template>
            <template v-else>
                <code>
                    {{tasks}}
                </code>
            </template>
        </div>
        <div v-else-if="!isLoading && error">
            {{ error }}
        </div>
    </main>
</template>