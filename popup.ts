const options = document.getElementsByClassName('option');

function setActiveClass(text: string) {
	for (let i = 0; i < options.length; i++) {
		const o = options[i] as HTMLElement;
		o.classList.remove('active');

		if (o.textContent === text) {
			o.classList.add('active');
		}
	}
}

chrome.storage.local.get(['timer'], function (result) {
	const timer: string = result.timer || 'off';
	setActiveClass(timer);

	for (let i = 0; i < options.length; i++) {
		const o = options[i] as HTMLElement;

		o.onclick = () =>
			chrome.storage.local.set({ timer: o.textContent }, () => {
				setActiveClass(o.textContent as string);
			});
	}
});
