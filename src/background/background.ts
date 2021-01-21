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

function createAlarm(tabId: string, delayInMinutes: number) {
	chrome.alarms.create(tabId, {
		delayInMinutes,
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

function getFromStorage(key: string): Promise<string | undefined> {
	return new Promise((resolve) => {
		chrome.storage.local.get([key], function (result) {
			resolve(result[key]);
		});
	});
}

function convertToMinutes(timer: string) {
	const time = +timer.slice(0, -1);

	return timer.slice(-1) === 'h' ? time * 60 : time;
}

function setBadges(text: string, color: string) {
	chrome.browserAction.setBadgeText({ text });
	chrome.browserAction.setBadgeBackgroundColor({ color });
}

async function setAlarms() {
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

chrome.storage.onChanged.addListener(async (changes) => {
	if (changes.timer) {
		await clearAllAlarms();
		await setAlarms();
	}
});
