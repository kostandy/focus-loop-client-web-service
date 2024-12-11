import type { Setting } from '~/@types/settings';

export const useSettingsUI = () => {
	const settingsStore = useSettingsStore();

	const settings = computed(() => settingsStore.enrichedSettings);
	onMounted(() => settingsStore.syncWithLocalStorage());

	const handleItemClick = (key: Setting['key']) => {
		// Example: Handle navigation or specific item actions
		if (settingsStore.getByKey(key)?.hasToggle) {
			settingsStore.updateSetting(key, !settingsStore.getByKey(key)?.value);
		}
	};

	return {
		settings,
		handleItemClick,
	};
};
