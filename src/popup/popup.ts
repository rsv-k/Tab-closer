import { addAdditionalZero } from '../utils/common';
import { browser } from 'webextension-polyfill-ts';
import './popup.scss';

const buttons = document.querySelectorAll('.btn');
const spanTexts = document.querySelectorAll('.text');
const button = document.getElementById('button')!;

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
}

button.addEventListener('click', () => {
	const timer = spanTexts[0].textContent! + ':' + spanTexts[1].textContent!;

	browser.storage.local.set({
		timer,
	});
	window.close();
});

start();
