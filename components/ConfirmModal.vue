<script lang="ts" setup>
defineProps<{ title: Task['title'] }>()
const emit = defineEmits(['success'])

const onSuccess = () => emit('success')
</script>

<template>
    <UModal class="fixed inset-0 flex items-center justify-center">
        <UCard>
            <div class="space-y-4">
                <p>You gonna remove <u>{{ title }}</u> task</p>

                <p class="my-4 font-bold">Are you sure?</p>

                <UButton block @click="onSuccess">
                    Yes, remove this task
                </UButton>
            </div>
        </UCard>
    </UModal>
</template>
