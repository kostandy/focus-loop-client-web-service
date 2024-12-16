<script setup lang="ts">
import { z } from 'zod';
import type { FormError } from '#ui/types';
import { type Task, TaskStatuses } from '@/@types/tasks';

const emit = defineEmits<{
	(e: 'submit', payload: Task): void;
}>();

const schema = z.object({
	title: z.string({
		required_error: 'The title is required',
	}),
	isUrgent: z.boolean(),
	isImportant: z.boolean(),
});

const state = reactive<Task>({
	id: generateId(),
	title: '',
	createdAt: new Date(),
	status: TaskStatuses.notStarted,
	startedAt: '',
	completedAt: '',
	isUrgent: false,
	isImportant: false,
});

const isValid = computed(() => validate(state).length === 0);

const submitState = async () => {
	if (isValid.value) {
		state.title = state.title.trim();
		emit('submit', state);
	}
};

const validate = (state: Task): FormError[] => {
	const errors = [];
	if (!state.title.trim()) errors.push({ path: 'title', message: "Title wasn't provided" });
	return errors;
};

defineExpose({ state });
</script>

<template>
<UForm
	:validate="validate"
	:schema="schema"
	:state="state"
	class="space-y-4"
	@submit.prevent="submitState"
>
	<UFormGroup
		label="Title"
		name="title"
		class="mb-2"
		help="Keep it simple and clear"
	>
		<UInput
			v-model="state.title"
			placeholder="Enter a title for a new task"
			autofocus
			class="mt-2"
			:ui="{ icon: { trailing: { pointer: '' } } }"
		>
			<template #trailing>
				<UButton
					v-show="state.title !== ''"
					color="gray"
					variant="link"
					icon="i-heroicons-x-mark-20-solid"
					:padded="false"
					@click="state.title = ''"
				/>
			</template>
		</UInput>
	</UFormGroup>

	<div class="grid grid-cols-2">
		<UCheckbox
			v-model="state.isUrgent"
			label="Urgent"
			help="Needs immediate attention"
		/>

		<UCheckbox
			v-model="state.isImportant"
			label="Important"
			help="High priority, but not time-sensitive"
		/>
	</div>

	<UButton
		label="Add"
		type="submit"
		:disabled="!isValid"
		block
	/>
</UForm>
</template>
