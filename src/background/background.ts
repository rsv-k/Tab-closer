import { getTabs, closeTab } from '../api/tabs';
import { setBadges, convertToMinutes } from '../api/common';
import { getFromStorage } from '../api/storage';
import {
	getAlarms,
	createAlarm,
	clearAlarm,
	clearAllAlarms,
} from '../api/alarms';

async function setAlarms() {
	try {
		const timer = (await getFromStorage('timer')) || 'off';
		if (timer === 'off') {
			setBadges('OFF', '#53354a');
			return;
		} else {
			setBadges('ON', '#53354a');
		}

		const delayInMinutes = convertToMinutes(timer);

		const alarms = await getAlarms();
		const setIds: { [key: string]: boolean } = {};

		for (const a of alarms) {
			setIds[a.name] = true;
		}

		const tabs = await getTabs();

		for (const tab of tabs) {
			const id = tab.id + '';
			if (!tab.active && !setIds[id]) {
				createAlarm(id, delayInMinutes);
			} else if (tab.active && setIds[id]) {
				clearAlarm(id);
			}
		}
	} catch (err) {}
}

clearAllAlarms();
setAlarms();

chrome.alarms.onAlarm.addListener((alarm) => {
	closeTab(+alarm.name);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
	await setAlarms();
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
	await clearAlarm(tabId + '');
});

chrome.storage.onChanged.addListener(async (changes) => {
	if (changes.timer) {
		await clearAllAlarms();
		await setAlarms();
	}
});
