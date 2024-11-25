<script setup lang="ts">
import { type Task } from '@/stores/task.js';

defineProps<Task>()
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex justify-between items-center">
                <b>{{ title }}</b>
                <UButton color="green" variant="ghost">Start</UButton>
            </div>
        </template>
    </UCard>
</template>