chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'placeBet') {
		// Найти элемент для ввода суммы ставки и установить его значение
		const betAmountInput = document.querySelector(
			'input[placeholder="Введите сумму ставки"]'
		) // Замените на соответствующий селектор
		if (betAmountInput) {
			betAmountInput.value = request.amount
		}

		// Найти кнопку для размещения ставки и нажать на неё
		const placeBetButton = document.querySelector('button#place-bet') // Замените на соответствующий селектор
		if (placeBetButton) {
			placeBetButton.click()
		}
	}
})
