export function getTabs(): Promise<chrome.tabs.Tab[]> {
	return new Promise((resolve) => {
		chrome.tabs.query(
			{
				windowId: chrome.windows.WINDOW_ID_CURRENT,
			},
			(tabs) => resolve(tabs)
		);
	});
}

export function closeTab(tabId: number) {
	chrome.tabs.remove(tabId);
}
