import type { SettingsID, UISetting } from '~/@types/settings';

const createUISetting = ({
	icon,
	label,
	hasToggle = false,
	hasChevron = false,
	defaultValue = false,
	iconBackgroundColor = 'blue',
	disabled = false,
}: UISetting): UISetting => ({
	icon,
	iconBackgroundColor,
	label,
	hasToggle,
	hasChevron,
	disabled,
	defaultValue,
});

export const settingsMetadata: { [id in SettingsID]: UISetting } = {
	eisenhower_matrix: createUISetting({
		icon: 'i-heroicons-rectangle-stack-16-solid',
		iconBackgroundColor: 'rose',
		label: 'Use Eisenhower Matrix',
		hasToggle: true,
		disabled: true,
	}),
	reduce_motion: createUISetting({
		icon: 'i-heroicons-play-pause-16-solid',
		label: 'Reduce Motion',
		hasToggle: true,
		defaultValue: window.matchMedia('(prefers-reduced-motion: reduce)').matches || false,
		iconBackgroundColor: 'sky',
		disabled: true,
	}),
	sounds: createUISetting({
		icon: 'i-heroicons-speaker-wave-solid',
		label: 'Sounds',
		hasToggle: true,
		defaultValue: true,
		iconBackgroundColor: 'amber',
	}),
};
