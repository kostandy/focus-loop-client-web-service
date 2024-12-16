<script setup lang="ts">
import type { Task } from '@/@types/tasks';

defineProps<{
	task: Task;
}>();
const emit = defineEmits<{
	(e: 'edit' | 'remove' | 'swiped'): void;
}>();

const dragStartX = ref();
const left = ref(0);
const hasDragged = ref(false);
const startTime = ref(0);
const foregroundContainerElement = useTemplateRef<HTMLElement | null>('foregroundContainer');
const backgroundContainerElement = useTemplateRef<HTMLElement | null>('backgroundContainer');
const fpsInterval = 16.666; // Note: 60 FPS = 1000ms / 60 = 16.666; 120 FPS = 1000ms / 120 = 8.333;
const initialBackgroundElementShift = ref(0);

// Note: Initial translateX should be equal 100%
const moveLeftBackgroundElement = (width: number) =>
	(backgroundContainerElement.value!.style.transform = `translateX(calc(100% - ${width}px)`);

onMounted(() => {
	// Calculating an offsetWidth of all bakcgroundElement actions
	for (let index = 0; index < backgroundContainerElement.value!.childElementCount; index++) {
		const element = backgroundContainerElement.value!.children.item(index) as HTMLElement;
		initialBackgroundElementShift.value += element.offsetWidth;
	}

	moveLeftBackgroundElement(initialBackgroundElementShift.value);
});

const resetPositions = () => {
	left.value = 0;
	foregroundContainerElement.value!.style.transform = `translateX(${left.value}px)`;
	moveLeftBackgroundElement(initialBackgroundElementShift.value);
};

const updatePosition = () => {
	if (hasDragged.value) requestAnimationFrame(updatePosition);

	const now = Date.now();
	const elapsed = now - startTime.value;

	// When a card is still dragged & time elapsed is good
	if (hasDragged.value && elapsed > fpsInterval) {
		// Moving foreground element to the left
		foregroundContainerElement.value!.style.transform = `translateX(${left.value}px)`;

		// If a movement crossed background element's left
		if (left.value < -initialBackgroundElementShift.value) {
			moveLeftBackgroundElement(initialBackgroundElementShift.value + Math.abs(left.value + 3));
		}

		startTime.value = Date.now();
	}
};

const startSwipe = (e: PointerEvent) => {
	dragStartX.value = e.clientX;
	hasDragged.value = true;

	foregroundContainerElement.value!.classList.remove('transition-transform');

	requestAnimationFrame(updatePosition);
};

const moveSwipe = (e: PointerEvent) => {
	const delta = e.clientX - dragStartX.value;

	if (delta < 0) {
		// Open
		left.value = delta;
	}
};

const endSwipe = () => {
	if (hasDragged.value) {
		hasDragged.value = false;

		const foregroundOffsetWidth = foregroundContainerElement.value!.offsetWidth;

		// If a user swipes a bit to the left - reveal background button
		if (left.value < -10 && left.value > -initialBackgroundElementShift.value) {
			left.value = -initialBackgroundElementShift.value;

			// If a user swipes further (over background's button) - auto-finishes a swipe action and emits swiped event
		} else if (left.value <= -initialBackgroundElementShift.value) {
			left.value = -foregroundOffsetWidth - 3;

			emit('swiped');

			setTimeout(() => resetPositions(), 600);

			// Otherwise reset a position
		} else {
			left.value = 0;
		}

		foregroundContainerElement.value!.classList.add('transition-transform');
		foregroundContainerElement.value!.style.transform = `translateX(${left.value}px)`;

		// Covering a last action element over others during swipe if there's more than one action
		if (left.value < -initialBackgroundElementShift.value && backgroundContainerElement.value!.childElementCount > 1) {
			const lastbackgroundContainerElementChild = backgroundContainerElement.value!.children[
				backgroundContainerElement.value!.childElementCount - 1
			] as HTMLElement;
			lastbackgroundContainerElementChild.style.transform = `translateX(-${initialBackgroundElementShift.value - lastbackgroundContainerElementChild.offsetWidth}px)`;
		}

		moveLeftBackgroundElement(Math.abs(left.value));
	}
};
</script>

<template>
<UCard
	:ui="{
		body: {
			base: 'relative',
			padding: '',
		},
	}"
	class="relative overflow-hidden w-full rounded-3xl"
>
	<div
		ref="backgroundContainer"
		class="absolute left-0 right-0 top-0 h-full w-full flex items-center transition will-change-transform transform-gpu translate-x-full duration-500 justify-start z-0 select-none bg-rose-500"
	>
		<!-- <TaskListItemAction
			label="Edit"
			icon="i-heroicons-pencil"
			color="amber"
			class="z-0"
			@click="emit('edit')"
		/> -->

		<TaskListItemAction
			label="Remove"
			icon="i-heroicons-trash"
			color="rose"
			class="z-10"
			@click="emit('remove')"
		/>
	</div>

	<div
		ref="foregroundContainer"
		class="relative w-full h-full flex items-center p-6 z-10 bg-slate-900 will-change-transform transform-gpu duration-500 ring-2 ring-gray-200 stroke-2 dark:ring-gray-800 select-none cursor-grab active:cursor-grabbing"
		@pointerdown="startSwipe"
		@pointermove="moveSwipe"
		@pointerout="endSwipe"
		@pointerup="endSwipe"
	>
		<slot />
	</div>
</UCard>
</template>
