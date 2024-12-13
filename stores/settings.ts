import { defineStore } from 'pinia';
import type { Setting, UserSetting } from '~/@types/settings';
import { USER_SETTINGS } from '~/constants/localStorageKeys';

interface SettingsState {
	settings: UserSetting[];
}

export const useSettingsStore = defineStore('settingsStore', {
	state: (): SettingsState => ({
		settings: [] as UserSetting[],
	}),

	getters: {
		getByID() {
			return (id: Setting['id']) => this.enrichedSettings.find((setting) => setting.id === id);
		},
		enrichedSettings: (state): Setting[] =>
			state.settings.map((setting) => ({
				...setting,
				...settingsMetadata[setting.id],
			})),
	},

	actions: {
		setDefaultValues(): void {
			this.settings = Object.entries(settingsMetadata).map(([id, metadata]) => ({
				id: id as Setting['id'],
				value: metadata.defaultValue ?? false,
			}));
		},

		fetchSettings(): UserSetting[] {
			// Simulated fetching (commented out actual API call)
			// const response = await fetch('/api/settings');
			// this.settings = await response.json();
			const data = loadFromLocalStorage(USER_SETTINGS);

			if (!data?.length) {
				this.setDefaultValues();
				saveToLocalStorage(USER_SETTINGS, this.settings);

				return this.settings;
			}

			this.settings = data;

			return data;
		},

		updateSetting(id: UserSetting['id'], value: UserSetting['value']) {
			const settingIndex = this.settings.findIndex((s) => s.id === id);
			if (settingIndex !== -1) {
				this.settings[settingIndex].value = value;
			} else {
				this.settings.push({ id, value });
			}

			// Simulated saving (commented out actual API call)
			// await fetch('/api/settings', {
			//   method: 'POST',
			//   body: JSON.stringify(this.settings),
			// });

			saveToLocalStorage(USER_SETTINGS, this.settings);
		},
	},
});
