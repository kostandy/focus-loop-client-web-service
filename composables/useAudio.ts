import type { AUDIO_PATHS } from '@/constants/audioConstants';

export const useAudio = (path: (typeof AUDIO_PATHS)[keyof typeof AUDIO_PATHS]) => {
	const isAudioAvailable = useSettings('sounds');
	const audio = computed(() => (isAudioAvailable.value ? loadAudio(path) : null));

	return {
		audio,
	};
};
