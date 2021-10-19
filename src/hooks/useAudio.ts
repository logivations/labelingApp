/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import { Audio } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';

const usePlayAudio = () => {
	const [signals, setSignals] = useState<Map<string, Audio.Sound>>(new Map());

	useEffect(() => {
		(async () => {
			const sounds = new Map();
			await Audio.Sound.createAsync(require('../../assets/sounds/warning-notification-sound.wav')).then(
				({ sound }) => sounds.set('warningNotification', sound),
			);
			await Audio.Sound.createAsync(require('../../assets/sounds/warning-alarm.wav')).then(({ sound }) =>
				sounds.set('warningAlarm', sound),
			);
			await Audio.Sound.createAsync(require('../../assets/sounds/success-notification.wav')).then(({ sound }) =>
				sounds.set('successNotification', sound),
			);
			setSignals(sounds);
		})();
	}, []);

	return useCallback(
		async (signalName: string) => {
			const signal: Audio.Sound | undefined = signals.get(signalName);
			if (signal) {
				await signal.setPositionAsync(0);
				await signal.playAsync();
			}
		},
		[signals],
	);
};

export default usePlayAudio;
