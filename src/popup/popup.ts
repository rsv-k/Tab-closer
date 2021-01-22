const options = document.getElementsByClassName('option');
import { getFromStorage, setToStorage } from '../api/storage';

function setActiveClass(text: string) {
	for (let i = 0; i < options.length; i++) {
		const o = options[i] as HTMLElement;
		o.classList.remove('active');

		if (o.textContent === text) {
			o.classList.add('active');
		}
	}
}

async function start() {
	const timer = (await getFromStorage('timer')) || 'off';
	setActiveClass(timer);

	for (let i = 0; i < options.length; i++) {
		const o = options[i] as HTMLElement;

		o.onclick = async () => {
			await setToStorage('timer', o.textContent as string);
			setActiveClass(o.textContent as string);
		};
	}
}

start();
