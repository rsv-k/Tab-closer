import { addAdditionalZero } from '../utils/common';
import { browser } from 'webextension-polyfill-ts';
import './popup.scss';

const buttons = document.querySelectorAll('.btn');
const spanTexts = document.querySelectorAll('.text');
const button = document.getElementById('button')!;
const excludeButton = document.getElementById('exclude')!;
const links = document.querySelectorAll('.header__link');
const textarea = document.querySelector(
	'.exclude__textarea'
)! as HTMLTextAreaElement;

function setActiveLink(l: HTMLLinkElement) {
	const className = 'header__link--active';

	for (const link of links) {
		link.classList.remove(className);
	}

	l.classList.add(className);
}

function toggleVisibleContent(l: HTMLLinkElement) {
	if (l.classList.contains('header__link--active')) {
		return;
	}

	const container = document.querySelector('.container')!;
	const exclude = document.querySelector('.exclude')!;

	container.classList.toggle('invisible');
	exclude.classList.toggle('invisible');
}

async function start() {
	const maxAmount: { [key: string]: number } = {
		'0': 24,
		'1': 59,
	};

	const result = (await browser.storage.local.get('timer')).timer || '00:00';
	[spanTexts[0].textContent, spanTexts[1].textContent] = result.split(':');

	for (let i = 0; i < buttons.length; i++) {
		const btn = buttons[i] as HTMLSpanElement;

		btn.onclick = () => {
			const textElement =
				btn.nextElementSibling! || btn.previousElementSibling!;
			const number = +textElement.textContent!;
			const upTo = maxAmount[Math.floor(i / 2) % 2];
			const text =
				i % 2 === 0
					? addAdditionalZero((number + 1) % (upTo + 1))
					: addAdditionalZero(number - 1 < 0 ? upTo : number - 1);

			textElement.textContent = text;
		};
	}

	for (const link of links) {
		const l = link as HTMLLinkElement;

		l.onclick = () => {
			toggleVisibleContent(l);
			setActiveLink(l);
		};
	}

	const excludedUrls: string[] = JSON.parse(
		(await browser.storage.local.get('excludedUrls')).excludedUrls || '[]'
	);
	for (const url of excludedUrls) {
		textarea.value += url + '\n';
	}
}

button.addEventListener('click', () => {
	const timer = spanTexts[0].textContent! + ':' + spanTexts[1].textContent!;

	browser.storage.local.set({
		timer,
	});
	window.close();
});

excludeButton.addEventListener('click', () => {
	const urls = JSON.stringify(textarea.value.split(/\s+/));

	browser.storage.local.set({ excludedUrls: urls });
});

start();
