export function convertToMinutes(timer: string) {
	const time = timer.split(':');
	const minutes = +time[0] * 60 + +time[1];

	return minutes;
}

export function setBadges(text: string, color: string) {
	chrome.browserAction.setBadgeText({ text });
	chrome.browserAction.setBadgeBackgroundColor({ color });
}

export function addAdditionalZero(n: number) {
	return (n >= 10 ? n : '0' + n).toString();
}
