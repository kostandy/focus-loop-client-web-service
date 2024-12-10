<script setup lang="ts">
import { z } from 'zod';
import type { FormError } from '#ui/types';
import type { UInput } from '#build/components';

const emit = defineEmits<{
	(e: 'submit', payload: Task): void;
}>();

const schema = z.object({
	title: z.string({
		required_error: 'The title is required',
	}),
});

const state = reactive<Task>({
	id: generateId(),
	title: '',
	createdAt: new Date(),
	status: TaskStatuses.notStarted,
	startedAt: '',
	completedAt: '',
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
		description="Try to keep it simple"
		eager-validation
	>
		<UInput
			v-model="state.title"
			placeholder="Enter a title for a new task"
			autofocus
			autocomplete="off"
			class="mt-2 focus:scroll-mt-6"
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

	<UButton
		label="Add"
		type="submit"
		:disabled="!isValid"
		block
	/>
</UForm>
</template>
