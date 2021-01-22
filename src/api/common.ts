export function convertToMinutes(timer: string) {
	const time = +timer.slice(0, -1);

	return timer.slice(-1) === 'h' ? time * 60 : time;
}

export function setBadges(text: string, color: string) {
	chrome.browserAction.setBadgeText({ text });
	chrome.browserAction.setBadgeBackgroundColor({ color });
}
