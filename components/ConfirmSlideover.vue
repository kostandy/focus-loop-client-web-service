import { USlideover } from '../.nuxt/components';
<script lang="ts" setup>
import type { Task } from '@/@types/tasks';

defineProps<{ title: Task['title'] }>();
const emit = defineEmits<{
	(e: 'success' | 'close'): void;
}>();

const onSuccess = () => emit('success');
const onClose = () => emit('close');
</script>

<template>
<USlideover
	side="bottom"
	:ui="{ base: 'rounded-t-3xl duration-500 overflow-hidden', height: '' }"
	@close="onClose"
>
	<UCard class="px-2">
		<div class="space-y-4">
			<p>
				Are you sure you want to remove <b>{{ title }}</b>?
			</p>

			<p class="my-4">
				This action cannot be undone
			</p>

			<UButton
				color="rose"
				block
				@click="onSuccess"
			>
				Yes, remove it
			</UButton>
		</div>
	</UCard>
</USlideover>
</template>
