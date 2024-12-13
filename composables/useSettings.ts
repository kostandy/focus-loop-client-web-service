import type { Setting } from '~/@types/settings';

export const useSettings = (id: Setting['id']) => {
	const { getByID } = useSettingsStore();
	return computed(() => (getByID(id)?.value as boolean) || false);
};

export const useSettingsUI = () => {
	const settingsStore = useSettingsStore();
	const settings = computed(() => settingsStore.enrichedSettings);

	onBeforeMount(() => settingsStore.fetch());

	const handleItemClick = (id: Setting['id']) => {
		// Example: Handle navigation or specific item actions
		if (settingsStore.getByID(id)?.hasToggle) {
			settingsStore.updateSetting(id, !settingsStore.getByID(id)?.value);
		}
	};

	return {
		settings,
		handleItemClick,
	};
};
