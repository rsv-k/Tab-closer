export function getFromStorage(key: string): Promise<string | undefined> {
	return new Promise((resolve) => {
		chrome.storage.local.get([key], function (result) {
			resolve(result[key]);
		});
	});
}

export function setToStorage(key: string, value: string): Promise<boolean> {
	return new Promise((resolve) => {
		chrome.storage.local.set({ [key]: value }, () => {
			resolve(true);
		});
	});
}
