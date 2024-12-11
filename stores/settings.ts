import { defineStore } from 'pinia';
import type { Setting } from '~/@types/settings';
import { settingsMetadata } from '~/constants/settingsMetadata';

interface SettingsState {
	settings: Setting[];
}

export const useSettingsStore = defineStore('settingsStore', {
	state: (): SettingsState => ({
		settings: JSON.parse(localStorage.getItem('user-settings') || '[]') as Setting[],
	}),

	getters: {
		getByKey() {
			return (key: Setting['key']) => this.enrichedSettings.find((setting) => setting.key === key);
		},
		enrichedSettings: (state) =>
			state.settings.map((setting) => ({
				...setting,
				...settingsMetadata[setting.key],
			})),
	},

	actions: {
		assignDefaultValues() {
			this.settings = Object.entries(settingsMetadata).map(([key, metadata]) => ({
				key: key as Setting['key'],
				value: metadata.defaultValue,
			}));
		},

		syncWithLocalStorage() {
			const localSettings = localStorage.getItem('user-settings');
			if (localSettings) {
				this.settings = JSON.parse(localSettings);
			} else {
				this.assignDefaultValues();
				this.saveToLocalStorage();
			}
		},

		saveToLocalStorage() {
			localStorage.setItem('user-settings', JSON.stringify(this.settings));
		},

		fetchSettings() {
			// Simulated fetching (commented out actual API call)
			// const response = await fetch('/api/settings');
			// this.settings = await response.json();
			const localSettings = localStorage.getItem('user-settings');
			if (localSettings) {
				this.settings = JSON.parse(localSettings);
			}
		},

		updateSetting(key: Setting['key'], value: Setting['value']) {
			const settingIndex = this.settings.findIndex((s) => s.key === key);
			if (settingIndex !== -1) {
				this.settings[settingIndex].value = value;
			} else {
				this.settings.push({ key, value });
			}

			// Simulated saving (commented out actual API call)
			// await fetch('/api/settings', {
			//   method: 'POST',
			//   body: JSON.stringify(this.settings),
			// });

			// Save to localStorage
			localStorage.setItem('user-settings', JSON.stringify(this.settings));
		},
	},
});
