import type UI_COLORS from '#ui-colors';
import type { HeroiconsIconName } from '#ui/icons';

type SettingsID = 'eisenhower_matrix' | 'reduce_motion' | 'sounds';
type SettingsValue = boolean;

export interface UserSetting {
	id: SettingsID;
	value: SettingsValue;
}

export interface UISetting {
	icon: HeroiconsIconName;
	iconBackgroundColor?: (typeof UI_COLORS)[number];
	label: string;
	hasToggle?: boolean;
	hasChevron?: boolean;
	disabled?: boolean;
	defaultValue?: boolean;
}

export interface Setting extends UserSetting, UISetting {}
