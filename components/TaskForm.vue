<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const emit = defineEmits(['submit'])

const schema = z.object({
    title: z.string({
        required_error: 'The title is required'
    }),
})

const state = reactive<Task>({
    id: generateId(),
    title: '',
    createdAt: new Date(),
    status: TaskStatuses.notStarted
})

const isValid = computed(() => {
    return validate(state).length === 0 // Check if there are no validation errors
})

const submitState = async () => {
    if (isValid) {
        emit('submit', state)
    }
}

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.title) errors.push({ path: 'title', message: 'Title wasn\'t provided' })
    return errors
}

defineExpose({ state })
</script>

<template>
    <UForm :validate="validate" :schema="schema" :state="state" class="space-y-4" @submit.prevent="submitState">
        <UFormGroup label="Title" name="title" description="Use simple task titles" eager-validation>
            <UInput v-model.trim="state.title" @input="state.title = $event" placeholder="Enter the title for a task" autofocus />
        </UFormGroup>

        <UButton label="Add" type="submit" block />
    </UForm>
</template>