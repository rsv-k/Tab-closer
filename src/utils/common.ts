import { browser } from 'webextension-polyfill-ts';

export function convertToMinutes(timer: string): number {
	const time = timer.split(':');
	const minutes = +time[0] * 60 + +time[1];

	return minutes;
}

export function setBadges(text: string, color: string): void {
	browser.browserAction.setBadgeText({ text });
	browser.browserAction.setBadgeBackgroundColor({ color });
}

export function addAdditionalZero(n: number): string {
	return (n >= 10 ? n : '0' + n).toString();
}
