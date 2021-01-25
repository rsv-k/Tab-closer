import { setBadges, convertToMinutes } from '../api/common';
import { browser } from 'webextension-polyfill-ts';

async function setAlarms() {
	const timer: string =
		(await browser.storage.local.get('timer')).timer || '00:00';

	setBadges(timer === '00:00' ? 'OFF' : 'ON', '#53354a');

	const delayInMinutes = convertToMinutes(timer);

	const alarms = await browser.alarms.getAll();
	const setIds: { [key: string]: boolean } = {};

	for (const a of alarms) {
		setIds[a.name] = true;
	}

	const tabs = await browser.tabs.query({
		windowId: browser.windows.WINDOW_ID_CURRENT,
	});

	for (const tab of tabs) {
		const id = tab.id + '';
		if (!tab.active && !setIds[id]) {
			browser.alarms.create(id, { delayInMinutes });
		} else if (tab.active && setIds[id]) {
			browser.alarms.clear(id);
		}
	}
}

browser.alarms.clearAll();
setAlarms();

chrome.alarms.onAlarm.addListener((alarm) => {
	browser.tabs.remove(+alarm.name);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
	await setAlarms();
});

chrome.tabs.onRemoved.addListener((tabId) => {
	browser.alarms.clear(tabId + '');
});

chrome.storage.onChanged.addListener(async (changes) => {
	if (changes.timer) {
		await browser.alarms.clearAll();
		await setAlarms();
	}
});
