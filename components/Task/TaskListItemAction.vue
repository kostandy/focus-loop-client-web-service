<script lang="ts" setup>
const {
	label = 'Awesome label',
	textClasses = 'text-white',
	color = 'primary',
	shade = 500,
	shadeHover = 600,
} = defineProps<{
	label?: string;
	textClasses?: string | Array<string>;
	icon: string;
	color?: string;
	shade?: number;
	shadeHover?: number;
	onClick: (event: MouseEvent) => void;
}>();
</script>

<template>
<div
	class="flex flex-col justify-center items-center w-24 sm:w-28 h-full p-4 sm:p-6 transition duration-500 cursor-pointer"
	:class="[`bg-${color}-${shade}`, `hover:bg-${color}-${shadeHover}`]"
	v-bind="{ onClick }"
>
	<div class="flex flex-col items-center">
		<UIcon
			:name="icon"
			size="xl"
			class="mb-2"
		/>
		<span :class="textClasses">{{ label }}</span>
	</div>
</div>
</template>

<style scoped></style>
