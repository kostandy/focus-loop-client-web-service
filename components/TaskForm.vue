<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const emit = defineEmits(['submit'])

const schema = z.object({
    title: z.string({
        required_error: 'The title is required'
    }),
})

type Schema = z.output<typeof schema>

const state = reactive<Task>({
    id: generateId(),
    title: '',
    createdAt: new Date(),
    status: TaskStatuses.notStarted
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    emit('submit', event.data)
}

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.title) errors.push({ path: 'title', message: 'Required' })
    return errors
}

</script>

<template>
    <UForm :validate="validate" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Title" name="title">
            <UInput v-model="state.title" placeholder="Enter the title for a task" autofocus />
        </UFormGroup>
    </UForm>
</template>