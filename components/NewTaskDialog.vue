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
    <UModal>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }" class="-mx-4 px-2">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        New Task
                    </h3>

                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeDialog" />
                </div>
            </template>

            <TaskForm @submit="submitForm" />
        </UCard>
    </UModal>
</template>

<style scoped>
</style>