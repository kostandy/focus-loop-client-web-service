<script setup lang="ts">
export interface Props {
    isVisible: Ref<boolean>,
    isLoading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['success', 'close'])

const closeDialog = () => emit('close')

const submitForm = (payload: Task) => {
    emit('success', payload)
}

defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [props.isVisible],
    handler: closeDialog
  }
})

</script>

<template>
    <!-- TODO: Here's a bug when ESC is pressed -->
    <UModal>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        New Task
                    </h3>

                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeDialog" />
                </div>
            </template>

            <TaskForm @submit="submitForm" />

            <template #footer>
                <UButton :disabled="isLoading" :loading="isLoading" @click="submitForm">
                    <template v-if="isLoading">
                        Creating your task...
                    </template>

                    <template v-else>
                        Create a task
                    </template>
                </UButton>
            </template>
        </UCard>
    </UModal>
</template>

<style scoped>
</style>