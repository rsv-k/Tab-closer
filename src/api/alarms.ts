export function createAlarm(tabId: string, delayInMinutes: number) {
	chrome.alarms.create(tabId, {
		delayInMinutes,
	});
}

export function getAlarms(): Promise<chrome.alarms.Alarm[]> {
	return new Promise((resolve) => {
		chrome.alarms.getAll((alarms) => resolve(alarms));
	});
}

export function clearAllAlarms() {
	return new Promise((resolve) => {
		chrome.alarms.clearAll((wasCleared) => resolve(wasCleared));
	});
}

export function clearAlarm(tabId: string): Promise<boolean> {
	return new Promise((resolve) => {
		chrome.alarms.clear(tabId, (wasCleared) => resolve(wasCleared));
	});
}
