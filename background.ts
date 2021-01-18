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

async function setAlarms() {
	const tabs = await getTabs();

	for (const tab of tabs) {
		createAlarm(tab.id + '');
	}
}

setAlarms();

chrome.alarms.onAlarm.addListener((alarm) => {
	console.log(alarm.name);
});
