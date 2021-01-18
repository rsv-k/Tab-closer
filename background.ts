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

async function setAlarms() {
	const alarms = await getAlarms();
	const setIds: { [key: string]: boolean } = {};

	for (const a of alarms) {
		setIds[a.name] = true;
	}

	const tabs = await getTabs();

	console.log('Alarms: ', alarms);
	console.log('Tabs ', tabs);

	for (const tab of tabs) {
		if (!tab.active && !setIds[tab.id + '']) {
			createAlarm(tab.id + '');
		}
	}
}

clearAllAlarms();
setAlarms();

chrome.alarms.onAlarm.addListener((alarm) => {
	console.log(alarm.name);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log(activeInfo);
});
