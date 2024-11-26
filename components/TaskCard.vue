<script setup lang="ts">
import { TaskStatuses, type Task } from '@/stores/task.js';

const props = defineProps<Task>()
const emit = defineEmits<{ (e: 'changeStatus', status: TaskStatuses): void }>()

const isNotStarted = computed(() => props.status === TaskStatuses.notStarted);
const isInProgress = computed(() => props.status === TaskStatuses.inProgress);
const isCompleted = computed(() => props.status === TaskStatuses.completed);

const toggleActionIcon = computed(() => {
    const iconMap = {
        [TaskStatuses.notStarted]: 'play',
        [TaskStatuses.inProgress]: 'stop',
        [TaskStatuses.completed]: 'trophy',
    };
    return `i-heroicons-${iconMap[props.status]}`
})

const toggleActionIconColor = computed(() => {
    return isCompleted.value ? 'emerald' : 'sky';
})

const toggleStatus = () => {
    const newStatus = isNotStarted.value ? TaskStatuses.inProgress : TaskStatuses.completed;
    emit('changeStatus', newStatus);
}

</script>

<template>
    <UCard class="rounded-full pr-4">
        <div class="flex items-center">
            <UButton
                :icon="toggleActionIcon"
                :color="toggleActionIconColor"
                :disabled="isCompleted"
                size="lg"
                class="mr-4 rounded-full"
                variant="outline"
                @click="toggleStatus"
            />

            <div class="relative w-full overflow-hidden">
                <p class="truncate font-bold">{{ title }}</p>

                <UProgress class="my-1" :value="isInProgress ? undefined : 0" animation="swing" />

                <small class="text-grey">
                    <Transition>
                        <template v-if="isNotStarted">
                            Wait to start
                        </template>
                        <template v-else-if="isInProgress">
                            In progress
                        </template>
                        <template v-else-if="isCompleted">
                            Completed
                        </template>
                        <template v-else>
                            Something went wrong...
                        </template>
                    </Transition>
                </small>
            </div>
        </div>
    </UCard>
</template>