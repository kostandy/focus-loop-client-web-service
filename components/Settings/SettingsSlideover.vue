<script lang="ts" setup>
import { useSettingsUI } from '~/composables/useSettings';
import { DONATION_LINK, DONATION_WALLET } from '~/constants/linkConstants';

defineProps<{
	isVisible: Ref<boolean>;
}>();

const emit = defineEmits<{
	(e: 'close'): void;
}>();

const donationLink = DONATION_LINK;
const { settings, handleItemClick } = useSettingsUI();

const close = () => emit('close');
const toast = useToast();
const copyWallet = async () => {
	try {
		await navigator.clipboard.writeText(DONATION_WALLET);
		toast.add({ id: 'copy_success', title: 'Wallet copied successfully!', color: 'emerald' });
	} catch (error) {
		console.error('Failed to copy text: ', error);
	}
};
</script>

<template>
<USlideover
	key="settings"
	:model-value="isVisible.value"
	:ui="{
		width: 'max-w-full',
		height: 'h-screen max-h-full',
	}"
>
	<UCard
		:ui="{
			ring: '',
			divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			shadow: 'shadow-none',
			header: {
				padding: 'px-6 py-4 sm:p-6',
			},
			body: {
				padding: 'px-6 py-4 sm:p-6',
			},
			footer: {
				base: 'absolute bottom-0 w-full flex flex-col items-center gap-y-2',
			},
		}"
	>
		<template #header>
			<div class="flex items-center justify-between">
				<UButton
					color="gray"
					variant="link"
					icon="i-heroicons-arrow-left-solid"
					@click="close"
				/>

				<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
					Settings
				</h3>

				<UButton
					color="gray"
					variant="link"
					icon="i-heroicons-x-mark-20-solid"
					@click="close"
				/>
			</div>
		</template>

		<div class="flex flex-col">
			<SettingsList
				:items="settings"
				@item-click="handleItemClick"
			/>
		</div>

		<template #footer>
			<UButton
				:to="donationLink"
				label="Donate using link"
				trailing-icon="i-heroicons-arrow-top-right-on-square-16-solid"
				size="md"
				variant="link"
				external
			/>

			<UButton
				label="Press to copy wallet"
				trailing-icon="i-heroicons-clipboard-document"
				size="md"
				variant="ghost"
				@click="copyWallet"
			/>

			<div class="flex items-center justify-center">
				Made with
				<UIcon
					name="i-heroicons-heart"
					class="mx-1 bg-rose-500"
				/>
				for people by people
			</div>
		</template>
	</UCard>
</USlideover>
</template>

<style scoped></style>
