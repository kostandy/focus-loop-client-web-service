import type { settingsMetadata } from '~/constants/settingsMetadata';

type settingsKey = keyof typeof settingsMetadata;
type settingsValue = boolean | string | number | undefined;

export interface Setting {
	key: settingsKey;
	value: settingsValue;
}
