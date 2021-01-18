function getTabs(): Promise<chrome.tabs.Tab[]> {
	return new Promise((resolve) => {
		chrome.tabs.query(
			{
				windowId: chrome.windows.WINDOW_ID_CURRENT,
			},
			(tabs) => resolve(tabs)
		);
	});
}

function createAlarm(tabId: string) {
	chrome.alarms.create(tabId, {
		delayInMinutes: 1,
	});
}

function getAlarms(): Promise<chrome.alarms.Alarm[]> {
	return new Promise((resolve) => {
		chrome.alarms.getAll((alarms) => resolve(alarms));
	});
}

function clearAllAlarms() {
	return new Promise((resolve) => {
		chrome.alarms.clearAll((wasCleared) => resolve(wasCleared));
	});
}

function clearAlarm(tabId: string): Promise<boolean> {
	return new Promise((resolve) => {
		chrome.alarms.clear(tabId, (wasCleared) => resolve(wasCleared));
	});
}

function closeTab(tabId: number) {
	chrome.tabs.remove(tabId);
}

async function setAlarms() {
	const alarms = await getAlarms();
	const setIds: { [key: string]: boolean } = {};

	for (const a of alarms) {
		setIds[a.name] = true;
	}

	const tabs = await getTabs();

	for (const tab of tabs) {
		const id = tab.id + '';
		if (!tab.active && !setIds[id]) {
			createAlarm(id);
		} else if (tab.active && setIds[id]) {
			await clearAlarm(id);
		}
	}
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
