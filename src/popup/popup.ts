import { addAdditionalZero } from '../api/common';
import { getFromStorage, setToStorage } from '../api/storage';

const buttons = document.querySelectorAll('span.btn');
const spanTexts = document.querySelectorAll('span.text')!;
let initialTime: string;

async function start() {
	const maxAmount: { [key: string]: number } = {
		'0': 24,
		'1': 59,
	};

	const result = await getFromStorage('timer');
	const timer = (/\d\d\:\d\d/.test(result!.toString())
		? result
		: '00:00')!.split(':');
	initialTime = timer.join(':');
	spanTexts[0].textContent = timer[0];
	spanTexts[1].textContent = timer[1];

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

document.getElementById('button')!.addEventListener('click', () => {
	const time = [spanTexts[0].textContent!, spanTexts[1].textContent!].join(
		':'
	);

	if (time === initialTime) {
		return;
	}

	setToStorage('timer', time);
});

start();
